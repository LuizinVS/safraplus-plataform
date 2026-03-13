package br.com.safraplus.capital_service.service.implementation;

import br.com.safraplus.capital_service.dto.RecommendationRequestDTO;
import br.com.safraplus.capital_service.model.Recommendation;
import br.com.safraplus.capital_service.model.Safra;
import br.com.safraplus.capital_service.model.User;
import br.com.safraplus.capital_service.repository.RecommendationRepository;
import br.com.safraplus.capital_service.repository.SafraRepository;
import br.com.safraplus.capital_service.service.RecommendationService;
import br.com.safraplus.capital_service.service.SafraService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecommendationServiceImpl implements RecommendationService {
    private final RecommendationRepository recommendationRepository;
    private final SafraRepository safraRepository;
    private final SafraService safraService;

    public RecommendationServiceImpl(RecommendationRepository recommendationRepository, SafraRepository safraRepository, SafraService safraService) {
        this.recommendationRepository = recommendationRepository;
        this.safraRepository = safraRepository;
        this.safraService = safraService;
    }

    @Override
    public Recommendation createRecommendation(Long safraId, RecommendationRequestDTO recommendationRequestDTO){
        Safra safra = safraRepository.findById(safraId)
                .orElseThrow(() -> new EntityNotFoundException("Safra de ID: "+ safraId + " não encontrada"));
        Recommendation newRecommendation = new Recommendation();
        newRecommendation.setRecommendationText(recommendationRequestDTO.recommendationText());
        newRecommendation.setAction(recommendationRequestDTO.action());
        newRecommendation.setSafra(safra);

        return recommendationRepository.save(newRecommendation);
    }

    @Override
    public List<Recommendation> findRecommendationsBySafraId(Long safraId){
        return recommendationRepository.findBySafraId(safraId);
    }

    @Override
    public Recommendation updateStatus(Long recommendationId, String status, User owner){
        Recommendation recommendation = recommendationRepository.findById(recommendationId)
                .orElseThrow(() -> new EntityNotFoundException("Recomendação com o ID:"+ recommendationId
                        + " não foi encontrada"));
        safraService.verifySafraOwnership(recommendation.getSafra().getId(), owner);

        recommendation.setStatus(status);
        return recommendationRepository.save(recommendation);
    }

    @Override
    public void deleteRecommendation(Long recommendationId, User owner){
        Recommendation recommendation = recommendationRepository.findById(recommendationId)
                .orElseThrow(() -> new EntityNotFoundException("Recomendação com o ID:"+ recommendationId
                        + " não foi encontrada"));

        safraService.verifySafraOwnership(recommendation.getSafra().getId(), owner);

        recommendationRepository.delete(recommendation);
    }
}
