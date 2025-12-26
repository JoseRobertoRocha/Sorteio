package com.conecta.sorteio_api.exeception;

public class CloseSweepstakeException extends RuntimeException{
    public CloseSweepstakeException(){
        super("O numero náo pode ser gerado porque o Sorteteio ja começou");
    }
    
}
