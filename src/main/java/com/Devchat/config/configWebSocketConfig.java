package com.Devchat.config;

import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import org.springframework.context.annotation.Configuration;

@Configuration
@EnableWebSocketMessageBroker // Enables WebSocket message handling with STOMP messaging
public class configWebSocketConfig implements WebSocketMessageBrokerConfigurer {

  @Override
  public void configureMessageBroker(MessageBrokerRegistry config) {
    config.enableSimpleBroker("/topic", "/user"); // sets up a simple in memory message broker that broadcasts messages
                                                  // to
    // subscribers of the topic and user destinations
    config.setApplicationDestinationPrefixes("/app");// specifies the client messages that are sent to the server should
                                                     // start with /app
  }

  // defines the websocket endpoint that the clients will conncet to
  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry.addEndpoint("/chat-websocket")
        .setAllowedOriginPatterns("*") // Allow all origins for WebSocket
        .withSockJS(); // enabes fallback for browsers that dont support ES natively
  }
}
