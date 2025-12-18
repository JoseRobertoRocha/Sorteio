package com.conecta.sorteio_api.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class PageController {

    @GetMapping("/dashboard")
    public String dashboard() {
        return "Sorteio"; 
    }

    @GetMapping("admin/dashboard")
    public String dashboardUser(){
        return "Painel";
    }

    @GetMapping("/login")
    public String login(){
        return "index";
    }
    
    @GetMapping("/cadastros")
    public String cadastro(){
        return "cadastros";
    }

    @GetMapping("/resultado")
    public String resultado(){
        return "resultado";
    }

    @GetMapping("/cadastro-sorteio")
    public String cadastroSorteio(){
        return "cadastro-sorteio";
    }

   


}
