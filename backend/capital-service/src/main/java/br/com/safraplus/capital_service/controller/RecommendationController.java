package br.com.safraplus.capital_service.controller;

import br.com.safraplus.capital_service.dto.RecommendationRequestDTO;
import br.com.safraplus.capital_service.dto.RecommendationResponseDTO;
import br.com.safraplus.capital_service.dto.UpdateStatusRequestDTO;
import br.com.safraplus.capital_service.model.Recommendation;
import br.com.safraplus.capital_service.model.User;
import br.com.safraplus.capital_service.service.RecommendationService;
import br.com.safraplus.capital_service.service.SafraService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/safras/{safraId}/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final SafraService safraService;

    public RecommendationController(RecommendationService recommendationService, SafraService safraService) {
        this.recommendationService = recommendationService;
        this.safraService = safraService;
    }

    @PostMapping
    public ResponseEntity<RecommendationResponseDTO> saveRecommendation(
            @PathVariable Long safraId,
            @Valid @RequestBody RecommendationRequestDTO recommendationRequestDTO
            ){
        Recommendation createdRecommendation = recommendationService
                .createRecommendation(safraId, recommendationRequestDTO);
        RecommendationResponseDTO responseDTO = RecommendationResponseDTO.fromEntity(createdRecommendation);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @GetMapping
    public ResponseEntity<List<RecommendationResponseDTO>> getRecommendationsForSafra(
            @PathVariable Long safraId,
            @AuthenticationPrincipal User loggedInUser
    ){
        safraService.verifySafraOwnership(safraId, loggedInUser);

        List<Recommendation> recommendations = recommendationService.findRecommendationsBySafraId(safraId);
        List<RecommendationResponseDTO> responseDTOS = recommendations.stream()
                .map(RecommendationResponseDTO::fromEntity).collect(Collectors.toList());

        return ResponseEntity.ok(responseDTOS);
    }

    @PatchMapping("/{recommendationId}/status")
    public ResponseEntity<RecommendationResponseDTO> updateRecommendationStatus(
            @PathVariable Long recommendationId,
            @Valid @RequestBody UpdateStatusRequestDTO statusRequestDTO,
            @AuthenticationPrincipal User loggedInUser
            ){
        Recommendation updatedRecommendation = recommendationService
                .updateStatus(recommendationId, statusRequestDTO.status(), loggedInUser);
        return ResponseEntity.ok(RecommendationResponseDTO.fromEntity(updatedRecommendation));
    }

    @DeleteMapping("/{recommendationId}")
    public ResponseEntity<Void> deleteRecommendation(
            @PathVariable Long recommendationId,
            @AuthenticationPrincipal User loggedInUser
    ){
        recommendationService.deleteRecommendation(recommendationId, loggedInUser);
        return ResponseEntity.noContent().build();
    }
}
