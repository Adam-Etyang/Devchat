# Devchat Architecture Documentation

## System Overview

Devchat is a collaborative development platform built using a modern microservices-inspired architecture with clear separation of concerns. The system follows a layered architecture pattern with RESTful APIs and real-time communication capabilities.

## Architecture Layers

### 1. Presentation Layer (Controllers)

**Purpose**: Handle HTTP requests, validate input, and return appropriate responses.

**Key Components**:

- `ProjectController`: Manages project-related HTTP endpoints
- `IssueController`: Handles issue management operations
- `MessageController`: WebSocket and REST message handling
- `UserController`: User profile and account management
- `UpdateController`: Real-time update notifications

**Responsibilities**:

- Request/response handling
- Input validation using Bean Validation
- Error handling and status code management
- CORS configuration
- Authentication and authorization checks

**Example Implementation**:

```java
@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    @PostMapping("/create")
    public ResponseEntity<ProjectDTO> createProject(@Valid @RequestBody ProjectCreateRequest request) {
        // Input validation, business logic delegation, response formatting
    }
}
```

### 2. Business Logic Layer (Services)

**Purpose**: Implement business rules, orchestrate operations, and manage transactions.

**Key Components**:

- `ProjectService`: Project business logic
- `IssueService`: Issue management logic
- `MessageService`: Message handling and persistence
- `UserService`: User-related operations
- `UpdateService`: Real-time update management

**Responsibilities**:

- Business rule enforcement
- Transaction management
- Data processing and transformation
- Cross-cutting concerns (logging, caching)
- Integration with external services

**Example Implementation**:

```java
@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {

    @Override
    public ProjectDTO createProject(ProjectCreateRequest request) {
        // Business validation, entity creation, real-time updates
    }
}
```

### 3. Data Access Layer (Repositories)

**Purpose**: Abstract database operations and provide data persistence.

**Key Components**:

- `ProjectRepository`: Project data operations
- `IssueRepository`: Issue data operations
- `MessageRepository`: Message data operations
- `UserRepository`: User data operations
- `UpdateRepository`: Update tracking operations

**Responsibilities**:

- Database CRUD operations
- Query optimization
- Data mapping between entities and database
- Connection management

**Example Implementation**:

```java
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStatus(String status);
    List<Project> findByCreatedById(Long userId);
    Optional<Project> findByName(String name);
}
```

## Design Patterns Implementation

### 1. Repository Pattern

**Purpose**: Abstract data access logic and provide a consistent interface.

**Implementation**:

- All repositories extend `JpaRepository<T, ID>`
- Custom query methods using Spring Data JPA naming conventions
- Separation of data access concerns from business logic

**Benefits**:

- Testability through mock repositories
- Database technology independence
- Consistent data access patterns

### 2. Service Layer Pattern

**Purpose**: Encapsulate business logic and provide transaction boundaries.

**Implementation**:

- Service interfaces define contracts
- Service implementations contain business logic
- `@Transactional` annotations manage transaction scope
- Dependency injection for loose coupling

**Benefits**:

- Business logic reusability
- Transaction management
- Separation of concerns

### 3. DTO Pattern

**Purpose**: Transfer data between layers without exposing internal entities.

**Implementation**:

- Separate DTOs for different use cases
- Mapper classes for entity-DTO conversion
- Validation annotations on DTOs
- Immutable data transfer objects

**Benefits**:

- API versioning support
- Data validation at boundaries
- Reduced coupling between layers

### 4. Factory Pattern (Mappers)

**Purpose**: Create and transform objects between different representations.

**Implementation**:

- `ProjectMapper`: Converts between Project entities and DTOs
- `RoleMapper`: Handles role-related transformations
- Static utility methods for simple conversions
- Component-based mappers for complex transformations

**Benefits**:

- Centralized object creation logic
- Consistent transformation rules
- Easy testing and maintenance

### 5. Observer Pattern (Real-time Updates)

**Purpose**: Notify multiple components about state changes.

**Implementation**:

- Frontend real-time manager subscribes to updates
- Backend publishes updates through WebSocket
- Event-driven architecture for decoupled communication
- Polling fallback for WebSocket failures
- Message broadcasting for real-time chat

**Benefits**:

- Loose coupling between components
- Scalable notification system
- Real-time user experience
- Instant message delivery

## SOLID Principles Implementation

### Single Responsibility Principle (SRP)

**Implementation**:

- Each class has one reason to change
- Controllers handle HTTP concerns only
- Services focus on business logic
- Repositories manage data access only

**Examples**:

- `ProjectController`: Only handles project HTTP requests
- `ProjectService`: Only manages project business logic
- `ProjectRepository`: Only handles project data operations

### Open/Closed Principle (OCP)

**Implementation**:

- Services are open for extension through interfaces
- New features added through new implementations
- Existing code remains unchanged

**Examples**:

- `ProjectService` interface allows multiple implementations
- Repository interfaces support different data sources
- Mapper interfaces enable different transformation strategies

### Liskov Substitution Principle (LSP)

**Implementation**:

- Service implementations are interchangeable
- Repository implementations can be substituted
- DTOs maintain consistent contracts

**Examples**:

- Any `ProjectService` implementation can replace another
- Mock repositories work with real service implementations
- DTOs maintain consistent field structures

### Interface Segregation Principle (ISP)

**Implementation**:

- Specific interfaces for different concerns
- Clients depend only on methods they use
- Focused contracts for each responsibility

**Examples**:

- `ProjectService` has project-specific methods only
- `IssueService` handles issue operations separately
- Repository interfaces are entity-specific

### Dependency Inversion Principle (DIP)

**Implementation**:

- High-level modules depend on abstractions
- Dependency injection through Spring framework
- Interfaces define contracts between layers

**Examples**:

- Controllers depend on service interfaces
- Services depend on repository interfaces
- Spring manages dependency injection

## Real-time Communication

### WebSocket Implementation

- Bidirectional communication
- Event-driven message handling
- Connection management and error handling

### Fallback Strategy

- Polling mechanism for WebSocket failures
- Graceful degradation to HTTP requests
- Automatic reconnection attempts

## 💬 Messaging Architecture

### Overview

The messaging system in Devchat implements a hybrid architecture that combines WebSocket for real-time communication with REST APIs for data persistence and initial loading. This approach provides the benefits of both real-time updates and reliable data storage.

### Architecture Components

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  WebSocket Client (STOMP)  │  REST Client  │  UI Components    │
│  • Real-time messaging     │  • Data fetch │  • Message display│
│  • Connection management   │  • History    │  • User interface │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend Layer                              │
├─────────────────────────────────────────────────────────────────┤
│  WebSocket Controller  │  REST Controller  │  Message Service  │
│  • Message handling    │  • Data endpoints │  • Business logic │
│  • Broadcasting        │  • CRUD operations│  • Validation     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Data Layer                                  │
├─────────────────────────────────────────────────────────────────┤
│  Message Repository  │  Message Entity  │  Database (PostgreSQL)│
│  • Data operations   │  • JPA mapping   │  • Persistent storage│
│  • Query methods     │  • Relationships │  • ACID compliance   │
└─────────────────────────────────────────────────────────────────┘
```

### WebSocket Message Flow

#### 1. Connection Establishment

```java
// WebSocket Configuration
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/user");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/chat-websocket")
                .setAllowedOrigins("*")
                .withSockJS();
    }
}
```

#### 2. Message Processing Pipeline

```
Frontend → WebSocket → MessageController → MessageService → Database
    ↑                                                           ↓
    └─────────────── Broadcast Response ←──────────────────────┘
```

#### 3. Message Types and Handling

**Public Messages**:

```java
@MessageMapping("/chat.sendMessage")
@SendTo("/topic/public")
public Message sendMessage(@Payload Message chatMessage) {
    // Save to database
    MessageDTO savedMessage = messageService.sendMessage(request);
    // Update with database ID and timestamp
    chatMessage.setId(savedMessage.getId());
    chatMessage.setTimestamp(savedMessage.getTimestamp());
    return chatMessage;
}
```

**Private Messages**:

```java
@MessageMapping("/chat.privateMessage")
public void sendPrivateMessage(@Payload Message chatMessage) {
    // Save to database
    MessageDTO savedMessage = messageService.sendMessage(request);

    // Send to specific user
    messagingTemplate.convertAndSendToUser(
        chatMessage.getReceiver(),
        "/topic/private",
        chatMessage
    );
}
```

**User Events**:

```java
@MessageMapping("/chat.addUser")
@SendTo("/topic/public")
public Message addUser(@Payload Message chatMessage,
                      SimpMessageHeaderAccessor headerAccessor) {
    // Store username in session
    headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
    return chatMessage;
}
```

### Message Entity Design

```java
@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String sender;

    @Column(nullable = false)
    private String receiver;

    @Column(nullable = false, length = 1000)
    private String content;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageType type = MessageType.CHAT;

    public enum MessageType {
        CHAT,    // Regular chat message
        JOIN,    // User joined notification
        LEAVE    // User left notification
    }
}
```

### Frontend Integration Architecture

#### WebSocket Connection Management

```javascript
class WebSocketManager {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    const socket = new SockJS("http://localhost:8080/chat-websocket");
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect(
      {},
      (frame) => this.onConnect(frame),
      (error) => this.onError(error)
    );
  }

  onConnect(frame) {
    this.connected = true;
    this.reconnectAttempts = 0;
    this.subscribeToTopics();
  }

  onError(error) {
    this.connected = false;
    this.handleReconnection();
  }
}
```

#### Message Handling Strategy

```javascript
class MessageHandler {
  constructor(websocketManager) {
    this.websocketManager = websocketManager;
    this.messageQueue = [];
    this.offlineMode = false;
  }

  sendMessage(message) {
    if (this.websocketManager.connected) {
      // Send via WebSocket
      this.websocketManager.stompClient.send(
        "/app/chat.sendMessage",
        {},
        JSON.stringify(message)
      );
    } else {
      // Queue for later or use REST fallback
      this.messageQueue.push(message);
      this.sendViaREST(message);
    }
  }

  sendViaREST(message) {
    fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
  }
}
```

### REST API Integration

#### Hybrid Approach Benefits

1. **Real-time Communication**: WebSocket for instant messaging
2. **Data Persistence**: REST APIs for reliable data storage
3. **Fallback Support**: REST endpoints when WebSocket fails
4. **Initial Data Loading**: REST for historical message retrieval

#### REST Endpoints

```java
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    // Get recent public messages
    @GetMapping("/public/recent")
    public ResponseEntity<List<MessageDTO>> getRecentPublicMessages(
            @RequestParam(defaultValue = "50") int limit) {
        // Implementation
    }

    // Get conversation between users
    @GetMapping("/conversation")
    public ResponseEntity<List<MessageDTO>> getConversation(
            @RequestParam String user1,
            @RequestParam String user2) {
        // Implementation
    }

    // Mark message as read
    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markMessageAsRead(@PathVariable Long id) {
        // Implementation
    }
}
```

### Error Handling and Resilience

#### Connection Failure Handling

```javascript
class ConnectionManager {
  handleConnectionFailure() {
    // 1. Attempt immediate reconnection
    this.attemptReconnection();

    // 2. Switch to REST mode
    this.enableRESTMode();

    // 3. Queue messages for later
    this.queueMessages();

    // 4. Notify user of connection status
    this.updateConnectionStatus();
  }

  attemptReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.connect();
        this.reconnectAttempts++;
      }, this.getBackoffDelay());
    }
  }
}
```

#### Database Error Handling

```java
@Service
public class MessageServiceImpl implements MessageService {

    @Override
    public MessageDTO sendMessage(CreateMessageRequest request) {
        try {
            // Attempt to save message
            Message message = createMessageFromRequest(request);
            Message savedMessage = messageRepository.save(message);
            return messageMapper.toDTO(savedMessage);
        } catch (Exception e) {
            // Log error and return fallback response
            logger.error("Error saving message: {}", e.getMessage());
            return createFallbackMessage(request);
        }
    }
}
```

### Performance Optimization

#### Message Broadcasting Optimization

```java
@Component
public class MessageBroadcaster {

    // Use SimpMessagingTemplate for efficient broadcasting
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void broadcastToPublic(Message message) {
        // Broadcast to all subscribers
        messagingTemplate.convertAndSend("/topic/public", message);
    }

    public void sendToUser(String username, Message message) {
        // Send to specific user only
        messagingTemplate.convertAndSendToUser(
            username,
            "/topic/private",
            message
        );
    }
}
```

#### Database Query Optimization

```java
@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // Optimized queries with proper indexing
    @Query("SELECT m FROM Message m WHERE " +
           "(m.sender = :user1 AND m.receiver = :user2) OR " +
           "(m.sender = :user2 AND m.receiver = :user1) " +
           "ORDER BY m.timestamp DESC")
    List<Message> findConversationBetweenUsers(
        @Param("user1") String user1,
        @Param("user2") String user2
    );

    // Pagination support for large message histories
    @Query("SELECT m FROM Message m WHERE m.receiver = 'public' " +
           "ORDER BY m.timestamp DESC")
    Page<Message> findRecentPublicMessages(Pageable pageable);
}
```

### Security Considerations

#### Message Validation

```java
@Component
public class MessageValidator {

    public void validateMessage(Message message) {
        // Content validation
        if (message.getContent() == null || message.getContent().trim().isEmpty()) {
            throw new InvalidMessageException("Message content cannot be empty");
        }

        if (message.getContent().length() > 1000) {
            throw new InvalidMessageException("Message too long");
        }

        // Sender validation
        if (message.getSender() == null || message.getSender().trim().isEmpty()) {
            throw new InvalidMessageException("Sender cannot be empty");
        }

        // XSS protection
        String sanitizedContent = sanitizeContent(message.getContent());
        message.setContent(sanitizedContent);
    }

    private String sanitizeContent(String content) {
        // Implement XSS protection
        return content.replaceAll("<script[^>]*>.*?</script>", "")
                     .replaceAll("<[^>]*>", "");
    }
}
```

#### Session Management

```java
@Component
public class WebSocketSessionManager {

    private final Map<String, String> userSessions = new ConcurrentHashMap<>();

    public void addUserSession(String sessionId, String username) {
        userSessions.put(sessionId, username);
    }

    public void removeUserSession(String sessionId) {
        userSessions.remove(sessionId);
    }

    public String getUsernameForSession(String sessionId) {
        return userSessions.get(sessionId);
    }
}
```

### Scalability Considerations

#### Horizontal Scaling

- **Load Balancing**: Multiple application instances behind a load balancer
- **Session Affinity**: WebSocket connections routed to same instance
- **Message Broker**: External message broker (RabbitMQ, Redis) for scaling
- **Database Sharding**: Message storage across multiple database instances

#### Performance Monitoring

```java
@Component
public class MessageMetrics {

    private final MeterRegistry meterRegistry;

    public void recordMessageSent() {
        meterRegistry.counter("messages.sent").increment();
    }

    public void recordMessageReceived() {
        meterRegistry.counter("messages.received").increment();
    }

    public void recordConnectionEstablished() {
        meterRegistry.counter("websocket.connections").increment();
    }
}
```

## Database Design

### Entity Relationships

- One-to-many: User to Projects
- One-to-many: Project to Issues
- One-to-many: User to Messages (sent)
- One-to-many: User to Messages (received)
- Many-to-many: Users to Roles
- One-to-many: Project to Updates

### Migration Strategy

- Flyway for version-controlled schema changes
- Backward-compatible migrations
- Data integrity constraints

## Performance Considerations

### Database Optimization

- Proper indexing on frequently queried fields
- Connection pooling with HikariCP
- Query optimization through JPA

### Caching Strategy

- Application-level caching for frequently accessed data
- Database query result caching
- Static resource caching

### Frontend Optimization

- Modular JavaScript loading
- Lazy loading of components
- Efficient DOM manipulation

## Error Handling

### Exception Hierarchy

- Custom business exceptions
- Global exception handlers
- Consistent error response format

### Logging Strategy

- Structured logging with appropriate levels
- Performance monitoring
- Security event logging

## Testing Strategy

### Unit Testing

- Service layer business logic testing
- Repository layer data access testing
- Controller layer request handling testing

### Integration Testing

- End-to-end API testing
- Database integration testing
- Security testing

### Frontend Testing

- JavaScript module testing
- UI component testing
- Real-time communication testing

## Deployment Architecture

### Backend Deployment

- Spring Boot executable JAR
- Embedded Tomcat server
- Environment-specific configurations

### Frontend Deployment

- Static file serving
- CDN integration for assets
- Progressive Web App capabilities

### Database Deployment

- PostgreSQL with connection pooling
- Automated backup strategies
- Monitoring and alerting

## Monitoring and Observability

### Application Monitoring

- Health check endpoints
- Performance metrics collection
- Error tracking and alerting

### Database Monitoring

- Query performance monitoring
- Connection pool monitoring
- Storage and growth tracking

### Real-time Monitoring

- WebSocket connection monitoring
- Message throughput tracking
- User activity analytics
