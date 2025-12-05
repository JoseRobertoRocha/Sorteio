package com.conecta.sorteio_api.controller;

import java.nio.channels.Pipe.SourceChannel;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.conecta.sorteio_api.dto.UserRequestDTO;
import com.conecta.sorteio_api.dto.UserRequestLogin;
import com.conecta.sorteio_api.mapper.UserMapper;
import com.conecta.sorteio_api.model.User;
import com.conecta.sorteio_api.service.UserService;

@CrossOrigin("*")
@RestController
@RequestMapping("api")
public class UserController {
    private final UserMapper userMapper;
    private final UserService userService;

    public UserController(UserMapper userMapper, UserService userService) {
        this.userMapper = userMapper;
        this.userService = userService;
    }

    @PostMapping("register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody UserRequestDTO userRequestDTO) {
        System.out.println("USer tentou fazer o cadastro"+ userRequestDTO.email());
        User userRequest = userMapper.userRequestToUser(userRequestDTO);

        userService.registeUser(userRequest);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Usuário registrado com sucesso");
        response.put("redirectTo", "/login");

        

        return ResponseEntity.status(201).body(response);
    }

    @PostMapping("login")
    public ResponseEntity login(@RequestBody UserRequestLogin userRequestLogin){
        System.out.println("Usuario na rota login");
        System.out.println("Email "+ userRequestLogin.email());
        System.out.println("Passsword " + userRequestLogin.password());
        return  ResponseEntity.ok().build();
    }

}
