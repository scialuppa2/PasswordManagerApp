package com.PasswordManager.model;

public class LoginRequest {
    private String username;
    private String masterPassword;

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
}

