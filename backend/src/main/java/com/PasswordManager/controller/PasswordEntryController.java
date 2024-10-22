package com.PasswordManager.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import com.PasswordManager.exception.ErrorDto;
import com.PasswordManager.model.Directory;
import com.PasswordManager.service.AuthenticationService;
import com.PasswordManager.util.JwtUtil;
import com.PasswordManager.service.PasswordEntryService;
import com.PasswordManager.model.PasswordEntry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/password-entries")
public class PasswordEntryController {

    @Autowired
    private PasswordEntryService passwordEntryService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationService authenticationService;

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getAllPasswordEntriesForUser(
            @PathVariable UUID userId,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @RequestParam(required = false) String url,
            @RequestParam(required = false) UUID directoryId,
            @PageableDefault(size = 6) Pageable pageable) {

        jwtUtil.validateAuthorizationHeader(authorizationHeader);

        Page<PasswordEntry> passwordEntriesPage;

        if (directoryId != null) {
            if (url != null && !url.isEmpty()) {
                passwordEntriesPage = passwordEntryService.findByUserIdAndDirectoryIdAndUrlContainingIgnoreCase(userId, directoryId, url, pageable);
            } else {
                passwordEntriesPage = passwordEntryService.findByUserIdAndDirectoryId(userId, directoryId, pageable);
            }
        } else {
            if (url != null && !url.isEmpty()) {
                passwordEntriesPage = passwordEntryService.findByUserIdAndUrlContainingIgnoreCase(userId, url, pageable);
            } else {
                passwordEntriesPage = passwordEntryService.findAllByUserId(userId, pageable);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("passwordEntries", passwordEntriesPage.getContent());
        response.put("currentPage", passwordEntriesPage.getNumber());
        response.put("totalItems", passwordEntriesPage.getTotalElements());
        response.put("totalPages", passwordEntriesPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<PasswordEntry> createPasswordEntry(
            @PathVariable UUID userId,
            @RequestBody PasswordEntry passwordEntry,
            @RequestParam UUID directoryId,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {

        jwtUtil.validateAuthorizationHeader(authorizationHeader);

        if (passwordEntry.getUrl() == null || passwordEntry.getUsername() == null || passwordEntry.getPassword() == null) {
            logger.warn("Invalid password entry data: {}", passwordEntry);
            return ResponseEntity.badRequest().body(null);
        }

        PasswordEntry savedPasswordEntry = passwordEntryService.save(userId, directoryId, passwordEntry);
        logger.debug("Password entry saved successfully: {}", savedPasswordEntry);
        return ResponseEntity.status(201).body(savedPasswordEntry);
    }


    @GetMapping("/{id}")
    public ResponseEntity<PasswordEntry> getPasswordEntryById(
            @PathVariable UUID id,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {

        jwtUtil.validateAuthorizationHeader(authorizationHeader);

        PasswordEntry passwordEntry = passwordEntryService.findById(id);
        return ResponseEntity.ok(passwordEntry);
    }

    @PostMapping("/verify-master-password")
    public ResponseEntity<?> verifyMasterPassword(
            @RequestBody Map<String, String> requestBody,
            @RequestHeader("Authorization") String token) {

        jwtUtil.validateAuthorizationHeader(token);

        String masterPassword = requestBody.get("masterPassword");
        String userIdStr = requestBody.get("userId");
        UUID userId = UUID.fromString(userIdStr);

        boolean isValid = authenticationService.verifyMasterPassword(userId, masterPassword);
        if (isValid) {
            return ResponseEntity.ok("Master password is correct.");
        } else {
            return ResponseEntity.status(401).body(new ErrorDto("Invalid master password."));
        }
    }

    @GetMapping("/{id}/reveal")
    public ResponseEntity<String> getPasswordById(
            @PathVariable UUID id,
            @RequestHeader("Authorization") String token) {

        jwtUtil.validateAuthorizationHeader(token);

        String decryptedPassword = passwordEntryService.decryptPasswordById(id);
        return ResponseEntity.ok(decryptedPassword);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PasswordEntry> updatePasswordEntry(
            @PathVariable UUID id,
            @RequestBody PasswordEntry passwordEntry,
            @RequestParam(required = false) UUID directoryId,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {

        System.out.println("Received directoryId: " + directoryId);

        jwtUtil.validateAuthorizationHeader(authorizationHeader);

        PasswordEntry updatedPasswordEntry = passwordEntryService.update(id, passwordEntry, directoryId);
        return ResponseEntity.ok(updatedPasswordEntry);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePasswordEntry(
            @PathVariable UUID id,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {

        jwtUtil.validateAuthorizationHeader(authorizationHeader);

        passwordEntryService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
