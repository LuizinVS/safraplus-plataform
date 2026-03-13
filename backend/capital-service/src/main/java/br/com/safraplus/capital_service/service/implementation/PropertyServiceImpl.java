package br.com.safraplus.capital_service.service.implementation;

import br.com.safraplus.capital_service.dto.PropertyRequestDTO;
import br.com.safraplus.capital_service.model.Property;
import br.com.safraplus.capital_service.model.PropertyUser;
import br.com.safraplus.capital_service.model.PropertyUserId;
import br.com.safraplus.capital_service.model.User;
import br.com.safraplus.capital_service.repository.PropertyRepository;
import br.com.safraplus.capital_service.repository.PropertyUserRepository;
import br.com.safraplus.capital_service.service.NotificationEventPublisher;
import br.com.safraplus.capital_service.service.PropertyService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepository propertyRepository;
    private final NotificationEventPublisher notificationEventPublisher;
    private final PropertyUserRepository propertyUserRepository;

    @Autowired
    public PropertyServiceImpl(PropertyRepository propertyRepository, NotificationEventPublisher
            notificationEventPublisher, PropertyUserRepository propertyUserRepository) {
        this.propertyRepository = propertyRepository;
        this.notificationEventPublisher = notificationEventPublisher;
        this.propertyUserRepository = propertyUserRepository;
    }

    @Override
    @Transactional
    public Property createProperty(PropertyRequestDTO propertyDTO, User owner){
        Property newProperty = new Property();

        newProperty.setPropertyName(propertyDTO.propertyName());
        newProperty.setLocation(propertyDTO.location());
        newProperty.setAreaInHectares(propertyDTO.areaInHectares());
        newProperty.setDescription(propertyDTO.description());
        newProperty.setMembers(Collections.emptyList());

        Property savedProperty = propertyRepository.save(newProperty);

        PropertyUserId propertyUserId = new PropertyUserId(savedProperty.getId(), owner.getId());

        PropertyUser association = new PropertyUser();
        association.setId(propertyUserId);
        association.setProperty(savedProperty);
        association.setUser(owner);
        association.setRole("OWNER");

        propertyUserRepository.save(association);

        String message = "Sua nova propriedade '" + savedProperty.getPropertyName() + "' foi criada com sucesso!";
        notificationEventPublisher.publishNotificationEvent(owner.getEmail(), message, "PROPERTY_CREATED");

        return savedProperty;
    }

    @Override
    public List<Property> findPropertiesByOwner(User owner){
        List<PropertyUser> associations = propertyUserRepository.findByIdUserId(owner.getId());

        return associations.stream()
                .map(PropertyUser::getProperty)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Property updateProperty(Long propertyId, PropertyRequestDTO propertyRequestDTO, User owner){
        verifyPropertyOwnership(propertyId, owner);

        Property existingProperty = propertyRepository.findById(propertyId)
                        .orElseThrow(() -> new EntityNotFoundException("Properiedade com o ID:"+ propertyId
                                +" não encontrada"));

        existingProperty.setPropertyName(propertyRequestDTO.propertyName());
        existingProperty.setLocation(propertyRequestDTO.location());
        existingProperty.setAreaInHectares(propertyRequestDTO.areaInHectares());
        existingProperty.setDescription(propertyRequestDTO.description());

        return propertyRepository.save(existingProperty);
    }

    @Override
    public void verifyPropertyOwnership(Long propertyId, User owner){
        boolean isMember = propertyUserRepository.existsById(new PropertyUserId(propertyId, owner.getId()));

        if (!isMember) {
            throw new AccessDeniedException("Você não tem permissão para acessar esta propriedade.");
        }
    }

    @Override
    @Transactional
    public void deleteProperty(Long propertyId, User owner){
        verifyPropertyOwnership(propertyId, owner);

        if (!propertyRepository.existsById(propertyId)) {
            throw new EntityNotFoundException("Propriedade não encontrada com o ID: " + propertyId);
        }

        propertyRepository.deleteById(propertyId);
    }
}
