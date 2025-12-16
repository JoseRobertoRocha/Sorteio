package com.conecta.sorteio_api.controller.admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.conecta.sorteio_api.dto.SweepsatakeRequest;
import com.conecta.sorteio_api.dto.UserAdminDTO;
import com.conecta.sorteio_api.mapper.SweepsatakeMapper;
import com.conecta.sorteio_api.model.Sweepstake;
import com.conecta.sorteio_api.model.User;
import com.conecta.sorteio_api.service.SweepsatakeService;
import com.conecta.sorteio_api.service.UserService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("admin/api")
public class AdminController {

    private final UserService userService;
    private final SweepsatakeMapper sweepsatakeMapper;
    private final SweepsatakeService sweepsatakeService;

    public AdminController(SweepsatakeMapper sweepsatakeMapper, SweepsatakeService sweepsatakeService,
            UserService userService) {
        this.sweepsatakeMapper = sweepsatakeMapper;
        this.sweepsatakeService = sweepsatakeService;
        this.userService = userService;
    }

    @PostMapping("register/sweepsatake")
    public ResponseEntity save(@RequestBody SweepsatakeRequest sweepsatakeRequest) {
        Sweepstake sweepstake = sweepsatakeMapper.sweepsatakeRequestToSweepstake(sweepsatakeRequest);
        sweepsatakeService.saveSweepstake(sweepstake, sweepsatakeRequest.image());

        return ResponseEntity.status(200).build();
    }


    @GetMapping("users")
    public ResponseEntity<Page<UserAdminDTO>> getUsers(Pageable pageable) {
        Page<UserAdminDTO> page = userService.findUserLimit(pageable);
        return ResponseEntity.ok(page);
    }

}
