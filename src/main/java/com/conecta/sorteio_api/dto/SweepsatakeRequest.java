package com.conecta.sorteio_api.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonFormat;

public record SweepsatakeRequest(
    String name,
    MultipartFile image,
    
    String prize,

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    LocalDateTime data
) {}
