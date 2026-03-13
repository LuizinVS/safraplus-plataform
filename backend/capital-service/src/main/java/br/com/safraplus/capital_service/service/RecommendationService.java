package br.com.safraplus.capital_service.service;

import br.com.safraplus.capital_service.dto.RecommendationRequestDTO;
import br.com.safraplus.capital_service.model.Recommendation;
import br.com.safraplus.capital_service.model.User;

import java.util.List;

public interface RecommendationService {
    Recommendation createRecommendation(Long safraId, RecommendationRequestDTO requestDTO);

    List<Recommendation> findRecommendationsBySafraId(Long safraId);

    Recommendation updateStatus(Long recommendationId, String status, User owner);

    void deleteRecommendation(Long recommendationId, User owner);
}
