package com.PasswordManager.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.PasswordManager.exception.ResourceNotFoundException;
import com.PasswordManager.model.Log;
import com.PasswordManager.repository.LogRepository;

@Service
public class LogService {

    @Autowired
    private LogRepository logRepository;

    public List<Log> findAllLogs() {
        return logRepository.findAll();
    }

    public Log save(Log log) {
        try {
            return logRepository.save(log);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save log", e);
        }
    }

    public Log findById(UUID id) {
        return logRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Log not found with id: " + id));
    }

    public void deleteById(UUID id) {
        try {
            logRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete log with id: " + id, e);
        }
    }
}
