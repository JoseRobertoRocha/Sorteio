package com.conecta.sorteio_api.dto;

import java.time.LocalDateTime;
import java.util.List;

public record UserAdminDTO (  String name,
     String email,
     String phone,
     String pix,
     List<Integer> luckyNumber,
     LocalDateTime lastOnline,
     LocalDateTime createdAt){

   
}

