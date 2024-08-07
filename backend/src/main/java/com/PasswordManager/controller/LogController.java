package com.PasswordManager.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.PasswordManager.exception.ResourceNotFoundException;
import com.PasswordManager.model.Log;
import com.PasswordManager.service.LogService;

@RestController
@RequestMapping("/logs")
public class LogController {

    @Autowired
    private LogService logService;

    @GetMapping
    public ResponseEntity<List<Log>> getAllLogs() {
        try {
            List<Log> logs = logService.findAllLogs();
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<Log> createLog(@RequestBody Log log) {
        try {
            Log savedLog = logService.save(log);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedLog);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLogById(@PathVariable UUID id) {
        try {
            Log log = logService.findById(id);
            return ResponseEntity.ok(log);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to retrieve log.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLogById(@PathVariable UUID id) {
        try {
            logService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete log.");
        }
    }
}
