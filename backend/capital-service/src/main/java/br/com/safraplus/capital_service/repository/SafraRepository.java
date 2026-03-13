package br.com.safraplus.capital_service.repository;

import br.com.safraplus.capital_service.model.Safra;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SafraRepository extends JpaRepository<Safra, Long> {

    List<Safra> findByPropertyId(Long propertyId);
}
