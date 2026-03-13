package br.com.safraplus.capital_service.service.implementation;

import br.com.safraplus.capital_service.dto.SafraRequestDTO;
import br.com.safraplus.capital_service.model.Property;
import br.com.safraplus.capital_service.model.Safra;
import br.com.safraplus.capital_service.model.User;
import br.com.safraplus.capital_service.repository.PropertyRepository;
import br.com.safraplus.capital_service.repository.SafraRepository;
import br.com.safraplus.capital_service.service.NotificationEventPublisher;
import br.com.safraplus.capital_service.service.PropertyService;
import br.com.safraplus.capital_service.service.SafraEventPublisher;
import br.com.safraplus.capital_service.service.SafraService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;

@Service
public class SafraServiceImpl implements SafraService {

    private final SafraRepository safraRepository;
    private final PropertyRepository propertyRepository;
    private final SafraEventPublisher safraEventPublisher;
    private final NotificationEventPublisher notificationEventPublisher;
    private final PropertyService propertyService;

    public SafraServiceImpl(SafraRepository safraRepository, PropertyRepository propertyRepository,
                            SafraEventPublisher safraEventPublisher, NotificationEventPublisher
                                    notificationEventPublisher, PropertyService propertyService) {
        this.safraRepository = safraRepository;
        this.propertyRepository = propertyRepository;
        this.safraEventPublisher = safraEventPublisher;
        this.notificationEventPublisher = notificationEventPublisher;
        this.propertyService = propertyService;
    }

    @Override
    public Safra createSafra(SafraRequestDTO requestDTO, Long propertyId, User owner){

        propertyService.verifyPropertyOwnership(propertyId, owner);

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new EntityNotFoundException("Propriedade com o ID: "+ propertyId
                        + " não foi encontrada"));

        Safra newSafra = new Safra();
        newSafra.setName(requestDTO.name());
        newSafra.setCropType(requestDTO.cropType());
        newSafra.setStartDate(requestDTO.startDate());
        newSafra.setEndDate(requestDTO.endDate());
        newSafra.setProperty(property);

        Safra savedSafra = safraRepository.save(newSafra);
//        safraEventPublisher.publishSafraCreatedEvent(savedSafra, owner.getId());
//
//        String message = "A safra '" + savedSafra.getName() + "' foi cadastrada na sua propriedade.";
//        notificationEventPublisher.publishNotificationEvent(owner.getEmail(), message, "SAFRA_CREATED");

        return savedSafra;
    }

    @Override
    public List<Safra> findSafrasByProperty(Long propertyId, User owner){
        propertyService.verifyPropertyOwnership(propertyId, owner);
        return safraRepository.findByPropertyId(propertyId);
    }

    @Override
    public void verifySafraOwnership(Long safraId, User owner){
        Safra safra = safraRepository.findById(safraId)
                .orElseThrow(() -> new EntityNotFoundException("A safra com ID:" + safraId + " não foi encontrada"));

        propertyService.verifyPropertyOwnership(safra.getProperty().getId(), owner);
    }

    @Override
    public Safra updateSafra(Long safraId, SafraRequestDTO safraRequestDTO, User owner){
        verifySafraOwnership(safraId, owner);

        Safra existingSafra = safraRepository.findById(safraId)
                .orElseThrow(() -> new EntityNotFoundException("Safra com o ID:" + safraId + " não foi encontrada"));

        existingSafra.setName(safraRequestDTO.name());
        existingSafra.setCropType(safraRequestDTO.cropType());
        existingSafra.setStartDate(safraRequestDTO.startDate());
        existingSafra.setEndDate(safraRequestDTO.endDate());

        return safraRepository.save(existingSafra);
    }

    @Override
    public void deleteSafra(Long safraId, User owner){
        verifySafraOwnership(safraId, owner);

        safraRepository.deleteById(safraId);
    }

}
