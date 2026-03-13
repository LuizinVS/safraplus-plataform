package br.com.safraplus.capital_service.repository;

import br.com.safraplus.capital_service.model.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    List<Recommendation> findBySafraId(Long safraId);
}
