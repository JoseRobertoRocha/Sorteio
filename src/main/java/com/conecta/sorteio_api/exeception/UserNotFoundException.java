package com.conecta.sorteio_api.exeception;



public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(){
        super("Usuario não encontrado");
    }

    public UserNotFoundException(String message){
        super(message);
    }
}
