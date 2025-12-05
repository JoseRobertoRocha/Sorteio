package com.conecta.sorteio_api.enuns;

public enum Role {
    ADMIN("admin"),
    CUSTOMER("customer");

   private final String role;

   Role(String role){
    this.role = role;
   }

   public String getRole(){
    return this.role;
   }
    
}
