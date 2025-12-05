package com.conecta.sorteio_api.dto;


public record UserRequestDTO(
                String name,
                String numberCell,
                String email,
                String keyPix,
                String password) {
}
