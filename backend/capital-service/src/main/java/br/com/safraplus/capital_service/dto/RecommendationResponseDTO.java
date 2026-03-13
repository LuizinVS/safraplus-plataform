package br.com.safraplus.capital_service.dto;

import br.com.safraplus.capital_service.model.Recommendation;

import java.time.LocalDateTime;

public record RecommendationResponseDTO(
        Long Id,
        String recommendationText,
        String action,
        String status,
        LocalDateTime createdAt,
        Long safraId
) {
    public static RecommendationResponseDTO fromEntity(Recommendation recommendation){
        return new RecommendationResponseDTO(
            recommendation.getId(),
            recommendation.getRecommendationText(),
            recommendation.getAction(),
            recommendation.getStatus(),
            recommendation.getCreatedAt(),
            recommendation.getSafra().getId()
        );
    }
}
