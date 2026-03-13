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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SafraServiceImplTest {

    @Mock
    private SafraRepository safraRepository;

    @Mock
    private PropertyRepository propertyRepository;

    @Mock
    private SafraEventPublisher safraEventPublisher;

    @Mock
    private PropertyService propertyService;

    @Mock
    private NotificationEventPublisher notificationEventPublisher;

    @InjectMocks
    private SafraServiceImpl safraService;

    private User userOwner;
    private User anotherUser;
    private Property property;
    private Safra safra;

    @BeforeEach
    void setUp(){
        userOwner = new User();
        userOwner.setId(1L);
        userOwner.setEmail("owner@test.com");

        anotherUser = new User();
        anotherUser.setId(2L);

        property = new Property();
        property.setId(99L);

        safra = new Safra();
        safra.setId(100L);
        safra.setName("Safra Antiga");
        safra.setProperty(property);
    }

    @Test
    @DisplayName("deleteSafra | deve lançar AcessDeniedException quando o usuário não é o dono")
    void deleteSafra_ShouldThrowException_WhenUserIsNotOwner(){
        when(safraRepository.findById(100L)).thenReturn(Optional.of(safra));
        doThrow(new AccessDeniedException("Test")).when(propertyService).verifyPropertyOwnership
                (99L, anotherUser);

        assertThrows(AccessDeniedException.class, () -> {
            safraService.deleteSafra(100L, anotherUser);
        });

        verify(safraRepository, never()).deleteById(anyLong());
    }

    @Test
    @DisplayName("deleteSafra | deve deletar a safra quando o usuário é o dono")
    void deleteSafra_ShouldDelete_WhenUserIsOwner(){
        when(safraRepository.findById(100L)).thenReturn(Optional.of(safra));
        doNothing().when(propertyService).verifyPropertyOwnership(99L, userOwner);
        doNothing().when(safraRepository).deleteById(100L);

        assertDoesNotThrow(() -> {
            safraService.deleteSafra(100L, userOwner);
        });

        verify(safraRepository, times(1)).deleteById(100L);
    }

    @Test
    @DisplayName("updateSafra | deve atualizar a safra quando o usuário é o dono")
    void updateSafra_ShouldUpdate_WhenUserIsOwner(){
        LocalDate dataInicio = LocalDate.parse("2025-11-15");
        LocalDate dataFim = LocalDate.parse("2026-04-20");
        SafraRequestDTO updateDTO = new SafraRequestDTO(
                "Soja de Verão 2025/26 (Atualizada)", "Soja", dataInicio, dataFim);

        when(safraRepository.findById(100L)).thenReturn(Optional.of(safra));
        doNothing().when(propertyService).verifyPropertyOwnership(99L, userOwner);
        when(safraRepository.save(any(Safra.class))).thenAnswer
                (invocation -> invocation.getArgument(0));

        Safra updatedSafra = safraService.updateSafra(100L, updateDTO, userOwner);

        assertNotNull(updatedSafra);
        assertEquals("Soja de Verão 2025/26 (Atualizada)", updatedSafra.getName());
        assertEquals(dataInicio, updatedSafra.getStartDate());

        verify(safraRepository, times(1)).save(safra);
    }

    @Test
    @DisplayName("updateSafra | deve lançar AccessDeniedException quando o usuário NÃO é o dono")
    void updateSafra_ShouldNotUpdate_WhenUserIsNotOwner(){
        SafraRequestDTO updateDTO = new SafraRequestDTO("Nome Invasor", "Tipo Invasor", null,
                null);
        when(safraRepository.findById(100L)).thenReturn(Optional.of(safra));
        doThrow(new AccessDeniedException("Test")).when(propertyService).verifyPropertyOwnership
                (99L, anotherUser);

        assertThrows(AccessDeniedException.class, () -> {
            safraService.updateSafra(100L, updateDTO, anotherUser);
        });

        verify(safraRepository, never()).save(any(Safra.class));
    }

    @Test
    @DisplayName("createSafra | deve salvar e retornar uma safra com os dados corretos")
    void createSafra_ShouldSaveAndReturnSafra(){
        LocalDate dataInicio = LocalDate.parse("2025-11-15");
        LocalDate dataFim = LocalDate.parse("2026-04-20");
        SafraRequestDTO requestDTO = new SafraRequestDTO(
                "Safra de Feijão", "Feijão", dataInicio, dataFim);

        doNothing().when(propertyService).verifyPropertyOwnership(99L, userOwner);
        when(propertyRepository.findById(99L)).thenReturn(Optional.of(property));

        ArgumentCaptor<Safra> safraCaptor = ArgumentCaptor.forClass(Safra.class);
        when(safraRepository.save(any(Safra.class))).thenAnswer(invocation -> {
            Safra s = invocation.getArgument(0);
            s.setId(101L);
            return s;
        });

        doNothing().when(safraEventPublisher).publishSafraCreatedEvent(any(Safra.class), anyString());
        doNothing().when(notificationEventPublisher).publishNotificationEvent(anyString(), anyString(), anyString());

        Safra savedSafra = safraService.createSafra(requestDTO, 99L, userOwner);

        verify(safraRepository, times(1)).save(safraCaptor.capture());
        Safra capturedSafra = safraCaptor.getValue();
        verify(safraEventPublisher, times(1)).publishSafraCreatedEvent(eq(savedSafra),
                eq(userOwner.getEmail()));
        verify(notificationEventPublisher, times(1)).publishNotificationEvent(
                eq(userOwner.getEmail()),
                eq("A safra 'Safra de Feijão' foi cadastrada na sua propriedade."),
                eq("SAFRA_CREATED")
        );

        assertNotNull(savedSafra);
        assertEquals(101L, savedSafra.getId());
        assertEquals("Safra de Feijão", capturedSafra.getName());
        assertEquals("Feijão", capturedSafra.getCropType());
        assertEquals(99L, capturedSafra.getProperty().getId());
    }
}
