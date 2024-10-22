package com.PasswordManager.service;

import com.PasswordManager.exception.ResourceNotFoundException;
import com.PasswordManager.model.Directory;
import com.PasswordManager.model.User;
import com.PasswordManager.repository.DirectoryRepository;
import com.PasswordManager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DirectoryService {

    @Autowired
    private DirectoryRepository directoryRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Directory> findAllByUserId(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return directoryRepository.findByUser(user);
    }

    public Directory findById(UUID id) {
        return directoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Directory not found"));
    }

    public Directory save(UUID userId, Directory directory) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        directory.setUser(user);
        return directoryRepository.save(directory);
    }

    public Directory update(UUID id, Directory updatedDirectory) {
        Directory existingDirectory = findById(id);
        existingDirectory.setName(updatedDirectory.getName());
        return directoryRepository.save(existingDirectory);
    }

    public void deleteById(UUID id) {
        if (!directoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Directory not found");
        }
        directoryRepository.deleteById(id);
    }
}
