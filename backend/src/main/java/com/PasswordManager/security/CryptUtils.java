package com.PasswordManager.security;

import org.springframework.stereotype.Component;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Arrays;

@Component
public class CryptUtils {

    private static final String ALGORITHM = "AES";

    public String encrypt(String data, String key) {
        try {
            byte[] keyBytes = Arrays.copyOf(key.getBytes(StandardCharsets.UTF_8), 16);
            SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, ALGORITHM);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);

            byte[] encryptedBytes = cipher.doFinal(data.getBytes());
            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while encrypting", e);
        }
    }


    public String decrypt(String encryptedData, String key) throws Exception {
        byte[] keyBytes = Arrays.copyOf(key.getBytes(StandardCharsets.UTF_8), 16);
        SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, ALGORITHM);

        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, secretKeySpec);

        byte[] encryptedBytes = Base64.getDecoder().decode(encryptedData);
        byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
        return new String(decryptedBytes, StandardCharsets.UTF_8);
    }


}
