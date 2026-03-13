package br.com.safraplus.capital_service.service;

import br.com.safraplus.capital_service.dto.SafraRequestDTO;
import br.com.safraplus.capital_service.model.Safra;
import br.com.safraplus.capital_service.model.User;

import java.util.List;

public interface SafraService {

    Safra createSafra(SafraRequestDTO requestDTO, Long propertyId, User owner);

    List<Safra> findSafrasByProperty(Long propertyId, User owner);

    void verifySafraOwnership(Long safraId, User owner);

    Safra updateSafra(Long safraId, SafraRequestDTO safraRequestDTO, User owner);

    void deleteSafra(Long safraId, User owner);
}
