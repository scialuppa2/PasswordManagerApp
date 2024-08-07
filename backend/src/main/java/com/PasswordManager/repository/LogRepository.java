package com.PasswordManager.repository;

import com.PasswordManager.model.Log;
import com.PasswordManager.model.PasswordEntry;
import com.PasswordManager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LogRepository extends JpaRepository<Log, UUID> {
    List<Log> findByUser(User user);
    List<Log> findByPasswordEntry(PasswordEntry passwordEntry);
}

