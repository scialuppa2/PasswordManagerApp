package com.PasswordManager.repository;

import com.PasswordManager.model.Directory;
import com.PasswordManager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DirectoryRepository extends JpaRepository<Directory, UUID> {
    List<Directory> findByUser(User user);
}
