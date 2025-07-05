package com.Devchat.Service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.Devchat.DTO.MessageDTO;
import com.Devchat.DTO.CreateMessageRequest;
import com.Devchat.entity.Message;
import com.Devchat.repository.MessageRepository;

@Service // Marks this class as a Spring service component
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository; // Repository for database operations

    // Constructor injection for the repository
    public MessageServiceImpl(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    // Send a new message
    /*
     * Creates a new Message entity from the request
     * Saves it to the database
     * Converts the saved entity to a DTO
     */
    @Override
    public MessageDTO sendMessage(CreateMessageRequest request) {
        // Create a new Message entity from the request DTO
        Message message = new Message(
                request.getSender(),
                request.getReceiver(),
                request.getContent());
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
    public List<MessageDTO> getMessagesBetweenUsers(String user1, String user2) {
        // Find messages where (sender=user1 AND receiver=user2) OR (sender=user2 AND
        // receiver=user1)
        List<Message> messages = messageRepository.findBySenderAndReceiverOrReceiverAndSender(
                user1, user2, user1, user2);
        // Convert each Message entity to a DTO
        return messages.stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Get all messages sent by a user
    @Override
    public List<MessageDTO> getMessagesSentBy(String sender) {
        // Find messages by sender and convert to DTOs
        return messageRepository.findBySender(sender)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Get all messages received by a user
    @Override
    public List<MessageDTO> getMessagesReceivedBy(String receiver) {
        // Find messages by receiver and convert to DTOs
        return messageRepository.findByReceiver(receiver)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Mark a message as read
    @Override
    @Transactional // Ensures the operation is atomic
    public void markMessageAsRead(Long messageId) {
        // Find the message by its ID
        Optional<Message> optional = messageRepository.findById(messageId);
        if (optional.isPresent()) {
            Message message = optional.get(); // Get the message entity
            message.setRead(true); // Mark as read
            messageRepository.save(message); // Save the updated entity
        }
        // If not found, do nothing
    }

    // Helper method to convert Message entity to MessageDTO
    private MessageDTO toDTO(Message message) {
        return new MessageDTO(
                message.getId(),
                message.getSender(),
                message.getReceiver(),
                message.getContent(),
                message.getTimestamp(),
                message.isRead());
    }
}
