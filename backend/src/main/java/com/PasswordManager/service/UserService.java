package com.PasswordManager.service;

import com.PasswordManager.exception.ResourceNotFoundException;
import com.PasswordManager.model.User;
import com.PasswordManager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User with id " + id + " not found"));
    }

    public User save(User user) {
        user.setMasterPassword(passwordEncoder.encode(user.getMasterPassword()));
        return userRepository.save(user);
    }

    public void deleteUserById(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User with id " + id + " not found");
        }
        userRepository.deleteById(id);
    }

    public User changeUsername(UUID id, String newUsername) {
        User user = findUserById(id);
        user.setUsername(newUsername);
        return userRepository.save(user);
    }

    public User changeMasterPassword(UUID id, String newMasterPassword) {
        User user = findUserById(id);
        user.setMasterPassword(passwordEncoder.encode(newMasterPassword));
        return userRepository.save(user);
    }

}
