package com.Devchat.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    // CORS is now handled in securityconfig.java to avoid conflicts
    /*
     * @Bean
     * public WebMvcConfigurer corsConfigurer() {
     * return new WebMvcConfigurer() {
     * 
     * @Override
     * public void addCorsMappings(CorsRegistry registry) {
     * registry.addMapping("/api/**")
     * .allowedOrigins("http://127.0.0.1:5500", "http://localhost:5500")
     * .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
     * .allowedHeaders("*")
     * .allowCredentials(true);
     * }
     * };
     * }
     */
}
