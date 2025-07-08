# Devchat - Collaborative Development Platform

A modern, real-time collaborative development platform built with Spring Boot and modern web technologies. Devchat provides project management, issue tracking, team collaboration, and real-time activity tracking with complete user isolation.

## 🚀 Features

### Core Features

- **Project Management**: Create, manage, and track development projects with user isolation
- **Issue Tracking**: Comprehensive issue management with priority, status, and assignment
- **Real-time Updates**: Live notifications and updates across the platform
- **User Management**: User profiles, authentication, and role-based access
- **Dashboard**: Centralized overview of projects, issues, and recent activity
- **Recent Activity**: User-specific activity tracking and timeline
- **Real-time Chat**: WebSocket-based messaging system with persistence
- **Settings Management**: User preferences and profile customization

### User Isolation & Security

- **Multi-tenant Architecture**: Each user has their own isolated data
- **User Context Management**: Automatic user context for all operations
- **Secure Authentication**: JWT-based authentication with password encryption
- **Data Privacy**: Users can only access their own projects, issues, and messages
- **Activity Tracking**: User-specific recent activity and notifications

### Real-time Features

- **Live Updates**: Real-time project and issue updates
- **Instant Notifications**: Real-time notifications for team activities
- **WebSocket Integration**: Efficient bidirectional communication
- **Event-driven Architecture**: Decoupled real-time event handling
- **Activity Stream**: Real-time activity tracking and display

## 🛠 Technology Stack

### Backend

- **Java 21**: Latest LTS version with modern language features
- **Spring Boot 3.5.0**: Rapid application development framework
- **Spring Security**: Authentication and authorization
- **Spring Data JPA**: Data access layer with Hibernate
- **PostgreSQL**: Primary database with Flyway migrations
- **WebSocket**: Real-time communication with STOMP
- **JWT**: Stateless authentication tokens
- **BCrypt**: Password encryption
- **Lombok**: Reduces boilerplate code
- **Maven**: Dependency management and build tool

### Frontend

- **Vanilla JavaScript (ES6+)**: Modern JavaScript with ES6 modules
- **TailwindCSS**: Utility-first CSS framework
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with custom properties
- **WebSocket Client**: Real-time communication
- **Local Storage**: Client-side data persistence

### Development Tools

- **Flyway**: Database migration management
- **PostgreSQL**: Relational database
- **Maven**: Build automation and dependency management

## Testing

### Unit & Integration Tests

Devchat includes a comprehensive suite of unit and integration tests to ensure code quality and reliability.

- **Test Framework:** JUnit 5 (Jupiter)
- **Test Runner:** Maven Surefire Plugin
- **Mocking:** Mockito, Spring Boot Test
- **Database:** H2 in-memory for integration tests

### Test Coverage

- **Entities:** JPA entity mapping and constraints
- **Repositories:** Data access and query methods
- **Services:** Business logic, authentication, and authorization
- **Controllers:** REST API endpoints, request/response validation, security
- **Mappers:** DTO/entity conversion
- **Exception Handling:** Custom exception logic

### Running Tests

To run all tests:

```sh
mvn test
```

Test results will be shown in the console and detailed reports are available in `target/surefire-reports/`.

### Writing New Tests

- Place new test classes in `src/test/java/com/Devchat/`
- Use `@SpringBootTest` for integration tests, `@WebMvcTest` for controller tests, and `@DataJpaTest` for repository tests
- Use `@MockBean` to mock dependencies as needed
- For controller tests, add the `X-User-ID` header to simulate authentication:
  ```java
  mockMvc.perform(post("/api/projects/create")
      .header("X-User-ID", "1")
      ...)
  ```
- Mock `UserService.getUserById` to return a test user for the given ID

See the provided test templates for examples:

- `ControllerTemplateTest.java`
- `ServiceTemplateTest.java`
- `RepositoryTemplateTest.java`
- `MapperTemplateTest.java`
- `EntityTemplateTest.java`
- `ExceptionTemplateTest.java`

## 📁 Project Structure

```
Devchat/
├── src/
│   ├── main/
│   │   ├── java/com/Devchat/
│   │   │   ├── config/                 # Configuration classes
│   │   │   │   ├── Appconfig.java
│   │   │   │   ├── CorsConfig.java
│   │   │   │   ├── securityconfig.java
│   │   │   │   ├── WebSocketConfig.java
│   │   │   │   └── UserContextInterceptor.java
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
│   │   │   │   ├── CreateMessageRequest.java
│   │   │   │   ├── ErrorresponseDTO.java
│   │   │   │   ├── IssueDTO.java
│   │   │   │   ├── LoginDTO.java
│   │   │   │   ├── MessageDTO.java
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
│   │   │       ├── jwtUtil.java
│   │   │       └── UserContext.java
│   │   └── resources/
│   │       ├── application.properties  # Application configuration
│   │       ├── static/                 # Frontend assets (served by Spring Boot)
│   │       │   ├── pages/              # HTML pages
│   │       │   ├── js/                 # JavaScript modules
│   │       │   ├── css/                # Stylesheets
│   │       │   └── test-activity.html  # Testing page
│   │       └── db/migration/           # Database migrations
│   └── test/                           # Test classes
├── Frontend/                           # Frontend source (development)
│   └── dist/
│       ├── pages/                      # HTML pages
│       ├── js/                         # JavaScript modules
│       └── css/                        # Stylesheets
├── pom.xml                             # Maven configuration
└── README.md                           # Project documentation
```

## 🏗 Architecture & Design Patterns

### Multi-tenant Architecture with User Isolation

Devchat implements a **multi-tenant architecture** where each user has complete data isolation:

#### User Context Management

```java
@Component
public class UserContext {
    private static final ThreadLocal<User> currentUser = new ThreadLocal<>();

    public static void setCurrentUser(User user) {
        currentUser.set(user);
    }

    public static User getCurrentUser() {
        return currentUser.get();
    }

    public static Long getCurrentUserId() {
        User user = getCurrentUser();
        return user != null ? user.getId() : null;
    }
}
```

#### User Context Interceptor

```java
@Component
public class UserContextInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String userId = request.getHeader("X-User-ID");
        if (userId != null && !userId.trim().isEmpty()) {
            try {
                Long id = Long.parseLong(userId);
                User user = userService.getUserById(id);
                UserContext.setCurrentUser(user);
            } catch (Exception e) {
                System.out.println("Failed to set user context: " + e.getMessage());
            }
        }
        return true;
    }
}
```

### Layered Architecture

The application follows a **3-tier layered architecture**:

1. **Presentation Layer** (Controllers)

   - REST API endpoints with user authentication
   - Request/response handling
   - Input validation and error handling

2. **Business Logic Layer** (Services)

   - Business rules implementation with user isolation
   - Transaction management
   - Data processing and validation

3. **Data Access Layer** (Repositories)
   - Database operations with user filtering
   - Entity management
   - Query optimization

### Design Patterns

#### 1. Repository Pattern with User Isolation

```java
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByCreatedById(Long userId);
    List<Project> findByStatusAndCreatedById(String status, Long userId);
}
```

#### 2. Service Layer Pattern with User Context

```java
@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {
    public List<ProjectDTO> getAllProjects() {
        Long currentUserId = UserContext.getCurrentUserId();
        List<Project> projects = projectRepository.findByCreatedById(currentUserId);
        return projects.stream()
                .map(projectMapper::toDTO)
                .collect(Collectors.toList());
    }
}
```

#### 3. DTO Pattern for Data Transfer

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDTO {
    private Long id;
    private String name;
    private String description;
    private String status;
    private LocalDateTime createdAt;
    private Long createdById;
}
```

#### 4. Observer Pattern for Real-time Updates

```javascript
// Frontend real-time manager
realtimeManager.subscribe("projects", (data) => {
  if (data.action === "created" || data.action === "updated") {
    loadRecentProjects();
    loadRecentActivity();
  }
});
```

#### 5. Strategy Pattern for Status Management

```java
public enum ProjectStatus {
    ACTIVE, PLANNING, COMPLETED, ON_HOLD
}

public enum IssueStatus {
    OPEN, IN_PROGRESS, RESOLVED, CLOSED
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

## 🗄 Database Schema

### Core Entities with User Isolation

- **Users**: User accounts and profiles with authentication
- **Projects**: Development projects with user-specific ownership
- **Issues**: Project issues with user-specific assignment and reporting
- **Messages**: Real-time chat messages with user-specific conversations
- **Roles**: User roles and permissions
- **Updates**: Real-time activity tracking with user isolation

### Key Relationships

- Users own their projects (one-to-many)
- Projects contain issues (one-to-many)
- Issues are assigned to users (many-to-one)
- Users send/receive messages (many-to-many)
- Updates track user-specific activities (one-to-many)

## 🔐 Security Features

- **JWT Authentication**: Stateless token-based authentication
- **BCrypt Password Encryption**: Secure password hashing
- **User Context Management**: Automatic user isolation
- **CORS Configuration**: Cross-origin resource sharing setup
- **Input Validation**: Request validation and sanitization
- **Role-based Access**: User role management
- **Secure Headers**: Security headers configuration

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/all` - Get all users (admin only)

### Projects (User-isolated)

- `GET /api/projects` - Get user's projects
- `POST /api/projects/create` - Create new project
- `GET /api/projects/{id}` - Get project by ID (user's projects only)
- `PUT /api/projects/{id}` - Update project (user's projects only)
- `DELETE /api/projects/{id}` - Delete project (user's projects only)

### Issues (User-isolated)

- `GET /api/issues` - Get user's issues
- `POST /api/issues` - Create new issue
- `GET /api/issues/{id}` - Get issue by ID (user's issues only)
- `PUT /api/issues/{id}` - Update issue (user's issues only)
- `DELETE /api/issues/{id}` - Delete issue (user's issues only)

### Recent Activity (User-isolated)

- `GET /api/updates/recent` - Get user's recent activity
- `GET /api/updates/since/{timestamp}` - Get updates since timestamp

### Messaging

- `GET /api/messages/public/recent` - Get recent public messages
- `GET /api/messages/conversation` - Get conversation between users
- `PUT /api/messages/{id}/read` - Mark message as read

### User Management

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password
- `DELETE /api/users/account` - Delete account

## 💬 Real-time Features

### WebSocket Messaging

- **Connection**: `ws://localhost:8080/chat-websocket`
- **Protocol**: STOMP over SockJS
- **Features**: Public chat, private messaging, typing indicators
- **Persistence**: All messages saved to database

### Real-time Updates

- **Project Updates**: Live project creation, updates, and deletion
- **Issue Updates**: Real-time issue status changes and assignments
- **Activity Stream**: Live activity tracking and notifications
- **User Notifications**: Instant notifications for team activities

### Event-driven Architecture

```javascript
// Subscribe to real-time updates
realtimeManager.subscribe("projects", (data) => {
  console.log("Project update:", data);
  loadRecentProjects();
  loadRecentActivity();
});

realtimeManager.subscribe("issues", (data) => {
  console.log("Issue update:", data);
  loadRecentIssues();
  loadRecentActivity();
});
```

## 🎨 Frontend Architecture

### Modular JavaScript

- **ES6 Modules**: Modern JavaScript with import/export
- **Component-based**: Modular UI components
- **Real-time Integration**: WebSocket and REST API integration
- **User Context**: Automatic user ID management

### Key Frontend Modules

- **api.js**: Centralized API utilities with authentication
- **dashboard.js**: Dashboard functionality and real-time updates
- **project.js**: Project management with user isolation
- **issue.js**: Issue management with user isolation
- **chat.js**: Real-time messaging system
- **realtime.js**: Real-time update management

### Authentication Flow

```javascript
// Login and store user context
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(loginData),
});

const data = await response.json();
localStorage.setItem("userId", data.userProfile.id);
localStorage.setItem("username", data.userProfile.username);

// Use authFetch for authenticated requests
const projects = await authFetch("/api/projects");
```

## 🧪 Testing

### Backend Testing

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=ProjectServiceTest

# Run with coverage
mvn jacoco:report
```

### Frontend Testing

- **Manual Testing**: Use test-activity.html for API testing
- **Browser Testing**: Test real-time features in browser
- **User Isolation Testing**: Verify data isolation between users

## 📊 Performance Considerations

- **Database Indexing**: Optimized queries with user-specific indexing
- **Connection Pooling**: HikariCP for database connection management
- **Caching**: Spring Boot caching for frequently accessed data
- **Real-time Updates**: Efficient WebSocket communication
- **Frontend Optimization**: Modular JavaScript with lazy loading
- **User Isolation**: Efficient filtering by user ID

## 🔄 Recent Activity System

### Features

- **User-specific Activity**: Each user sees only their own activity
- **Real-time Updates**: Activity updates in real-time
- **Comprehensive Tracking**: Tracks projects, issues, and user actions
- **Timeline Display**: Chronological activity display

### Activity Types

- **Project Creation**: When users create new projects
- **Project Updates**: When projects are modified
- **Project Deletion**: When projects are deleted
- **Issue Creation**: When issues are created
- **Issue Updates**: When issues are modified
- **Issue Resolution**: When issues are resolved

### Implementation

```java
@Service
public class UpdateServiceImpl implements UpdateService {
    public void recordUpdate(String type, String action, Long entityId, String entityName) {
        Long currentUserId = UserContext.getCurrentUserId();
        Update update = new Update();
        update.setType(type);
        update.setAction(action);
        update.setEntityId(entityId);
        update.setEntityName(entityName);
        update.setUserId(currentUserId);
        update.setCreatedAt(LocalDateTime.now());
        updateRepository.save(update);
    }
}
```
