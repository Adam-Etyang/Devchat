package com.Devchat.Controller;

import com.Devchat.DTO.CreateMessageRequest;
import com.Devchat.DTO.MessageDTO;
import com.Devchat.Service.MessageService;
import com.Devchat.Service.UserService;
import com.Devchat.entity.Message;
import com.Devchat.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Collections;

@Controller
@RestController
@RequestMapping("/api/messages")
public class MessageController {

  @Autowired
  private MessageService messageService;

  @Autowired
  private UserService userService;

  @Autowired
  private SimpMessagingTemplate messagingTemplate;

  /**
   * Handle chat messages sent via WebSocket
   * Saves message to database and broadcasts to all users
   */
  @MessageMapping("/chat.sendMessage")
  @SendTo("/topic/public")
  public MessageDTO sendMessage(@Payload MessageDTO chatMessage) {
    try {
      // Save message to database if it's a CHAT type message
      if (Message.MessageType.CHAT.equals(chatMessage.getType())) {
        // Save to database using the WebSocket method that doesn't rely on UserContext
        MessageDTO savedMessage = messageService.sendWebSocketMessage(
            chatMessage.getSender(),
            chatMessage.getReceiver(),
            chatMessage.getContent());

        // Update the message with database ID and timestamp
        chatMessage.setId(savedMessage.getId());
        chatMessage.setTimestamp(savedMessage.getTimestamp());
      }

      return chatMessage;
    } catch (Exception e) {
      // Log error and return original message if database save fails
      System.err.println("Error saving message to database: " + e.getMessage());
      return chatMessage;
    }
  }

  /**
   * Handle user join/leave events
   * Broadcasts user status to all connected users
   */
  @MessageMapping("/chat.addUser")
  @SendTo("/topic/public")
  public MessageDTO addUser(@Payload MessageDTO chatMessage, SimpMessageHeaderAccessor headerAccessor) {
    // Add username to web socket session
    headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());

    // Broadcast join/leave message
    return chatMessage;
  }

  /**
   * Handle private messages between users
   * Sends message only to specific user
   */
  @MessageMapping("/chat.privateMessage")
  public void sendPrivateMessage(@Payload MessageDTO chatMessage) {
    try {
      // Save private message to database
      if (Message.MessageType.CHAT.equals(chatMessage.getType()) && chatMessage.getReceiver() != null) {
        MessageDTO savedMessage = messageService.sendWebSocketMessage(
            chatMessage.getSender(),
            chatMessage.getReceiver(),
            chatMessage.getContent());

        chatMessage.setId(savedMessage.getId());
        chatMessage.setTimestamp(savedMessage.getTimestamp());
      }

      // Send to specific user
      messagingTemplate.convertAndSendToUser(
          chatMessage.getReceiver(),
          "/topic/private",
          chatMessage);

      // Also send back to sender for confirmation
      messagingTemplate.convertAndSendToUser(
          chatMessage.getSender(),
          "/topic/private",
          chatMessage);

    } catch (Exception e) {
      System.err.println("Error sending private message: " + e.getMessage());
    }
  }

  /**
   * Handle typing indicators
   */
  @MessageMapping("/chat.typing")
  @SendTo("/topic/typing")
  public MessageDTO handleTyping(@Payload MessageDTO chatMessage) {
    return chatMessage;
  }

  /**
   * Get conversation history between two users
   * Sends via WebSocket to requesting user
   */
  @MessageMapping("/chat.getConversation")
  public void getConversation(@Payload Long[] userIds, SimpMessageHeaderAccessor headerAccessor) {
    try {
      String requestingUser = (String) headerAccessor.getSessionAttributes().get("username");
      if (userIds.length >= 2) {
        List<MessageDTO> messages = messageService.getMessagesBetweenUsers(userIds[0], userIds[1]);

        // Send conversation history back to requesting user
        messagingTemplate.convertAndSendToUser(
            requestingUser,
            "/topic/conversation",
            messages);
      }
    } catch (Exception e) {
      System.err.println("Error getting conversation: " + e.getMessage());
    }
  }

  /**
   * Get user's sent messages
   */
  @MessageMapping("/chat.getSentMessages")
  public void getSentMessages(@Payload Long senderId, SimpMessageHeaderAccessor headerAccessor) {
    try {
      String requestingUser = (String) headerAccessor.getSessionAttributes().get("username");
      List<MessageDTO> messages = messageService.getMessagesSentBy(senderId);

      messagingTemplate.convertAndSendToUser(
          requestingUser,
          "/topic/sentMessages",
          messages);
    } catch (Exception e) {
      System.err.println("Error getting sent messages: " + e.getMessage());
    }
  }

  /**
   * Get user's received messages
   */
  @MessageMapping("/chat.getReceivedMessages")
  public void getReceivedMessages(@Payload Long receiverId, SimpMessageHeaderAccessor headerAccessor) {
    try {
      String requestingUser = (String) headerAccessor.getSessionAttributes().get("username");
      List<MessageDTO> messages = messageService.getMessagesReceivedBy(receiverId);

      messagingTemplate.convertAndSendToUser(
          requestingUser,
          "/topic/receivedMessages",
          messages);
    } catch (Exception e) {
      System.err.println("Error getting received messages: " + e.getMessage());
    }
  }

  // REST endpoints for initial data loading

  /**
   * Get recent public messages for chat history
   * Note: This endpoint needs to be updated to work with user IDs
   * For now, it's disabled as it doesn't fit the new user isolation model
   */
  @GetMapping("/public/recent")
  public ResponseEntity<List<MessageDTO>> getRecentPublicMessages(@RequestParam(defaultValue = "50") int limit) {
    try {
      // This endpoint needs to be redesigned for user isolation
      // For now, return empty list as public messages don't fit the isolation model
      return ResponseEntity.ok(List.of());
    } catch (Exception e) {
      System.err.println("Error getting recent public messages: " + e.getMessage());
      return ResponseEntity.status(500).build();
    }
  }

  /**
   * Get conversation between two users
   */
  @GetMapping("/conversation")
  public ResponseEntity<List<MessageDTO>> getConversation(
      @RequestParam Long user1Id,
      @RequestParam Long user2Id) {
    try {
      List<MessageDTO> messages = messageService.getMessagesBetweenUsers(user1Id, user2Id);
      return ResponseEntity.ok(messages);
    } catch (SecurityException e) {
      System.err.println("SecurityException: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    } catch (Exception e) {
      System.err.println("Error getting conversation: " + e.getMessage());
      return ResponseEntity.status(500).build();
    }
  }

  /**
   * Mark message as read
   */
  @PutMapping("/{id}/read")
  public ResponseEntity<Void> markMessageAsRead(@PathVariable Long id) {
    try {
      messageService.markMessageAsRead(id);
      return ResponseEntity.noContent().build();
    } catch (SecurityException e) {
      System.err.println("SecurityException: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    } catch (Exception e) {
      System.err.println("Error marking message as read: " + e.getMessage());
      return ResponseEntity.status(500).build();
    }
  }
}
