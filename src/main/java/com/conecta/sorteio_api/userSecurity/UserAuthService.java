package com.conecta.sorteio_api.userSecurity;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.conecta.sorteio_api.exeception.UserNotFoundException;
import com.conecta.sorteio_api.model.User;
import com.conecta.sorteio_api.repository.UserRepository;

@Service
public class UserAuthService implements UserDetailsService {
    private final UserRepository userRepository;

    public UserAuthService(UserRepository UserRepository){
        this.userRepository = UserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("Dentro do user details " + username);
        User user = userRepository.findByEmail(username).orElseThrow(() -> new UserNotFoundException());
        return new UserSecurity(user);
    }
    
}
