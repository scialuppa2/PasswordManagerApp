package com.PasswordManager.repository;

import com.PasswordManager.model.PasswordEntry;
import com.PasswordManager.model.User;
import com.PasswordManager.model.Directory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PasswordEntryRepository extends JpaRepository<PasswordEntry, UUID> {
    Page<PasswordEntry> findByUser(User user, Pageable pageable);
    Page<PasswordEntry> findByUserAndUrlContainingIgnoreCase(User user, String url, Pageable pageable);
    Page<PasswordEntry> findByUserAndDirectory(User user, Directory directory, Pageable pageable);
    Page<PasswordEntry> findByUserAndDirectoryAndUrlContainingIgnoreCase(User user, Directory directory, String url, Pageable pageable);

    Page<PasswordEntry> findAllByUserId(UUID userId, Pageable pageable);

    Page<PasswordEntry> findAllByUser(User user, Pageable pageable);
}
