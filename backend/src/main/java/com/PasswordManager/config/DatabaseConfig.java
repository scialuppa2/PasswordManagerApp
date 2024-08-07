package com.PasswordManager.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@Configuration
public class DatabaseConfig {

    @Autowired
    private DataSource dataSource;

    @PostConstruct
    public void testConnection() {
        try (Connection connection = dataSource.getConnection()) {
            System.out.println("Database connected successfully: " + connection.getMetaData().getDatabaseProductName());
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
