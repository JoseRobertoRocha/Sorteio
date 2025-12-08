package com.conecta.sorteio_api.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

import com.conecta.sorteio_api.dto.SweepsatakeRequest;
import com.conecta.sorteio_api.model.Sweepstake;
import com.conecta.sorteio_api.model.User;
import com.conecta.sorteio_api.repository.SweepsatakeRepository;

@Service
public class SweepsatakeService {

    private SweepsatakeRepository sweepsatakeRepository;

    public SweepsatakeService(SweepsatakeRepository sweepsatakeRepository){
        this.sweepsatakeRepository = sweepsatakeRepository;
    }





    // @Value("${upload.folder}")
    private String uploadFolder;

    private String saveImage(MultipartFile image){
        String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();

        Path path = Paths.get(uploadFolder, fileName);

        try {
            Files.copy(image.getInputStream(), path);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return fileName;
    }

    public void saveSweepstake(Sweepstake sweepstake, MultipartFile image){
        String fileName = saveImage(image);


        sweepstake.setImage("/uploads/"+ fileName);
        sweepstake.setAdminUser(new User());

        sweepsatakeRepository.save(sweepstake);


    }


}

