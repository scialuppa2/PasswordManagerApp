package com.PasswordManager.repository;

import com.PasswordManager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    User findByUsername(String username);

    void deleteById(UUID id);}
