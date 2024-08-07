package com.PasswordManager.util;

import com.PasswordManager.exception.ErrorDto;
import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long jwtExpirationInMs;

    public String generateToken(UserDetails userDetails) {
        return generateToken(userDetails.getUsername());
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationInMs))
                .signWith(SignatureAlgorithm.HS384, secret)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secret)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private Boolean isTokenExpired(String token) {
        Date expiration = Jwts.parserBuilder()
                .setSigningKey(secret)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
        return expiration != null && expiration.before(new Date());
    }


    public Claims parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secret)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public ResponseEntity<?> validateAuthorizationHeader(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorDto("Authorization token is missing or invalid."));
        }

        String token = authorizationHeader.replace("Bearer ", "");
        try {
            Claims claims = parseToken(token);
            if (isTokenExpired(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorDto("Token is expired."));
            }
            return null;
        } catch (ExpiredJwtException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorDto("Token is expired: " + e.getMessage()));
        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorDto("Invalid Token: " + e.getMessage()));
        }
    }

}
