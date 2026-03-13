package br.com.safraplus.capital_service.repository;

import br.com.safraplus.capital_service.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {
}
