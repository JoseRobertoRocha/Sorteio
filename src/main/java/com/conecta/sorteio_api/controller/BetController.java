package com.conecta.sorteio_api.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.conecta.sorteio_api.dto.SweepstakeNumberRequestDTO;
import com.conecta.sorteio_api.dto.SweepstakeNumberResponseDTO;
import com.conecta.sorteio_api.mapper.SweepsatakeMapper;
import com.conecta.sorteio_api.service.BetService;

@RestController
@RequestMapping("api")
public class BetController {
    private final BetService betService;
    private final SweepsatakeMapper mapper;

    public BetController(BetService betService,SweepsatakeMapper mapper){
        this.betService = betService;
        this.mapper = mapper;
    }


    @PostMapping("register/numbers")
    public ResponseEntity<SweepstakeNumberResponseDTO> registerNumberSweepstake(@RequestBody SweepstakeNumberRequestDTO sweepstakeNumberRequestDTO){

        SweepstakeNumberResponseDTO numbers = new SweepstakeNumberResponseDTO(sweepstakeNumberRequestDTO.sweepstakeNumber());
        return ResponseEntity.status(201).body(numbers);
    }


    @PostMapping("register/globo-number")
    public ResponseEntity<Map<String,String>> putGlobNumber(@RequestBody int numberGlob){
        return ResponseEntity.status(201).body(Map.of("message","Numero adicionado com sucesso"));
    }

    @GetMapping("generate-numbers")
    public ResponseEntity<Map<String,int[]>> getRadomNumbers(){
        int[] numbers = betService.save();
        return ResponseEntity.ok().body(Map.of("numeros", numbers));
    } 
    
}
