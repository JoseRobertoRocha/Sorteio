package com.conecta.sorteio_api.dto;

public record LuckyNumberStatusResponseDTO(
    boolean alreadyGenerated,
    int[] numbers
) {}
