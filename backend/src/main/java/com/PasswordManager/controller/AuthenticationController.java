package com.PasswordManager.controller;

import com.PasswordManager.util.CsrfUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.PasswordManager.service.AuthenticationService;
import com.PasswordManager.model.LoginRequest;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private CsrfUtil csrfTokenUtil;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        Map<String, String> authResponse = authenticationService.authenticateAndGenerateToken(loginRequest.getUsername(), loginRequest.getMasterPassword());

        String csrfToken = csrfTokenUtil.generateCsrfToken();
        authResponse.put("csrfToken", csrfToken);

        Cookie authTokenCookie = new Cookie("authToken", authResponse.get("authToken"));
        authTokenCookie.setHttpOnly(true);
        authTokenCookie.setPath("/");

        Cookie userIdCookie = new Cookie("userId", authResponse.get("userId"));
        userIdCookie.setHttpOnly(true);
        userIdCookie.setPath("/");

        Cookie csrfCookie = new Cookie("XSRF-TOKEN", csrfToken);
        csrfCookie.setHttpOnly(false);
        csrfCookie.setPath("/");

        response.addCookie(authTokenCookie);
        response.addCookie(userIdCookie);
        response.addCookie(csrfCookie);

        logger.debug("Login successful for user: {}", loginRequest.getUsername());

        return ResponseEntity.ok(authResponse);
    }
}
