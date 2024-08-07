package com.PasswordManager.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Entity
@Table(name = "Users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String masterPassword;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<PasswordEntry> passwordEntries;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Log> logs = new ArrayList<>();

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getMasterPassword() {
        return masterPassword;
    }

    public void setMasterPassword(String masterPassword) {
        this.masterPassword = masterPassword;
    }

    public List<PasswordEntry> getPasswordEntries() {
        return passwordEntries;
    }

    public void setPasswordEntries(List<PasswordEntry> passwordEntries) {
        this.passwordEntries = passwordEntries;
    }

    public List<Log> getLogs() {
        return logs;
    }

    public void setLogs(List<Log> logs) {
        this.logs = logs;
    }

}