package br.com.safraplus.capital_service.service;

import br.com.safraplus.capital_service.config.RabbitMQConfig;
import br.com.safraplus.capital_service.dto.SafraEventDTO;
import br.com.safraplus.capital_service.model.Safra;
import br.com.safraplus.capital_service.model.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SafraEventPublisher {
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    @Autowired
    public SafraEventPublisher(RabbitTemplate rabbitTemplate, ObjectMapper objectMapper) {
        this.rabbitTemplate = rabbitTemplate;
        this.objectMapper = objectMapper;
    }

    public void publishSafraCreatedEvent(Safra safra, String ownerEmail){
        try{
            SafraEventDTO eventDTO = new SafraEventDTO(
                    safra.getId(),
                    safra.getCropType(),
                    ownerEmail
            );
            String message = objectMapper.writeValueAsString(eventDTO);

            log.info("Publicando evento de safra criada: {}", message);
            rabbitTemplate.convertAndSend(RabbitMQConfig.SAFRA_CREATED_EXCHANGE_NAME, RabbitMQConfig.SAFRA_CREATED_ROUTING_KEY, message);
        } catch (Exception e) {
            log.error("Erro ao publicar o evento de safra criada para o ID: {}", safra.getId(), e);
        }
    }

    public void publishAnalysisRequestEvent(Safra safra, User owner) {
        try {
            SafraEventDTO eventDTO = new SafraEventDTO(
                    safra.getId(),
                    safra.getCropType(),
                    owner.getEmail()
            );
            String message = objectMapper.writeValueAsString(eventDTO);

            log.info("Publicando SOLICITAÇÃO DE ANÁLISE para a safra {}: {}", safra.getId(), message);
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.ANALYSIS_REQUEST_EXCHANGE_NAME,
                    RabbitMQConfig.ANALYSIS_REQUEST_ROUTING_KEY,
                    message
            );
        } catch (Exception e) {
            log.error("Erro ao publicar o evento de solicitação de análise para o ID: {}", safra.getId(), e);
        }
    }
}
