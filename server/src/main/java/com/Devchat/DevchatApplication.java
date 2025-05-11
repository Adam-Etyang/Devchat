package com.Devchat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories
public class DevchatApplication {
    public static void main(String[] args) {
        SpringApplication.run(DevchatApplication.class, args);
    }
}
