package com.PasswordManager.util;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.Base64;

@Component
public class CsrfUtil {

    private final SecureRandom secureRandom = new SecureRandom();
    private final Base64.Encoder base64Encoder = Base64.getUrlEncoder();

    public String generateCsrfToken() {
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        return base64Encoder.encodeToString(randomBytes);
    }

}
