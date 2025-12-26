package com.conecta.sorteio_api.service;

import java.util.HashSet;
import java.util.Random;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.conecta.sorteio_api.configuration.UserUtil;
import com.conecta.sorteio_api.dto.LuckyNumberStatusResponseDTO;
import com.conecta.sorteio_api.exeception.CloseSweepstakeException;
import com.conecta.sorteio_api.model.Bet;
import com.conecta.sorteio_api.model.Sweepstake;
import com.conecta.sorteio_api.repository.BetRepository;
import com.conecta.sorteio_api.repository.SweepsatakeRepository;

@Service
public class BetService {

    private final BetRepository betRepository;
    private final SweepsatakeRepository sweepsatakeRepository;
    private final UserUtil userUtil;

    public BetService(
            BetRepository betRepository,
            SweepsatakeRepository sweepsatakeRepository,
            UserUtil userUtil) {

        this.betRepository = betRepository;
        this.sweepsatakeRepository = sweepsatakeRepository;
        this.userUtil = userUtil;
    }

    /**
     * Gera os números da sorte para o usuário logado.
     * Se o usuário já tiver números, retorna os mesmos.
     */
    public int[] save() {
        Sweepstake sweepstake = sweepsatakeRepository.findAll().getFirst();
        if (sweepstake.getKey()) {
            throw new CloseSweepstakeException();
        }

        UUID userId = userUtil.getCurrentUser().getId();

        // Verifica se o usuário já possui aposta
        var bets = betRepository.findByUserId(userId);

        if (!bets.isEmpty()) {
            // Retorna os números já existentes
            return bets.get(0).getSweepstakeNumber();
        }

        // Gera novos números
        int[] numbers = generateNumbers();

        Bet bet = Bet.builder()
                .sweepstakeNumber(numbers)
                .sweepstake(sweepstake)
                .user(userUtil.getCurrentUser())
                .build();

        betRepository.save(bet);

        return numbers;
    }

    /**
     * Gera 10 dezenas únicas entre 10 e 99.
     */
    private int[] generateNumbers() {
        Random random = new Random();
        Set<Integer> numbers = new HashSet<>();

        while (numbers.size() < 10) {
            int n = random.nextInt(99) + 1; // 01–99
            numbers.add(n);
        }

        return numbers.stream()
                .sorted()
                .mapToInt(Integer::intValue)
                .toArray();
    }

    public LuckyNumberStatusResponseDTO getLuckyNumberStatus() {
        UUID userId = userUtil.getCurrentUser().getId();

        var bets = betRepository.findByUserId(userId);

        if (!bets.isEmpty()) {

            return new LuckyNumberStatusResponseDTO(true, bets.get(0).getSweepstakeNumber());
        }

        return new LuckyNumberStatusResponseDTO(false, null);
    }

}
