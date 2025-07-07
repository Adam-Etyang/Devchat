package com.Devchat.Service;

import com.Devchat.DTO.MessageDTO;
import com.Devchat.DTO.CreateMessageRequest;
import java.util.List;

public interface MessageService {
  // Send a new message
  MessageDTO sendMessage(CreateMessageRequest request);

  // Get all messages between two users (conversation)
  List<MessageDTO> getMessagesBetweenUsers(Long user1Id, Long user2Id);

  // Get all messages sent by a user
  List<MessageDTO> getMessagesSentBy(Long senderId);

  // Get all messages received by a user
  List<MessageDTO> getMessagesReceivedBy(Long receiverId);

  // Mark a message as read
  void markMessageAsRead(Long messageId);
}
