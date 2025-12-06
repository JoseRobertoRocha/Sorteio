package com.conecta.sorteio_api.controller.admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.conecta.sorteio_api.dto.SweepsatakeRequest;
import com.conecta.sorteio_api.mapper.SweepsatakeMapper;
import com.conecta.sorteio_api.model.Sweepstake;
import com.conecta.sorteio_api.service.SweepsatakeService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("admin/api")
public class SweepstakeController {
    private final SweepsatakeMapper sweepsatakeMapper;
    private final SweepsatakeService sweepsatakeService;

    public SweepstakeController(SweepsatakeMapper sweepsatakeMapper, SweepsatakeService sweepsatakeService) {
        this.sweepsatakeMapper = sweepsatakeMapper;
        this.sweepsatakeService = sweepsatakeService;
    }

    @PostMapping("register/sweepsatake")
    public ResponseEntity save(@RequestBody SweepsatakeRequest sweepsatakeRequest) {
        Sweepstake sweepstake = sweepsatakeMapper.sweepsatakeRequestToSweepstake(sweepsatakeRequest);
        sweepsatakeService.saveSweepstake(sweepstake,sweepsatakeRequest.image());

        return ResponseEntity.status(200).build();
    }

}
