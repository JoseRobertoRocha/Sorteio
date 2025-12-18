package com.conecta.sorteio_api.dto;

import java.time.LocalDateTime;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

public record SweepsatakeRequest(

    String name,

    MultipartFile image,

    String prize,

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    LocalDateTime data

) {}
