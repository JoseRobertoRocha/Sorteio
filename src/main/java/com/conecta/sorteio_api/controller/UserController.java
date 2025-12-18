package com.conecta.sorteio_api.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.conecta.sorteio_api.dto.LoginResponseDTO;
import com.conecta.sorteio_api.dto.UserRequestDTO;
import com.conecta.sorteio_api.dto.UserRequestLogin;
import com.conecta.sorteio_api.dto.UserResponseDTO;
import com.conecta.sorteio_api.enuns.Role;
import com.conecta.sorteio_api.mapper.UserMapper;
import com.conecta.sorteio_api.model.User;
import com.conecta.sorteio_api.service.JwtService;
import com.conecta.sorteio_api.service.UserService;
import com.conecta.sorteio_api.userSecurity.UserSecurity;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@CrossOrigin("*")
@RestController
@RequestMapping("api")
public class UserController {
    private final UserMapper userMapper;
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public UserController(UserMapper userMapper, UserService userService, AuthenticationManager authenticationManager,
            JwtService jwtService) {
        this.userMapper = userMapper;
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody UserRequestDTO userRequestDTO) {
        System.out.println("USer tentou fazer o cadastro" + userRequestDTO.email());
        User userRequest = userMapper.userRequestToUser(userRequestDTO);

        userService.registeUser(userRequest);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Usuário registrado com sucesso");
        response.put("redirectTo", "/login");

        return ResponseEntity.status(201).body(response);
    }

    @PostMapping("/login")
    public String login(
            @RequestBody UserRequestLogin userRequestLogin,
            HttpServletResponse response) {

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                userRequestLogin.email(), userRequestLogin.password());

        Authentication authentication = authenticationManager.authenticate(authToken);
        UserSecurity userSecurity = (UserSecurity) authentication.getPrincipal();
        User user = userService.findByEmail(userSecurity.getUsername());

        String token = jwtService.generateToken(user);

        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60 * 4);
        response.addCookie(cookie);

        System.out.println("User Role " + user.getRole());

        if (user.getRole().equals(Role.ADMIN)) {
            return "redirect:/admin/dashboard";
        } else {
            return "redirect:/dashboard";
        }
    }

    @GetMapping("user")
    public ResponseEntity< UserResponseDTO> getUserInfo(){
       User user = userService.getInfo();
       UserResponseDTO userResponseDTO = userMapper.userToUserResponseDTO(user);
       return ResponseEntity.ok().body(userResponseDTO);
    }


   
   

}
