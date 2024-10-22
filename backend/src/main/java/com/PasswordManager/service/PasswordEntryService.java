package com.PasswordManager.service;

import com.PasswordManager.exception.ResourceNotFoundException;
import com.PasswordManager.model.Directory;
import com.PasswordManager.model.PasswordEntry;
import com.PasswordManager.model.User;
import com.PasswordManager.repository.DirectoryRepository;
import com.PasswordManager.repository.PasswordEntryRepository;
import com.PasswordManager.repository.UserRepository;
import com.PasswordManager.security.CryptUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PasswordEntryService {

    @Autowired
    private PasswordEntryRepository passwordEntryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DirectoryRepository directoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CryptUtils cryptUtils;

    private static final String ENCRYPTION_KEY = "your-encryption-key-123";

    public Page<PasswordEntry> findAllByUserId(UUID userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return passwordEntryRepository.findByUser(user, pageable);
    }


    public Page<PasswordEntry> findByUserIdAndUrlContainingIgnoreCase(UUID userId, String url, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return passwordEntryRepository.findByUserAndUrlContainingIgnoreCase(user, url, pageable);
    }

    public Page<PasswordEntry> findByUserIdAndDirectoryId(UUID userId, UUID directoryId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Directory directory = directoryRepository.findById(directoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Directory not found"));
        return passwordEntryRepository.findByUserAndDirectory(user, directory, pageable);
    }

    public Page<PasswordEntry> findByUserIdAndDirectoryIdAndUrlContainingIgnoreCase(UUID userId, UUID directoryId, String url, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Directory directory = directoryRepository.findById(directoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Directory not found"));
        return passwordEntryRepository.findByUserAndDirectoryAndUrlContainingIgnoreCase(user, directory, url, pageable);
    }

    public PasswordEntry save(UUID userId, UUID directoryId, PasswordEntry passwordEntry) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Directory directory = null;
        if (directoryId != null) {
            directory = directoryRepository.findById(directoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Directory not found"));
        }

        passwordEntry.setUser(user);
        passwordEntry.setDirectory(directory);

        String encryptedPassword;
        try {
            encryptedPassword = cryptUtils.encrypt(passwordEntry.getPassword(), ENCRYPTION_KEY);
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while encrypting the password", e);
        }

        passwordEntry.setPassword(encryptedPassword);

        return passwordEntryRepository.save(passwordEntry);
    }


    public PasswordEntry findById(UUID id) {
        return passwordEntryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Password not found"));
    }

    public String decryptPasswordById(UUID id) {
        PasswordEntry passwordEntry = findById(id);

        try {
            return cryptUtils.decrypt(passwordEntry.getPassword(), ENCRYPTION_KEY);
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while decrypting the password", e);
        }
    }

    public PasswordEntry update(UUID id, PasswordEntry updatedPasswordEntry, UUID directoryId) {
        PasswordEntry existingEntry = findById(id);

        existingEntry.setUsername(updatedPasswordEntry.getUsername());
        existingEntry.setUrl(updatedPasswordEntry.getUrl());

        if (directoryId != null) {
            Directory directory = directoryRepository.findById(directoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Directory not found"));
            existingEntry.setDirectory(directory);
        }

        if (updatedPasswordEntry.getPassword() != null && !updatedPasswordEntry.getPassword().isEmpty()) {
            try {
                String encryptedPassword = cryptUtils.encrypt(updatedPasswordEntry.getPassword(), ENCRYPTION_KEY);
                existingEntry.setPassword(encryptedPassword);
            } catch (Exception e) {
                throw new RuntimeException("Error occurred while encrypting the password", e);
            }
        }

        return passwordEntryRepository.save(existingEntry);
    }


    public void deleteById(UUID id) {
        if (!passwordEntryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Password entry not found");
        }
        passwordEntryRepository.deleteById(id);
    }
}
