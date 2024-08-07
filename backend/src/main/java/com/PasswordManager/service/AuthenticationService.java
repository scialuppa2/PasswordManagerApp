package com.PasswordManager.service;

import com.PasswordManager.util.CsrfUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.PasswordManager.model.User;
import com.PasswordManager.repository.UserRepository;
import com.PasswordManager.util.JwtUtil;
import com.PasswordManager.exception.InvalidCredentialsException;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthenticationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CsrfUtil csrfTokenUtil;

    public User authenticate(String username, String rawPassword) {
        User user = userRepository.findByUsername(username);
        if (user != null && passwordEncoder.matches(rawPassword, user.getMasterPassword())) {
            return user;
        }
        return null;
    }

    public boolean verifyMasterPassword(UUID userId, String rawPassword) {
        User user = userRepository.findById(userId).orElse(null);
        return user != null && passwordEncoder.matches(rawPassword, user.getMasterPassword());
    }

    public String generateToken(User user) {
        return jwtUtil.generateToken(user.getUsername());
    }

    public Map<String, String> authenticateAndGenerateToken(String username, String rawPassword) {
        User authenticatedUser = authenticate(username, rawPassword);
        if (authenticatedUser != null) {
            String token = generateToken(authenticatedUser);
            String csrfToken = csrfTokenUtil.generateCsrfToken();

            Map<String, String> response = new HashMap<>();
            response.put("authToken", token);
            response.put("userId", authenticatedUser.getId().toString());
            response.put("username", authenticatedUser.getUsername());
            response.put("csrfToken", csrfToken);
            return response;
        } else {
            throw new InvalidCredentialsException("Invalid username or password");
        }
    }
}
