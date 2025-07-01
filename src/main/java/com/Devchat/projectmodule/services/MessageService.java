package com.Devchat.projectmodule.services;

import com.Devchat.projectmodule.dto.MessageDTO;
import com.Devchat.projectmodule.dto.CreateMessageRequest;
import java.util.List;

public interface MessageService {
    // Send a new message
    MessageDTO sendMessage(CreateMessageRequest request);

    // Get all messages between two users (conversation)
    List<MessageDTO> getMessagesBetweenUsers(String user1, String user2);

    // Get all messages sent by a user
    List<MessageDTO> getMessagesSentBy(String sender);

    // Get all messages received by a user
    List<MessageDTO> getMessagesReceivedBy(String receiver);

    // Mark a message as read
    void markMessageAsRead(Long messageId);
}
