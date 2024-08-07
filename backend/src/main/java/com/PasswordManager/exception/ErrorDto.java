package com.PasswordManager.exception;

public class ErrorDto {
    private String errorMessage;

    public ErrorDto(String errorMessage) {
        super();
        this.errorMessage = errorMessage;
    }

    public ErrorDto() {
        super();
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}

