package com.conecta.sorteio_api.mapper;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.conecta.sorteio_api.dto.UserAdminDTO;
import com.conecta.sorteio_api.model.Bet;
import com.conecta.sorteio_api.model.User;
import com.conecta.sorteio_api.repository.BetRepository;

@Component
public class UserAdminMapper {

    private final BetRepository betRepository;

    public UserAdminMapper(BetRepository betRepository) {
        this.betRepository = betRepository;
    }

    public UserAdminDTO toDTO(User user) {
        if (user == null)
            return null;

        List<Bet> bets = betRepository.findByUserId(user.getId());

        List<Integer> luckyNumbers = new ArrayList<>(); 

        for (Bet bet : bets) {
            if (bet.getSweepstakeNumber() != null) {
                for (int n : bet.getSweepstakeNumber()) {
                    luckyNumbers.add(n);
                }
            }
        }

        return new UserAdminDTO(
                user.getName(),
                user.getEmail(),
                user.getNumberCell(), // phone
                user.getKeyPix(), // pix
                luckyNumbers,
                user.getUpdatedAt(), // ou lastOnline se você tiver
                user.getCreatedAt());
    }
}
