package com.conecta.sorteio_api.service;

import org.springframework.stereotype.Service;

import com.conecta.sorteio_api.model.Bet;
import com.conecta.sorteio_api.repository.BetRepository;

@Service
public class BetService {
    private final BetRepository betRepository;

    public BetService(BetRepository betRepository){
        this.betRepository = betRepository;
    }


    public void save(Bet bet){
        betRepository.save(bet);
    }
    
}
