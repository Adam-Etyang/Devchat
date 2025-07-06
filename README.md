# Devchat - Collaborative Development Platform

A modern, real-time collaborative development platform built with Spring Boot and modern web technologies. Devchat provides project management, issue tracking, and team collaboration features with real-time updates.

## Features

- **Project Management**: Create, manage, and track development projects
- **Issue Tracking**: Comprehensive issue management with priority, status, and assignment
- **Real-time Updates**: Live notifications and updates across the platform
- **User Management**: User profiles, authentication, and role-based access
- **Dashboard**: Centralized overview of projects, issues, and recent activity
- **Responsive Design**: Modern UI built with TailwindCSS
- **Settings Management**: User preferences and profile customization

## Technology Stack

### Backend

- **Java 21**: Latest LTS version with modern language features
- **Spring Boot 3.5.0**: Rapid application development framework
- **Spring Security**: Authentication and authorization
- **Spring Data JPA**: Data access layer with Hibernate
- **PostgreSQL**: Primary database with Flyway migrations
- **WebSocket**: Real-time communication
- **JWT**: Stateless authentication tokens
- **Lombok**: Reduces boilerplate code
- **Maven**: Dependency management and build tool

### Frontend

- **Vanilla JavaScript (ES6+)**: Modern JavaScript with modules
- **TailwindCSS**: Utility-first CSS framework
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with custom properties

### Development Tools

- **Flyway**: Database migration management
- **PostgreSQL**: Relational database
- **Maven**: Build automation and dependency management

## Project Structure

```
Devchat/
├── src/
│   ├── main/
│   │   ├── java/com/Devchat/
│   │   │   ├── config/                 # Configuration classes
│   │   │   │   ├── Appconfig.java
│   │   │   │   ├── CorsConfig.java
│   │   │   │   └── securityconfig.java
│   │   │   ├── constants/              # Application constants
│   │   │   │   └── ProjectConstants.java
│   │   │   ├── Controller/             # REST API controllers
│   │   │   │   ├── Hello.java
│   │   │   │   ├── IssueController.java
│   │   │   │   ├── MessageController.java
│   │   │   │   ├── ProjectController.java
│   │   │   │   ├── RoleController.java
│   │   │   │   ├── UpdateController.java
│   │   │   │   └── UserController.java
│   │   │   ├── DTO/                    # Data Transfer Objects
│   │   │   │   ├── AuthresponseDTO.java
│   │   │   │   ├── ErrorresponseDTO.java
│   │   │   │   ├── IssueDTO.java
│   │   │   │   ├── LoginDTO.java
│   │   │   │   ├── ProjectCreateRequest.java
│   │   │   │   ├── ProjectDTO.java
│   │   │   │   ├── ProjectMemberDTO.java
│   │   │   │   ├── RegisterDTO.java
│   │   │   │   ├── RoleDTO.java
│   │   │   │   └── UserprofileDTO.java
│   │   │   ├── entity/                 # JPA entities
│   │   │   │   ├── Issue.java
│   │   │   │   ├── Message.java
│   │   │   │   ├── Project.java
│   │   │   │   ├── ProjectMember.java
│   │   │   │   ├── Role.java
│   │   │   │   ├── Update.java
│   │   │   │   └── User.java
│   │   │   ├── exceptions/             # Custom exceptions
│   │   │   │   ├── InvalidProjectDataException.java
│   │   │   │   ├── ProjectNotFoundException.java
│   │   │   │   └── RoleNotFoundException.java
│   │   │   ├── mapper/                 # Object mappers
│   │   │   │   ├── ProjectMapper.java
│   │   │   │   └── RoleMapper.java
│   │   │   ├── repository/             # Data access layer
│   │   │   │   ├── IssueRepository.java
│   │   │   │   ├── MessageRepository.java
│   │   │   │   ├── ProjectRepository.java
│   │   │   │   ├── RoleRepository.java
│   │   │   │   ├── UpdateRepository.java
│   │   │   │   └── UserRepository.java
│   │   │   ├── Service/                # Business logic layer
│   │   │   │   ├── Dataloader.java
│   │   │   │   ├── IssueService.java
│   │   │   │   ├── IssueServiceImpl.java
│   │   │   │   ├── MessageService.java
│   │   │   │   ├── MessageServiceImpl.java
│   │   │   │   ├── ProjectService.java
│   │   │   │   ├── ProjectServiceImpl.java
│   │   │   │   ├── RoleService.java
│   │   │   │   ├── UpdateService.java
│   │   │   │   ├── UpdateServiceImpl.java
│   │   │   │   ├── UserService.java
│   │   │   │   └── UserServiceImpl.java
│   │   │   └── util/                   # Utility classes
│   │   │       └── jwtUtil.java
│   │   └── resources/
│   │       ├── application.properties  # Application configuration
│   │       └── db/migration/           # Database migrations
│   │           ├── V1__Initial_Schema.sql
│   │           ├── V2__Add_User_Profile_Fields.sql
│   │           └── V3__Add_Issue_Fields.sql
│   └── test/                           # Test classes
├── Frontend/                           # Frontend assets
│   └── dist/
│       ├── pages/                      # HTML pages
│       │   ├── dashboard.html
│       │   ├── issue.html
│       │   ├── Login.html
│       │   ├── Notifications.html
│       │   ├── project/
│       │   │   └── project.html
│       │   ├── settings.html
│       │   └── signup.html
│       └── js/                         # JavaScript modules
│           ├── chat.js
│           ├── dashboard.js
│           ├── issue.js
│           ├── project.js
│           ├── realtime.js
│           └── settings.js
├── pom.xml                             # Maven configuration
└── README.md                           # Project documentation
```

## Architecture & Design Patterns

### Layered Architecture

The application follows a **3-tier layered architecture**:

1. **Presentation Layer** (Controllers)

   - REST API endpoints
   - Request/response handling
   - Input validation

2. **Business Logic Layer** (Services)

   - Business rules implementation
   - Transaction management
   - Data processing

3. **Data Access Layer** (Repositories)
   - Database operations
   - Entity management
   - Query optimization

### SOLID Principles Implementation

#### 1. Single Responsibility Principle (SRP)

- Each class has a single, well-defined responsibility
- `ProjectService` handles only project-related business logic
- `IssueService` manages issue-specific operations
- `UserService` focuses on user management

#### 2. Open/Closed Principle (OCP)

- Services are open for extension through interfaces
- New features can be added without modifying existing code
- Repository interfaces allow for different implementations

#### 3. Liskov Substitution Principle (LSP)

- Service implementations can be substituted for their interfaces
- Repository implementations are interchangeable
- DTOs maintain consistent contracts

#### 4. Interface Segregation Principle (ISP)

- Specific interfaces for different concerns
- `ProjectService` and `IssueService` have focused contracts
- Repository interfaces are segregated by entity type

#### 5. Dependency Inversion Principle (DIP)

- High-level modules depend on abstractions
- Services depend on repository interfaces
- Controllers depend on service interfaces
- Dependency injection through Spring framework

### Design Patterns

#### 1. Repository Pattern

```java
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStatus(String status);
    List<Project> findByCreatedById(Long userId);
}
```

#### 2. Service Layer Pattern

```java
@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {
    private final ProjectRepository projectRepository;
    // Business logic implementation
}
```

#### 3. DTO Pattern

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDTO {
    private Long id;
    private String name;
    private String description;
    // Data transfer without exposing entities
}
```

#### 4. Factory Pattern (Mapper)

```java
@Component
public class ProjectMapper {
    public ProjectDTO toDTO(Project project) {
        // Entity to DTO conversion
    }

    public Project toEntity(ProjectDTO dto) {
        // DTO to Entity conversion
    }
}
```

#### 5. Observer Pattern (Real-time Updates)

```javascript
// Frontend real-time manager
realtimeManager.subscribe("projects", (data) => {
  // Handle real-time updates
});
```

#### 6. Strategy Pattern (Status Management)

```java
// Different strategies for different status types
public enum ProjectStatus {
    ACTIVE, PLANNING, COMPLETED, ON_HOLD
}
```

## 🔧 Dependencies

### Core Dependencies

```xml
<!-- Spring Boot Starters -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>

<!-- Database -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>

<!-- Security -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>

<!-- Utilities -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
```

## Getting Started

### Prerequisites

- Java 21 or higher
- Maven 3.6+
- PostgreSQL 14+
- Node.js (for frontend development)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/devchat.git
   cd devchat
   ```

2. **Database Setup**

   ```bash
   # Create PostgreSQL database
   createdb Devchat

   # Update application.properties with your database credentials
   ```

3. **Backend Setup**

   ```bash
   # Run the Spring Boot application
   mvn spring-boot:run
   ```

4. **Frontend Setup**

   ```bash
   # Navigate to frontend directory
   cd Frontend/dist

   # Serve the frontend (using any static server)
   python -m http.server 3000
   # or
   npx serve .
   ```

5. **Access the Application**
   - Backend API: http://localhost:8080
   - Frontend: http://localhost:5500

## Database Schema

### Core Entities

- **Users**: User accounts and profiles
- **Projects**: Development projects with status tracking
- **Issues**: Project issues with priority and assignment
- **Messages**: Real-time chat messages with persistence
- **Roles**: User roles and permissions
- **Updates**: Real-time activity tracking

### Key Relationships

- Users can manage multiple projects
- Projects can have multiple issues
- Issues can be assigned to users
- Users can send/receive messages
- Real-time updates track all activities

## Security Features

- **JWT Authentication**: Stateless token-based authentication
- **CORS Configuration**: Cross-origin resource sharing setup
- **Input Validation**: Request validation and sanitization
- **Role-based Access**: User role management
- **Secure Headers**: Security headers configuration

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/all` - Get all users

### Projects

- `GET /api/projects` - Get all projects
- `POST /api/projects/create` - Create new project
- `GET /api/projects/{id}` - Get project by ID
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Issues

- `GET /api/issues` - Get all issues
- `POST /api/issues` - Create new issue
- `GET /api/issues/{id}` - Get issue by ID
- `PUT /api/issues/{id}` - Update issue
- `DELETE /api/issues/{id}` - Delete issue

### Messaging

- `GET /api/messages/public/recent` - Get recent public messages
- `GET /api/messages/conversation` - Get conversation between users
- `PUT /api/messages/{id}/read` - Mark message as read

### User Management

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password
- `DELETE /api/users/account` - Delete account

## Testing

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=ProjectServiceTest

# Run with coverage
mvn jacoco:report
```

## Performance Considerations

- **Database Indexing**: Optimized queries with proper indexing
- **Connection Pooling**: HikariCP for database connection management
- **Caching**: Spring Boot caching for frequently accessed data
- **Real-time Updates**: Efficient WebSocket communication
- **Frontend Optimization**: Modular JavaScript with lazy loading

## Real-time Features

- **Live Updates**: Real-time project and issue updates
- **Notifications**: Instant notifications for team activities
- **WebSocket Integration**: Efficient bidirectional communication
- **Event-driven Architecture**: Decoupled real-time event handling

## 💬 WebSocket Messaging Architecture

Devchat implements a comprehensive WebSocket-based messaging system for real-time communication between users. The system combines WebSocket for real-time messaging with REST APIs for initial data loading and persistence.

### Architecture Overview

```
┌─────────────────┐    WebSocket     ┌─────────────────┐
│   Frontend      │ ◄──────────────► │   Backend       │
│   (Browser)     │                  │   (Spring Boot) │
└─────────────────┘                  └─────────────────┘
         │                                     │
         │ REST API                            │ Database
         ▼                                     ▼
┌─────────────────┐                  ┌─────────────────┐
│   Static Files  │                  │   PostgreSQL    │
│   (HTML/CSS/JS) │                  │   (Messages)    │
└─────────────────┘                  └─────────────────┘
```

### WebSocket Endpoints

#### Connection

- **WebSocket URL**: `ws://localhost:8080/chat-websocket`
- **Protocol**: STOMP over SockJS
- **Authentication**: Session-based (username stored in WebSocket session)

#### Message Mappings

| Endpoint                        | Purpose                      | Payload                   | Response                          |
| ------------------------------- | ---------------------------- | ------------------------- | --------------------------------- |
| `/app/chat.sendMessage`         | Send public chat message     | `Message` object          | Broadcast to `/topic/public`      |
| `/app/chat.addUser`             | User join/leave notification | `Message` object          | Broadcast to `/topic/public`      |
| `/app/chat.privateMessage`      | Send private message         | `Message` object          | Send to specific user             |
| `/app/chat.typing`              | Typing indicator             | `Message` object          | Broadcast to `/topic/typing`      |
| `/app/chat.getConversation`     | Get conversation history     | `String[]` (user1, user2) | Send to `/topic/conversation`     |
| `/app/chat.getSentMessages`     | Get user's sent messages     | `String` (sender)         | Send to `/topic/sentMessages`     |
| `/app/chat.getReceivedMessages` | Get user's received messages | `String` (receiver)       | Send to `/topic/receivedMessages` |

#### Topics (Subscriptions)

| Topic                     | Purpose              | Description                                  |
| ------------------------- | -------------------- | -------------------------------------------- |
| `/topic/public`           | Public messages      | All chat messages and user join/leave events |
| `/topic/private`          | Private messages     | Direct messages between users                |
| `/topic/typing`           | Typing indicators    | Real-time typing status                      |
| `/topic/conversation`     | Conversation history | Historical messages between users            |
| `/topic/sentMessages`     | Sent messages        | User's sent message history                  |
| `/topic/receivedMessages` | Received messages    | User's received message history              |

### Message Entity Structure

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

### Frontend Integration

#### WebSocket Connection Setup

```javascript
// Connect to WebSocket
const socket = new SockJS("http://localhost:8080/chat-websocket");
const stompClient = Stomp.over(socket);

stompClient.connect({}, function (frame) {
  console.log("Connected to WebSocket:", frame);

  // Subscribe to public messages
  stompClient.subscribe("/topic/public", function (message) {
    const chatMessage = JSON.parse(message.body);
    showMessage(chatMessage);
  });

  // Subscribe to private messages
  stompClient.subscribe("/user/topic/private", function (message) {
    const chatMessage = JSON.parse(message.body);
    showPrivateMessage(chatMessage);
  });
});
```

#### Sending Messages

```javascript
// Send public message
function sendMessage() {
  const chatMessage = {
    sender: currentUsername,
    receiver: "public",
    content: messageText,
    type: "CHAT",
    timestamp: new Date().toISOString(),
  };

  stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
}

// Send private message
function sendPrivateMessage(receiver, content) {
  const chatMessage = {
    sender: currentUsername,
    receiver: receiver,
    content: content,
    type: "CHAT",
    timestamp: new Date().toISOString(),
  };

  stompClient.send("/app/chat.privateMessage", {}, JSON.stringify(chatMessage));
}
```

### REST API Integration

The WebSocket system is complemented by REST endpoints for initial data loading and persistence:

#### Message REST Endpoints

| Method | Endpoint                      | Purpose                        |
| ------ | ----------------------------- | ------------------------------ |
| `GET`  | `/api/messages/public/recent` | Get recent public messages     |
| `GET`  | `/api/messages/conversation`  | Get conversation between users |
| `PUT`  | `/api/messages/{id}/read`     | Mark message as read           |

### Message Flow

1. **User Joins Chat**

   ```
   Frontend → /app/chat.addUser → Backend → Database → /topic/public
   ```

2. **Sending Message**

   ```
   Frontend → /app/chat.sendMessage → Backend → Database → /topic/public
   ```

3. **Private Message**

   ```
   Frontend → /app/chat.privateMessage → Backend → Database → /topic/private (specific user)
   ```

4. **Loading History**
   ```
   Frontend → GET /api/messages/public/recent → Backend → Database → Frontend
   ```

### Error Handling

- **Connection Failures**: Automatic fallback to local chat mode
- **Database Errors**: Graceful degradation with error logging
- **Invalid Messages**: Validation and rejection with error responses
- **User Disconnection**: Automatic cleanup of user sessions

### Performance Features

- **Message Persistence**: All messages saved to database for history
- **Efficient Broadcasting**: Messages sent only to relevant subscribers
- **Connection Management**: Automatic session cleanup and reconnection
- **Message Queuing**: Handles high message volumes efficiently

### Security Considerations

- **Session Management**: Username stored in WebSocket session attributes
- **Input Validation**: Message content validation and sanitization
- **CORS Configuration**: Proper cross-origin setup for WebSocket connections
- **Rate Limiting**: Protection against message spam

### Usage Examples

#### Basic Chat Implementation

```html
<!-- chat.html -->
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.1.5/sockjs.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js"></script>
  </head>
  <body>
    <div id="messages"></div>
    <input type="text" id="messageInput" placeholder="Type your message..." />
    <button onclick="sendMessage()">Send</button>

    <script src="chat.js"></script>
  </body>
</html>
```

#### Advanced Features

- **File Sharing**: Support for image and file uploads
- **Typing Indicators**: Real-time typing status
- **Message Read Status**: Track message read receipts
- **User Presence**: Online/offline status tracking
- **Message Search**: Historical message retrieval
