package com.Devchat.Service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.Devchat.DTO.MessageDTO;
import com.Devchat.DTO.CreateMessageRequest;
import com.Devchat.entity.Message;
import com.Devchat.entity.User;
import com.Devchat.repository.MessageRepository;
import com.Devchat.repository.UserRepository;
import com.Devchat.util.UserContext;

@Service // Marks this class as a Spring service component
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository; // Repository for database operations
    private final UserRepository userRepository; // Repository for user operations

    // Constructor injection for the repository
    public MessageServiceImpl(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    // Send a new message
    /*
     * Creates a new Message entity from the request
     * Saves it to the database
     * Converts the saved entity to a DTO
     */
    @Override
    public MessageDTO sendMessage(CreateMessageRequest request) {
        // Get current authenticated user
        User currentUser = UserContext.requireCurrentUser();

        // Find the receiver user
        User receiver = userRepository.findByUsername(request.getReceiver())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        // Create a new Message entity from the request DTO
        Message message = new Message(currentUser, receiver, request.getContent());

        // Save the message to the database
        Message saved = messageRepository.save(message);

        // Convert the saved entity to a DTO and return
        return toDTO(saved);
    }

    // Send a new message via WebSocket (with explicit sender username)
    /*
     * Creates a new Message entity for WebSocket messages
     * Uses explicit sender username instead of UserContext
     * Saves it to the database
     * Converts the saved entity to a DTO
     */
    @Override
    public MessageDTO sendWebSocketMessage(String senderUsername, String receiverUsername, String content) {
        // Find the sender user
        User sender = userRepository.findByUsername(senderUsername)
                .orElseThrow(() -> new RuntimeException("Sender not found: " + senderUsername));

        // Find the receiver user
        User receiver = userRepository.findByUsername(receiverUsername)
                .orElseThrow(() -> new RuntimeException("Receiver not found: " + receiverUsername));

        // Create a new Message entity
        Message message = new Message(sender, receiver, content);

        // Save the message to the database
        Message saved = messageRepository.save(message);

        // Convert the saved entity to a DTO and return
        return toDTO(saved);
    }

    // Get all messages between two users (conversation)
    /*
     * Gets all messages between two users, regardless of direction
     * Converts each Message to a DTO
     */
    @Override
    public List<MessageDTO> getMessagesBetweenUsers(Long user1Id, Long user2Id) {
        // Get current authenticated user
        User currentUser = UserContext.requireCurrentUser();

        // Ensure current user is one of the participants
        if (!currentUser.getId().equals(user1Id) && !currentUser.getId().equals(user2Id)) {
            throw new SecurityException("Access denied: You can only view conversations you're part of");
        }

        // Find messages where (sender=user1 AND receiver=user2) OR (sender=user2 AND
        // receiver=user1)
        List<Message> messages = messageRepository.findBySenderIdAndReceiverIdOrReceiverIdAndSenderId(
                user1Id, user2Id, user1Id, user2Id);

        // Convert each Message entity to a DTO
        return messages.stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Get all messages sent by a user
    @Override
    public List<MessageDTO> getMessagesSentBy(Long senderId) {
        // Get current authenticated user
        User currentUser = UserContext.requireCurrentUser();

        // Users can only see messages they sent
        if (!currentUser.getId().equals(senderId)) {
            throw new SecurityException("Access denied: You can only view messages you sent");
        }

        // Find messages by sender and convert to DTOs
        return messageRepository.findBySenderId(senderId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Get all messages received by a user
    @Override
    public List<MessageDTO> getMessagesReceivedBy(Long receiverId) {
        // Get current authenticated user
        User currentUser = UserContext.requireCurrentUser();

        // Users can only see messages they received
        if (!currentUser.getId().equals(receiverId)) {
            throw new SecurityException("Access denied: You can only view messages you received");
        }

        // Find messages by receiver and convert to DTOs
        return messageRepository.findByReceiverId(receiverId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Mark a message as read
    @Override
    @Transactional // Ensures the operation is atomic
    public void markMessageAsRead(Long messageId) {
        // Get current authenticated user
        User currentUser = UserContext.requireCurrentUser();

        // Find the message by its ID
        Optional<Message> optional = messageRepository.findById(messageId);
        if (optional.isPresent()) {
            Message message = optional.get(); // Get the message entity

            // Ensure user can only mark messages they received as read
            if (!message.getReceiver().getId().equals(currentUser.getId())) {
                throw new SecurityException("Access denied: You can only mark messages you received as read");
            }

            message.setRead(true); // Mark as read
            messageRepository.save(message); // Save the updated entity
        }
        // If not found, do nothing
    }

    // Helper method to convert Message entity to MessageDTO
    private MessageDTO toDTO(Message message) {
        return new MessageDTO(
                message.getId(),
                message.getSender().getUsername(),
                message.getReceiver().getUsername(),
                message.getContent(),
                message.getTimestamp(),
                message.isRead(),
                message.getType());
    }
}
