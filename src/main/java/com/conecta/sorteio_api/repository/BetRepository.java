package com.conecta.sorteio_api.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.conecta.sorteio_api.model.Bet;
import com.conecta.sorteio_api.model.User;

public interface BetRepository extends JpaRepository<Bet, UUID> {
    @Query(value = """
                SELECT
                    u.email AS email,
                    b.sweepstake_number AS sweepstakeNumber,
                    (
                        SELECT COUNT(*)
                        FROM unnest(b.sweepstake_number) bn
                        WHERE bn = ANY(:numbers)
                    ) AS hits
                FROM tb_bet b
                JOIN tb_user u ON u.id = b.user_id
                WHERE b.sweepstake_number && :numbers
                ORDER BY hits DESC
                LIMIT 10
            """, nativeQuery = true)
    List<BetHitsView> findTop10ByHits(@Param("numbers") int[] numbers);

    List<Bet> findByUserId(UUID userId);

}
