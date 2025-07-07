package com.Devchat.repository;

import com.Devchat.entity.Message;
import com.Devchat.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;//for return types

public interface MessageRepository extends JpaRepository<Message, Long> {
    // Find all messages sent by a specific user
    List<Message> findBySender(User sender);

    // Find all messages received by a specific user
    List<Message> findByReceiver(User receiver);

    // Find all messages between two users (for a conversation)
    List<Message> findBySenderAndReceiver(User sender, User receiver);

    // Find all messages in a conversation (regardless of who sent/received)
    List<Message> findBySenderAndReceiverOrReceiverAndSender(
            User sender1, User receiver1, User sender2, User receiver2);

    // Find all messages sent by a specific user ID
    List<Message> findBySenderId(Long senderId);

    // Find all messages received by a specific user ID
    List<Message> findByReceiverId(Long receiverId);

    // Find all messages between two users by ID (regardless of who sent/received)
    List<Message> findBySenderIdAndReceiverIdOrReceiverIdAndSenderId(
            Long sender1Id, Long receiver1Id, Long sender2Id, Long receiver2Id);
}