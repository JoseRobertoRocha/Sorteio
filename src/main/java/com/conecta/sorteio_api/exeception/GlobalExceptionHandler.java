package com.conecta.sorteio_api.exeception;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(UserAlreadyExistException.class)
    public Map<String, String> userAlreadyExceptionHandler(UserAlreadyExistException userAlreadyExistException) {
        return Map.of("error", userAlreadyExistException.getMessage());
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(UserNotFoundException.class)
    public Map<String, String> userNotFoundExceptionHandler(UserNotFoundException userNotFoundException) {
        return Map.of("error", userNotFoundException.getMessage());
    }

    @ExceptionHandler(CloseSweepstakeException.class)
    public ResponseEntity<?> handleCloseSweepstake(CloseSweepstakeException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of("message", ex.getMessage()));
    }

}
