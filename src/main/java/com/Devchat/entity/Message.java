package com.Devchat.entity;

import jakarta.persistence.*;//Contains JPA annotations for database mapping
import java.time.LocalDateTime;//Java's modern date/time class

@Entity // Tells Spring "this class represents a database table"
@Table(name = "messages") // Explicitly names the database table "messages"
public class Message {

    @Id // Marks this as the primary key (unique identifier)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    /*
     * @GeneratedValue: Auto-generates the ID when you save
     * GenerationType.IDENTITY: Uses database auto-increment
     */
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Column(nullable = false, length = 1000) // length = 1000: Limits content to 1000 characters (prevents huge
                                             // messages)
    private String content;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "is_read", nullable = false) // Database column will be named "is_read" (snake_case)
    private boolean isRead = false;// = false: Default value when creating new messages

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageType type = MessageType.CHAT; // Default to CHAT type

    // Default constructor (required by JPA)
    public Message() {
        this.timestamp = LocalDateTime.now();// Automatically sets when message is created
    }

    // Constructor with all fields except id (for creating new messages)
    public Message(User sender, User receiver, String content) {
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
        this.timestamp = LocalDateTime.now();
        this.isRead = false;
        this.type = MessageType.CHAT;
    }

    // Constructor with all fields including id (for database retrieval)
    public Message(Long id, User sender, User receiver, String content, LocalDateTime timestamp, boolean isRead,
            MessageType type) {
        this.id = id;
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
        this.timestamp = timestamp;
        this.isRead = isRead;
        this.type = type;
    }

    // Getters(Allow other classes to read the fields)
    public Long getId() {
        return id;
    }

    public User getSender() {
        return sender;
    }

    public User getReceiver() {
        return receiver;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    // Special getter for boolean (not getIsRead())
    public boolean isRead() {
        return isRead;
    }

    // Setters(Allow other classes to modify the fields)
    public void setId(Long id) {
        this.id = id;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public void setReceiver(User receiver) {
        this.receiver = receiver;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    // enum for the different types of messages
    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }

    /*
     * @Override: Tells Java "I'm replacing the default toString() method"
     * String concatenation: Builds a readable string with all the important fields
     * Format: FieldName=value format makes it easy to read
     * Makes debugging much easier
     * Helps with logging
     */
    @Override
    public String toString() {
        return "Message{" +
                "id=" + id +
                ", sender='" + (sender != null ? sender.getUsername() : "null") + '\'' +
                ", receiver='" + (receiver != null ? receiver.getUsername() : "null") + '\'' +
                ", content='" + content + '\'' +
                ", timestamp=" + timestamp +
                ", isRead=" + isRead +
                '}';
    }
}