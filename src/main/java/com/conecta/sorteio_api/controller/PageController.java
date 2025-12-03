package com.conecta.sorteio_api.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class PageController {

    @GetMapping("/dashboard")
    public String dashboard() {
        return "Sorteio"; // arquivo templates/sorteio.html
    }
}
