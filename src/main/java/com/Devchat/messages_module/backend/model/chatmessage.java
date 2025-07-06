package com.Devchat.messages_module.backend.model;

import lombok.Data;

@Data
public class chatmessage {
    private MessageType type; // indicates weather the messge is a regular chat message, a join notif or a
                              // leave notif
    private String content; // actual message content
    private String sender;// username of the sender

    // enum for the different types of messages
    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }

}
