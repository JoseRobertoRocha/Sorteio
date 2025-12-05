package com.conecta.sorteio_api.exeception;

public class UserAlreadyExistException extends RuntimeException{
    public UserAlreadyExistException(){
        super("Usuario já cadastrado");
    }

    public UserAlreadyExistException(String message){
        super(message);
    }
    
}