package com.conecta.sorteio_api.mapper;

import org.springframework.stereotype.Component;

import com.conecta.sorteio_api.dto.SweepsatakeRequest;
import com.conecta.sorteio_api.model.Sweepstake;

@Component
public class SweepsatakeMapper {
    public Sweepstake sweepsatakeRequestToSweepstake(SweepsatakeRequest sweepsatakeRequest){
        return Sweepstake.builder()
            .name(sweepsatakeRequest.name())
            .date(sweepsatakeRequest.data())
            .prize(sweepsatakeRequest.prize())
            .build();
    }
    
}
