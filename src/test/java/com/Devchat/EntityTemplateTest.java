package com.Devchat;

import com.Devchat.entity.*; // Change to your entity
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class EntityTemplateTest {

    @Test
    void testUserSettersAndGetters() {
        User user = new User();
        user.setUsername("alice");
        assertEquals("alice", user.getUsername());
    }
}