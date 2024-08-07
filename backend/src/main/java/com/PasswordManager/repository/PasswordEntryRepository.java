package com.PasswordManager.repository;

import com.PasswordManager.model.PasswordEntry;
import com.PasswordManager.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PasswordEntryRepository extends JpaRepository<PasswordEntry, UUID> {
    Page<PasswordEntry> findByUser(User user, Pageable pageable);

    Page<PasswordEntry> findByUserAndUrlContainingIgnoreCase(User user, String url, Pageable pageable);
}
