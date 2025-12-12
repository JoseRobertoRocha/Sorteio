package com.conecta.sorteio_api.mapper;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.conecta.sorteio_api.dto.UserRequestDTO;
import com.conecta.sorteio_api.dto.UserResponseDTO;
import com.conecta.sorteio_api.model.User;

@Component
public class UserMapper {
    private final PasswordEncoder passwordEncoder;

    public UserMapper(PasswordEncoder passwordEncoder){
        this.passwordEncoder = passwordEncoder;
    }


    public User userRequestToUser(UserRequestDTO userRequestDTO){
        return User.builder()
            .name(userRequestDTO.name())
            .email(userRequestDTO.email())
            .numberCell(userRequestDTO.numberCell())
            .keyPix(userRequestDTO.keyPix())
            .password(passwordEncoder.encode(userRequestDTO.password()))
            .build();
    }

    public UserResponseDTO userToUserResponseDTO(User user){
        return new UserResponseDTO(user.getName(),user.getEmail());
    }
    
}