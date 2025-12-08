package com.conecta.sorteio_api.configuration.security;

import java.io.IOException;
import java.util.Arrays;

import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class SecurityFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
                if(getEndpoints(request)){
                    
                }






    }


    public boolean getEndpoints(HttpServletRequest servletRequest){
        String endpoint = servletRequest.getRequestURI();
        String[] publicEndpoints = {
            "/login",
            "/imagens",
            "/fonts",
            "/js"
        };

        return Arrays.stream(publicEndpoints).noneMatch(endpoint::startsWith);
    }
}
