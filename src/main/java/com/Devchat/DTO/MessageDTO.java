//Used for sending message data back to the frontend(after retrieving from database)
package com.Devchat.DTO;

import java.time.LocalDateTime;
import com.Devchat.entity.Message.MessageType;

public class MessageDTO {

  private Long id; // Database ID
  private String sender; // Who sent it
  private String receiver; // Who receives it
  private String content; // The message text
  private LocalDateTime timestamp; // When it was sent
  private boolean isRead; // Whether it's been read
  private MessageType type; // Type of message (CHAT, JOIN, LEAVE)

  // Default constructor (required for JSON deserialization)
  public MessageDTO() {
  }

  // Constructor for creating new messages (without id and timestamp)
  public MessageDTO(String sender, String receiver, String content) {
    this.sender = sender;
    this.receiver = receiver;
    this.content = content;
    this.timestamp = LocalDateTime.now();
    this.isRead = false;
    this.type = MessageType.CHAT; // Default to CHAT type
  }

  // Constructor for sending complete message data (with all fields)
  public MessageDTO(Long id, String sender, String receiver, String content, LocalDateTime timestamp, boolean isRead,
      MessageType type) {
    this.id = id;
    this.sender = sender;
    this.receiver = receiver;
    this.content = content;
    this.timestamp = timestamp;
    this.isRead = isRead;
    this.type = type;
  }

  // Getters
  public Long getId() {
    return id;
  }

  public String getSender() {
    return sender;
  }

  public String getReceiver() {
    return receiver;
  }

  public String getContent() {
    return content;
  }

  public LocalDateTime getTimestamp() {
    return timestamp;
  }

  public boolean isRead() {
    return isRead;
  }

  public MessageType getType() {
    return type;
  }

  // Setters
  public void setId(Long id) {
    this.id = id;
  }

  public void setSender(String sender) {
    this.sender = sender;
  }

  public void setReceiver(String receiver) {
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

  public void setType(MessageType type) {
    this.type = type;
  }

  /*
   * The toString() method is a special method in Java that converts an object
   * into a string representation.
   * It's used when you want to print or display an object as text.
   */
  @Override
  public String toString() {
    return "MessageDTO{" +
        "id=" + id +
        ", sender='" + sender + '\'' +
        ", receiver='" + receiver + '\'' +
        ", content='" + content + '\'' +
        ", timestamp=" + timestamp +
        ", isRead=" + isRead +
        ", type=" + type +
        '}';
  }
}
