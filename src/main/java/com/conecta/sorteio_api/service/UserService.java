package com.conecta.sorteio_api.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.conecta.sorteio_api.configuration.UserUtil;
import com.conecta.sorteio_api.dto.UserAdminDTO;
import com.conecta.sorteio_api.enuns.Role;
import com.conecta.sorteio_api.exeception.UserAlreadyExistException;
import com.conecta.sorteio_api.exeception.UserNotFoundException;
import com.conecta.sorteio_api.mapper.UserAdminMapper;
import com.conecta.sorteio_api.model.User;
import com.conecta.sorteio_api.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserAdminMapper mapper;
    private final SweepsatakeService sweepsatakeService;
    private final UserUtil userUtil;

    public UserService(UserUtil userUtil ,UserRepository userRepository,UserAdminMapper mapper, SweepsatakeService sweepsatakeService){
        this.userRepository = userRepository;
        this.mapper = mapper;
        this.sweepsatakeService = sweepsatakeService;
        this.userUtil = userUtil;
    }


    public User findByEmail(String email){

        return userRepository.findByEmail(email).orElseThrow(UserNotFoundException::new);
    }

    public User registeUser(User user){
        if (userRepository.findByEmail(user.getEmail()).isPresent()){
            throw new UserAlreadyExistException();
        }

        user.setRole(Role.ADMIN);

        return userRepository.save(user);
    }

    public List<User> findAll(){
        return userRepository.findAll();
    }

    public User getByEmail(){
        return userRepository.findByEmail("richardjanebo@gmail.com").orElseThrow(UserNotFoundException::new);
    }


    public Page<UserAdminDTO> findUserLimit(Pageable pageable) {
        return userRepository
                .findAll(pageable)
                .map(mapper::toDTO);
    }


    public User getInfo() {
        return userUtil.getCurrentUser();
    }



    
}
