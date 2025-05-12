package com.devchat.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    // For now, mock a user. Later, connect to DB.
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Replace this with actual DB call later
        if (!username.equals("testuser")) {
            throw new UsernameNotFoundException("User not found");
        }

        // username, password, authorities
        return new User("testuser", "{noop}password123", new ArrayList<>());
    }
}
