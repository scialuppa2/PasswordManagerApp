package com.PasswordManager.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class CsrfRequestFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        if (requestURI.equals("/auth/login")) {
            chain.doFilter(request, response);
            return;
        } else if (requestURI.equals("/users/register")) {
            chain.doFilter(request, response);
            return;
        } else if (requestURI.equals("/users")) {
            chain.doFilter(request, response);
            return;
        }

        String csrfToken = request.getHeader("X-XSRF-Token");


        if (csrfToken == null) {
            setErrorResponse(HttpServletResponse.SC_FORBIDDEN, response, "CSRF Token is missing");
            return;
        }

        chain.doFilter(request, response);
    }


    private void setErrorResponse(int status, HttpServletResponse response, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.getWriter().write("{\"errorMessage\": \"" + message + "\"}");
    }
}
