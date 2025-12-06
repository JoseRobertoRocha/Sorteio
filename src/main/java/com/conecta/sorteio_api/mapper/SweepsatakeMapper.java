package com.conecta.sorteio_api.mapper;

import com.conecta.sorteio_api.dto.SweepsatakeRequest;
import com.conecta.sorteio_api.model.Sweepstake;

public class SweepsatakeMapper {
    public Sweepstake sweepsatakeRequestToSweepstake(SweepsatakeRequest sweepsatakeRequest){
        return Sweepstake.builder()
            .name(sweepsatakeRequest.name())
            .date(sweepsatakeRequest.data())
            .prize(sweepsatakeRequest.prize())
            .build();
    }
    
}
