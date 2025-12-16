package com.conecta.sorteio_api.service;

import java.util.HashSet;
import java.util.Random;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.conecta.sorteio_api.model.Bet;
import com.conecta.sorteio_api.repository.BetRepository;

@Service
public class BetService {
    private final BetRepository betRepository;
    

    public BetService(BetRepository betRepository){
        this.betRepository = betRepository;
    }


    public int[] save(){
        int[] number = generateNumbers();
        new Bet().builder()
        .sweepstakeNumber(number)
        .


        betRepository.save(bet);
        return number;

    }

    



    public int[] generateNumbers(){
        Random random = new Random();
        int maxSize = 10;

        Set<Integer> numbers = new HashSet<>();

       while(numbers.size() < maxSize){
         int dezena =  random.nextInt(90)  + 10 ;
         numbers.add(dezena);
       }


       return numbers.stream().mapToInt(Integer::intValue).toArray();
        
    }
    
    
}
