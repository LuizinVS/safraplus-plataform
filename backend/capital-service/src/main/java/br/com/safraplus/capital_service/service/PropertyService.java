package br.com.safraplus.capital_service.service;

import br.com.safraplus.capital_service.dto.PropertyRequestDTO;
import br.com.safraplus.capital_service.model.Property;
import br.com.safraplus.capital_service.model.User;

import java.util.List;

public interface PropertyService {
    Property createProperty(PropertyRequestDTO propertyDTO, User owner);

    List<Property> findPropertiesByOwner(User owner);

    Property updateProperty(Long propertyId, PropertyRequestDTO propertyRequestDTO, User owner);

    void deleteProperty(Long propertyId, User owner);

    void verifyPropertyOwnership(Long propertyId, User owner);
}
