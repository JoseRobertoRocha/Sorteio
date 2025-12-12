package com.conecta.sorteio_api.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.conecta.sorteio_api.exeception.UserNotFoundException;
import com.conecta.sorteio_api.model.User;

@Service
public class JwtService {
    @Value("${jwt.secret:${JWT_SECRET:default-secret}}")
    private String secret;

    @Value("${jwt.issuer:${JWT_ISSUER:login-api}}")
    private String issuer;

    public String generateToken(User user) {
        if (user.getEmail() == null) throw new UserNotFoundException();

        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer(issuer)
                    .withSubject(user.getEmail())
                    .withExpiresAt(getExpireDate())
                    .sign(algorithm);

        } catch (JWTCreationException error) {
            throw new RuntimeException("Error while generating token", error);
        }
    }

    public String validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer(issuer)
                    .build()
                    .verify(token)
                    .getSubject();

        } catch (JWTVerificationException error) {
            throw new RuntimeException("Error while verifying token", error);
        }
    }

    private Instant getExpireDate() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
