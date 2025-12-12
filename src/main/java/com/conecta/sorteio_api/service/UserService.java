package com.conecta.sorteio_api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.conecta.sorteio_api.enuns.Role;
import com.conecta.sorteio_api.exeception.UserAlreadyExistException;
import com.conecta.sorteio_api.exeception.UserNotFoundException;
import com.conecta.sorteio_api.model.User;
import com.conecta.sorteio_api.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }


    public User findByEmail(String email){

        return userRepository.findByEmail(email).orElseThrow(UserNotFoundException::new);
    }

    public User registeUser(User user){
        if (userRepository.findByEmail(user.getEmail()).isPresent()){
            throw new UserAlreadyExistException();
        }
        user.setRole(Role.CUSTOMER);

        return userRepository.save(user);
    }

    public List<User> findAll(){
        return userRepository.findAll();
    }

    public User getByEmail(){
        return userRepository.findByEmail("richardjanebo@gmail.com").orElseThrow(UserNotFoundException::new);
    }

    
}
