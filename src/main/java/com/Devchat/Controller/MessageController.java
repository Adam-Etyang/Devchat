package com.Devchat.Controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;

import com.Devchat.DTO.MessageDTO;
import com.Devchat.DTO.CreateMessageRequest;
import com.Devchat.Service.MessageService;

@RestController // Marks this class as a REST controller
@RequestMapping("/api/messages") // Base URL for all endpoints in this controller
public class MessageController {

    private final MessageService messageService; // Service layer dependency

    // Constructor injection for the service
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    // Endpoint to send a new message
    @PostMapping
    public ResponseEntity<MessageDTO> sendMessage(@RequestBody CreateMessageRequest request) {
        // Call the service to send the message
        MessageDTO message = messageService.sendMessage(request);
        // Return the created message with HTTP 201 status
        return new ResponseEntity<>(message, HttpStatus.CREATED);
    }

    // Endpoint to get all messages between two users (conversation)
    @GetMapping("/conversation")
    public ResponseEntity<List<MessageDTO>> getMessagesBetweenUsers(
            @RequestParam String user1,
            @RequestParam String user2) {
        // Call the service to get messages between the two users
        List<MessageDTO> messages = messageService.getMessagesBetweenUsers(user1, user2);
        // Return the list of messages with HTTP 200 status
        return ResponseEntity.ok(messages);
    }

    // Endpoint to get all messages sent by a user
    @GetMapping("/sent/{sender}")
    public ResponseEntity<List<MessageDTO>> getMessagesSentBy(@PathVariable String sender) {
        // Call the service to get messages sent by the user
        List<MessageDTO> messages = messageService.getMessagesSentBy(sender);
        // Return the list of messages with HTTP 200 status
        return ResponseEntity.ok(messages);
    }

    // Endpoint to get all messages received by a user
    @GetMapping("/received/{receiver}")
    public ResponseEntity<List<MessageDTO>> getMessagesReceivedBy(@PathVariable String receiver) {
        // Call the service to get messages received by the user
        List<MessageDTO> messages = messageService.getMessagesReceivedBy(receiver);
        // Return the list of messages with HTTP 200 status
        return ResponseEntity.ok(messages);
    }

    // Endpoint to mark a message as read
    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markMessageAsRead(@PathVariable Long id) {
        // Call the service to mark the message as read
        messageService.markMessageAsRead(id);
        // Return HTTP 204 No Content (success, no body)
        return ResponseEntity.noContent().build();
    }
}