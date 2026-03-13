package br.com.safraplus.capital_service.controller;

import br.com.safraplus.capital_service.dto.SafraRequestDTO;
import br.com.safraplus.capital_service.dto.SafraResponseDTO;
import br.com.safraplus.capital_service.model.Safra;
import br.com.safraplus.capital_service.model.User;
import br.com.safraplus.capital_service.service.SafraEventPublisher;
import br.com.safraplus.capital_service.service.SafraService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/properties/{propertyId}/safras")
public class SafraController {
    private final SafraService safraService;
    private final SafraEventPublisher safraEventPublisher;

    @Autowired
    public SafraController(SafraService safraService, SafraEventPublisher safraEventPublisher) {
        this.safraService = safraService;
        this.safraEventPublisher = safraEventPublisher;
    }

    @PostMapping
    public ResponseEntity<SafraResponseDTO> createSafra(
            @PathVariable Long propertyId,
            @Valid @RequestBody SafraRequestDTO safraRequestDTO,
            @AuthenticationPrincipal User loggedInUser){
        Safra createdSafra = safraService.createSafra(safraRequestDTO, propertyId, loggedInUser);
        SafraResponseDTO safraResponseDTO = SafraResponseDTO.fromEntity(createdSafra);

        return ResponseEntity.status(HttpStatus.CREATED).body(safraResponseDTO);
    }

    @GetMapping
    public ResponseEntity<List<SafraResponseDTO>> getSafrasByProperty(
            @PathVariable Long propertyId,
            @AuthenticationPrincipal User loggedInUser
    ){
        List<Safra> safras = safraService.findSafrasByProperty(propertyId, loggedInUser);

        List<SafraResponseDTO> responseDTOS = safras.stream()
                .map(SafraResponseDTO::fromEntity).collect(Collectors.toList());

        return ResponseEntity.ok(responseDTOS);
    }

    @PutMapping("/{safraId}")
    public ResponseEntity<SafraResponseDTO> updateSafra(
            @PathVariable Long safraId,
            @Valid @RequestBody SafraRequestDTO safraRequestDTO,
            @AuthenticationPrincipal User loggedInUser
    ){
        Safra updatedSafra = safraService.updateSafra(safraId, safraRequestDTO, loggedInUser);
        SafraResponseDTO responseDTO = SafraResponseDTO.fromEntity(updatedSafra);

        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{safraId}")
    public ResponseEntity<Void> deleteSafra(
            @PathVariable Long safraId,
            @AuthenticationPrincipal User loggedInUser
    ){
        safraService.deleteSafra(safraId, loggedInUser);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{safraId}/analyze")
    public ResponseEntity<Void> requestAnalysis(
            @PathVariable Long propertyId,
            @PathVariable Long safraId,
            @AuthenticationPrincipal User loggedInUser) {

        safraService.verifySafraOwnership(safraId, loggedInUser);

        // Busca a safra (precisamos do objeto para pegar o cropType)
        // (Seria bom ter um método findByIdAndOwner no SafraService)
        List<Safra> safras = safraService.findSafrasByProperty(propertyId, loggedInUser);
        Safra safraToAnalyze = safras.stream()
                .filter(s -> s.getId().equals(safraId))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Safra não encontrada."));

        safraEventPublisher.publishAnalysisRequestEvent(safraToAnalyze, loggedInUser);

        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
}
