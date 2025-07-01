package com.Devchat.projectmodule.repositories;

import com.Devchat.projectmodule.Entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;//for return types

public interface MessageRepository extends JpaRepository<Message, Long> {
    // Find all messages sent by a specific user
    List<Message> findBySender(String sender);

    // Find all messages received by a specific user
    List<Message> findByReceiver(String receiver);

    // Find all messages between two users (for a conversation)
    List<Message> findBySenderAndReceiver(String sender, String receiver);

    // Find all messages in a conversation (regardless of who sent/received)
    List<Message> findBySenderAndReceiverOrReceiverAndSender(
            String sender1, String receiver1, String sender2, String receiver2
    );
}