package com.PasswordManager.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.PasswordManager.model.User;
import com.PasswordManager.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.findAll();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/register")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User savedUser = userService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable UUID id) {
        User user = userService.findUserById(id);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserById(@PathVariable UUID id) {
        userService.deleteUserById(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PutMapping("/{id}/username")
    public ResponseEntity<User> changeUsername(@PathVariable UUID id, @RequestBody Map<String, String> request) {
        String newUsername = request.get("username");
        User updatedUser = userService.changeUsername(id, newUsername);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/{id}/master-password")
    public ResponseEntity<User> changeMasterPassword(@PathVariable UUID id, @RequestBody Map<String, String> request) {
        String newMasterPassword = request.get("masterPassword");
        User updatedUser = userService.changeMasterPassword(id, newMasterPassword);
        return ResponseEntity.ok(updatedUser);
    }


    

    @GetMapping("/test")
    public ResponseEntity<String> testConnection() {
        userService.findAll();
        return ResponseEntity.ok("Connection to database is successful!");
    }
}
