package br.com.safraplus.capital_service.repository;

import br.com.safraplus.capital_service.model.Property;
import br.com.safraplus.capital_service.model.PropertyUser;
import br.com.safraplus.capital_service.model.PropertyUserId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropertyUserRepository extends JpaRepository<PropertyUser, PropertyUserId> {
    List<PropertyUser> findByIdUserId(Long userId);
}
