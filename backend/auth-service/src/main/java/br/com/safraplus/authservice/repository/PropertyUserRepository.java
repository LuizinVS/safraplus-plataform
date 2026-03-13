package br.com.safraplus.authservice.repository;

import br.com.safraplus.authservice.model.PropertyUser;
import br.com.safraplus.authservice.model.PropertyUserId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PropertyUserRepository extends JpaRepository<PropertyUser, PropertyUserId> {
}
