package com.conecta.sorteio_api.configuration;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import com.conecta.sorteio_api.model.User;


@Component
public class UserUtil {

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() ||
                auth.getPrincipal().equals("anonymousUser")) {
            throw new RuntimeException("Usuário não autenticado");
        }

        return (User) auth.getPrincipal(); 
    }
}
