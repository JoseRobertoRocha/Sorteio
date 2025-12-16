package com.conecta.sorteio_api.repository;

import org.springframework.stereotype.Repository;

import com.conecta.sorteio_api.model.User;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface UserRepository extends JpaRepository<User,UUID>{
    Optional<User> findByEmail(String email);

    
}