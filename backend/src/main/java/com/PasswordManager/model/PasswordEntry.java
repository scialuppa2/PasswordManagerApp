package com.PasswordManager.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "Password_Entries")
public class PasswordEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @ManyToOne
    @JoinColumn(name = "directory_id", nullable = true)
    @JsonIgnore
    private Directory directory;

    @Column(nullable = false)
    private String url;

    private String username;

    @Column(nullable = false)
    private String password;

    @OneToMany(mappedBy = "passwordEntry", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Log> logs = new ArrayList<>();

    @Transient
    private UUID userId;

    public PasswordEntry() {}

    // Getters e Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Directory getDirectory() {
        return directory;
    }

    public void setDirectory(Directory directory) {
        this.directory = directory;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<Log> getLogs() {
        return logs;
    }

    public void setLogs(List<Log> logs) {
        this.logs = logs;
    }

    public UUID getUserId() {
        return user != null ? user.getId() : null;
    }

    public UUID getDirectoryId() {
        return directory != null ? directory.getId() : null;
    }
}
