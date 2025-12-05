package com.conecta.sorteio_api.exeception;

import java.util.Map;

import org.springframework.http.HttpStatus;
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

}
