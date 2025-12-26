package com.conecta.sorteio_api.controller;

import java.util.Map;
import com.conecta.sorteio_api.service.SweepsatakeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.conecta.sorteio_api.dto.LuckyNumberStatusResponseDTO;
import com.conecta.sorteio_api.dto.SweepstakeNumberRequestDTO;
import com.conecta.sorteio_api.dto.SweepstakeNumberResponseDTO;
import com.conecta.sorteio_api.mapper.SweepsatakeMapper;
import com.conecta.sorteio_api.service.BetService;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("api")
public class BetController {

    private final SweepsatakeService sweepsatakeService;
    private final BetService betService;
    private final SweepsatakeMapper mapper;

    public BetController(BetService betService, SweepsatakeMapper mapper, SweepsatakeService sweepsatakeService) {
        this.betService = betService;
        this.mapper = mapper;
        this.sweepsatakeService = sweepsatakeService;
    }

    @PostMapping("register/numbers")
    public ResponseEntity<SweepstakeNumberResponseDTO> registerNumberSweepstake(
            @RequestBody SweepstakeNumberRequestDTO sweepstakeNumberRequestDTO) {
        SweepstakeNumberResponseDTO numbers = new SweepstakeNumberResponseDTO(
                sweepstakeNumberRequestDTO.sweepstakeNumber());
        return ResponseEntity.status(201).body(numbers);
    }

    @PostMapping("register/globo-number")
    public ResponseEntity<Map<String, String>> putGlobNumber(@RequestBody int numberGlob) {
        return ResponseEntity.status(201).body(Map.of("message", "Numero adicionado com sucesso"));
    }

    @GetMapping("generate-numbers")
    public ResponseEntity<Map<String, int[]>> getRadomNumbers() {
        int[] numbers = betService.save();
        return ResponseEntity.ok().body(Map.of("numeros", numbers));
    }

    @GetMapping("lucky-number/status")
    public ResponseEntity<LuckyNumberStatusResponseDTO> getLuckyNumberStatus() {
        LuckyNumberStatusResponseDTO luckyNumberStatusResponseDTO = betService.getLuckyNumberStatus();

        return ResponseEntity.ok(
                luckyNumberStatusResponseDTO);
    }

    @GetMapping("start-sweepstake/{isStart}")
    public ResponseEntity<Void> getMethodName(@PathVariable boolean isStart) {
        System.out.println("key "+ isStart);
        sweepsatakeService.changekey(isStart);
        return ResponseEntity.ok().build();
    }

}
