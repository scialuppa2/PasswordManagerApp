package com.PasswordManager.controller;

import com.PasswordManager.model.Directory;
import com.PasswordManager.service.DirectoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/directories")
public class DirectoryController {

    @Autowired
    private DirectoryService directoryService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Directory>> getAllDirectoriesForUser(@PathVariable UUID userId) {
        List<Directory> directories = directoryService.findAllByUserId(userId);
        return ResponseEntity.ok(directories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Directory> getDirectoryById(@PathVariable UUID id) {
        Directory directory = directoryService.findById(id);
        return ResponseEntity.ok(directory);
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<Directory> createDirectory(@PathVariable UUID userId, @RequestBody Directory directory) {
        Directory createdDirectory = directoryService.save(userId, directory);
        return ResponseEntity.status(201).body(createdDirectory);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Directory> updateDirectory(@PathVariable UUID id, @RequestBody Directory updatedDirectory) {
        Directory directory = directoryService.update(id, updatedDirectory);
        return ResponseEntity.ok(directory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDirectory(@PathVariable UUID id) {
        directoryService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
