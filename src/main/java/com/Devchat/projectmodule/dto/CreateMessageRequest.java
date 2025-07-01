//Used for receiving new message requests from the frontend
package com.Devchat.projectmodule.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateMessageRequest {

    //@NotBlank: Field cannot be null, empty, or just whitespace
    //message: Error message if validation fails
    @NotBlank(message = "Sender is required")
    private String sender;

    @NotBlank(message = "Receiver is required")
    private String receiver;

    @NotBlank(message = "Message content is required")
    //@Size(max = 1000): Limits content to 1000 characters
    @Size(max = 1000, message = "Message content cannot exceed 1000 characters")
    private String content;

    // Default constructor (required for JSON deserialization)
    public CreateMessageRequest() {
    }

    // Constructor with all fields
    public CreateMessageRequest(String sender, String receiver, String content) {
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
    }

    // Getters
    public String getSender() {
        return sender;
    }

    public String getReceiver() {
        return receiver;
    }

    public String getContent() {
        return content;
    }

    // Setters
    public void setSender(String sender) {
        this.sender = sender;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return "CreateMessageRequest{" +
                "sender='" + sender + '\'' +
                ", receiver='" + receiver + '\'' +
                ", content='" + content + '\'' +
                '}';
    }
}