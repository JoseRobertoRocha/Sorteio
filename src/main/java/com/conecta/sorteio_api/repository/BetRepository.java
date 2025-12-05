package com.conecta.sorteio_api.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.conecta.sorteio_api.model.Bet;

public interface BetRepository extends JpaRepository<Bet, UUID> {

    /**
     * Busca apostas que contenham um número específico.
     * Exemplo:
     * sweepstakeNumber @> ARRAY[4]
     */
    @Query(value = """
        SELECT * FROM tb_bet
        WHERE sweepstakeNumber @> array[:number]
        """, nativeQuery = true)
    List<Bet> findBetsContainingNumber(@Param("number") int number);

}
