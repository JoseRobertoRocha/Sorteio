package com.conecta.sorteio_api.dto;

import java.util.List;
import java.util.Map;

public record NumbersAndBetsResponseDTO(int[] numbers,Map<String, int[]> userResponse , boolean iswinner) {
    
}
