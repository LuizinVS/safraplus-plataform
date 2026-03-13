package br.com.safraplus.capital_service.service.implementation;

import br.com.safraplus.capital_service.dto.PropertyRequestDTO;
import br.com.safraplus.capital_service.model.Property;
import br.com.safraplus.capital_service.model.PropertyUser;
import br.com.safraplus.capital_service.model.PropertyUserId;
import br.com.safraplus.capital_service.model.User;
import br.com.safraplus.capital_service.repository.PropertyRepository;
import br.com.safraplus.capital_service.repository.PropertyUserRepository;
import br.com.safraplus.capital_service.service.NotificationEventPublisher;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PropertyServiceImplTest {

    @Mock
    private PropertyRepository propertyRepository;
    @Mock
    private PropertyUserRepository propertyUserRepository;
    @Mock
    private NotificationEventPublisher notificationPublisher;

    @InjectMocks
    private PropertyServiceImpl propertyService;

    private User userOwner;
    private User anotherUser;
    private Property property;
    private PropertyUserId ownerAssociationId;

    @BeforeEach
    void setUp(){
        userOwner = new User();
        userOwner.setId(1L);
        userOwner.setEmail("owner@test.com");

        anotherUser = new User();
        anotherUser.setId(2L);

        property = new Property();
        property.setId(100L);

        ownerAssociationId = new PropertyUserId(100L, 1L);
    }


    @Test
    @DisplayName("deleteProperty | Deve deletar a propriedade quando o usuário é o dono")
    void deleteProperty_ShouldDelete_WhenUserIsOwner() {
        when(propertyUserRepository.existsById(ownerAssociationId)).thenReturn(true);

        when(propertyRepository.existsById(100L)).thenReturn(true);

        doNothing().when(propertyRepository).deleteById(100L);

        assertDoesNotThrow(() -> {
            propertyService.deleteProperty(100L, userOwner);
        });

        verify(propertyRepository, times(1)).deleteById(100L);
    }

    @Test
    @DisplayName("deleteProperty | Deve lançar AccessDeniedException quando o usuário NÃO é o dono")
    void deleteProperty_ShouldThrowException_WhenUserIsNotOwner() {
        PropertyUserId intruderAssociationId = new PropertyUserId(100L, 2L);
        when(propertyUserRepository.existsById(intruderAssociationId)).thenReturn(false);

        assertThrows(AccessDeniedException.class, () -> {
            propertyService.deleteProperty(100L, anotherUser);
        });

        verify(propertyRepository, never()).deleteById(anyLong());
    }

    @Test
    @DisplayName("deleteProperty | Deve lançar EntityNotFoundException se a propriedade " +
            "não existir (independente do existsById)")
    void deleteProperty_ShouldThrowException_WhenPropertyNotFound() {
        when(propertyUserRepository.existsById(new PropertyUserId(999L, userOwner.getId())))
                .thenReturn(true);

        when(propertyRepository.existsById(999L)).thenReturn(false);

        assertThrows(EntityNotFoundException.class, () -> {
            propertyService.deleteProperty(999L, userOwner);
        });

        verify(propertyRepository, never()).deleteById(anyLong());
    }

    @Test
    @DisplayName("createProperty | Deve salvar property e propertyUser com os dados corretos")
    void createProperty_ShouldSaveAndReturnProperty() {

        PropertyRequestDTO requestDTO = new PropertyRequestDTO("Fazenda Nova Esperança",
                "Goiânia, GO", 200, "Minha fazenda de soja");
        ArgumentCaptor<Property> propertyCaptor = ArgumentCaptor.forClass(Property.class);
        ArgumentCaptor<PropertyUser> propertyUserCaptor = ArgumentCaptor.forClass(PropertyUser.class);

        when(propertyRepository.save(any(Property.class))).thenAnswer(invocation -> {
            Property p = invocation.getArgument(0);
            p.setId(101L);
            return p;
        });

        when(propertyUserRepository.save(any(PropertyUser.class))).thenReturn(null);

        Property savedProperty = propertyService.createProperty(requestDTO, userOwner);


        verify(propertyRepository, times(1)).save(propertyCaptor.capture());
        verify(propertyUserRepository, times(1)).save(propertyUserCaptor.capture());

        Property capturedProperty = propertyCaptor.getValue();
        PropertyUser capturedAssociation = propertyUserCaptor.getValue();

        assertNotNull(savedProperty);
        assertEquals(101L, savedProperty.getId()); // Verifica o ID simulado
        assertEquals("Fazenda Nova Esperança", capturedProperty.getPropertyName());
        assertEquals("Goiânia, GO", capturedProperty.getLocation());
        assertEquals(200, capturedProperty.getAreaInHectares());
        assertEquals("Minha fazenda de soja", capturedProperty.getDescription());

        assertNotNull(capturedAssociation);
        assertEquals(101L, capturedAssociation.getId().getPropertyId());
        assertEquals(1L, capturedAssociation.getId().getUserId());
        assertEquals("OWNER", capturedAssociation.getRole());

        verify(notificationPublisher, times(1)).publishNotificationEvent(
                eq(userOwner.getEmail()), anyString(), eq("PROPERTY_CREATED"));
    }

    @Test
    @DisplayName("updateProperty | Deve atualizar a propriedade quando o usuário é o dono")
    void updateProperty_ShouldUpdate_WhenUserIsOwner() {

        PropertyRequestDTO updateDTO = new PropertyRequestDTO("Fazenda Rio das Pedras (Atualizada)",
                "Cristalina, GO", 150, "Descricao atualizada");

        when(propertyUserRepository.existsById(ownerAssociationId)).thenReturn(true);
        when(propertyRepository.findById(100L)).thenReturn(Optional.of(property));
        when(propertyRepository.save(any(Property.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Property updatedProperty = propertyService.updateProperty(100L, updateDTO, userOwner);

        assertNotNull(updatedProperty);
        assertEquals("Fazenda Rio das Pedras (Atualizada)", updatedProperty.getPropertyName());
        assertEquals(150, updatedProperty.getAreaInHectares());


        verify(propertyRepository, times(1)).save(property);
    }

    @Test
    @DisplayName("updateProperty | Deve lançar AccessDeniedException quando o usuário NÃO é o dono")
    void updateProperty_ShouldThrowException_WhenUserIsNotOwner() {

        PropertyRequestDTO updateDTO = new PropertyRequestDTO("Nome Invasor", "Local Invasor", 50, "Invasor");
        PropertyUserId intruderAssociationId = new PropertyUserId(100L, 2L);

        when(propertyUserRepository.existsById(intruderAssociationId)).thenReturn(false);

        assertThrows(AccessDeniedException.class, () -> {
            propertyService.updateProperty(100L, updateDTO, anotherUser);
        });

        verify(propertyRepository, never()).findById(anyLong());
        verify(propertyRepository, never()).save(any(Property.class));
    }
}
