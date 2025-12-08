package com.conecta.sorteio_api.userSecurity;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.conecta.sorteio_api.exeception.UserNotFoundException;
import com.conecta.sorteio_api.model.User;
import com.conecta.sorteio_api.repository.UserRepository;

public class UserAuthService implements UserDetailsService {
    private final UserRepository userRepository;

    public UserAuthService(UserRepository UserRepository){
        this.userRepository = UserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException());
        return new UserSecurity(user);
    }
    
}
