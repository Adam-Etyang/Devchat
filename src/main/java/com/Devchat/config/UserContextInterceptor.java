package com.Devchat.config;

import com.Devchat.Service.UserService;
import com.Devchat.entity.User;
import com.Devchat.util.UserContext;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * Interceptor to automatically set the user context based on authentication.
 * This ensures that all requests have the proper user context for data
 * isolation.
 */
@Component
public class UserContextInterceptor implements HandlerInterceptor {

    @Autowired
    private UserService userService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        // Clear any existing context
        UserContext.clear();

        // Try to get user from session (for now, we'll use a simple approach)
        // In a production app, you'd validate JWT tokens here
        String userId = request.getHeader("X-User-ID");

        if (userId != null && !userId.trim().isEmpty()) {
            try {
                Long id = Long.parseLong(userId);
                User user = userService.getUserById(id);
                UserContext.setCurrentUser(user);
            } catch (Exception e) {
                // Log the error but don't fail the request
                System.out.println("Failed to set user context: " + e.getMessage());
            }
        }

        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
            throws Exception {
        // Always clear the context after the request is complete
        UserContext.clear();
    }
}