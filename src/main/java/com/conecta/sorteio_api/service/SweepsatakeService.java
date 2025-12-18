package com.conecta.sorteio_api.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.conecta.sorteio_api.configuration.UserUtil;
import com.conecta.sorteio_api.dto.NumbersAndBetsResponseDTO;
import com.conecta.sorteio_api.exeception.UserNotFoundException;
import com.conecta.sorteio_api.model.Bet;
import com.conecta.sorteio_api.model.Sweepstake;
import com.conecta.sorteio_api.model.User;
import com.conecta.sorteio_api.repository.BetHitsView;
import com.conecta.sorteio_api.repository.BetRepository;
import com.conecta.sorteio_api.repository.SweepsatakeRepository;

@Service
public class SweepsatakeService {

    private final SweepsatakeRepository repository;
    private final UserUtil userUtil;
    private final BetRepository betRepository;

    private static final String UPLOAD_DIR = "uploads";

    public SweepsatakeService(SweepsatakeRepository repository, UserUtil userUtil, BetRepository betRepository) {
        this.repository = repository;
        this.userUtil = userUtil;
        this.betRepository = betRepository;

    }

    public void saveSweepstake(Sweepstake sweepstake, MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            String imagePath = saveImage(image);
            sweepstake.setImagePath(imagePath);
            sweepstake.setAdminUser(userUtil.getCurrentUser());
        }

        repository.save(sweepstake);
    }

    private String saveImage(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            Files.copy(file.getInputStream(), filePath);

            return fileName;

        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar imagem", e);
        }
    }

    public int[] setNumber(int[] number) {
        Sweepstake sweepstake = repository.findAll().getFirst();
        sweepstake.setNumbers(number);
        repository.save(sweepstake);

        return sweepstake.getNumbers();
    }

    public NumbersAndBetsResponseDTO getNumbers() {

        // 1️⃣ Buscar números sorteados
        int[] drawnNumbers = repository.findAll()
                .stream()
                .findFirst()
                .map(sweep -> {
                    int[] numbers = sweep.getNumbers();
                    return numbers != null ? numbers : new int[0];
                })
                .orElse(new int[0]);

        // Se não tem sorteio ainda
        if (drawnNumbers.length == 0) {
            return new NumbersAndBetsResponseDTO(drawnNumbers, Map.of(), false);
        }

        // 2️⃣ Buscar TOP 10 apostas mais próximas
        List<BetHitsView> topBets = betRepository.findTop10ByHits(drawnNumbers);

        // 3️⃣ Montar resposta (email -> números da aposta)
        Map<String, int[]> userResponse = new LinkedHashMap<>();

        boolean isWinner = false;

        for (BetHitsView bet : topBets) {
            userResponse.put(
                    bet.getEmail(), // ou email se quiser buscar depois
                    bet.getSweepstakeNumber());

            // 4️⃣ Verificar vencedor REAL
            if (bet.getHits() == bet.getSweepstakeNumber().length) {
                isWinner = true;
            }
        }

        return new NumbersAndBetsResponseDTO(
                drawnNumbers,
                userResponse,
                isWinner);
    }

   

}
