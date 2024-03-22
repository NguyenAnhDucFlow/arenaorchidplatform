package com.example.mutantorchidplatform.exception;

public class AlreadyExistedException extends RuntimeException {

    public AlreadyExistedException(String message) {
        super(message);
    }

    public AlreadyExistedException(String message, Throwable cause) {
        super(message, cause);
    }
}
