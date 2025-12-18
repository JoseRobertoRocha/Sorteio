package com.conecta.sorteio_api.exeception;

public class UserAlreadyNumberInSweepstake  extends RuntimeException{

    public UserAlreadyNumberInSweepstake(){
        super("Usuario ja possui um nomero nesse sorteio");
    }
    
}
