package com.conecta.sorteio_api.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.conecta.sorteio_api.model.Sweepstake;

@Repository
public interface SweepsatakeRepository  extends JpaRepository<Sweepstake,UUID>{
    
}
