package br.com.safraplus.authservice.service;

import br.com.safraplus.authservice.dto.NotificationEventDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationEventPublisher {
    private static final String NOTIFICATION_EXCHANGE = "notification_exchange";
    private static final String NOTIFICATION_ROUTING_KEY = "notification.info";

    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    @Autowired
    public NotificationEventPublisher(RabbitTemplate rabbitTemplate, ObjectMapper objectMapper) {
        this.rabbitTemplate = rabbitTemplate;
        this.objectMapper = objectMapper;
    }

    public void publishNotificationEvent(String userEmail, String message, String type){
        try{
            var eventDTO = new NotificationEventDTO(userEmail, message, type);
            String messageJson = objectMapper.writeValueAsString(eventDTO);

            log.info("Publicando evento de notificação para o usuário {}: {}", userEmail, messageJson);
            rabbitTemplate.convertAndSend(NOTIFICATION_EXCHANGE, NOTIFICATION_ROUTING_KEY, messageJson);
        } catch (Exception e) {
             log.error("Erro ao publicar evento de notificação para o usuãrio {}", userEmail, e);
        }
    }
}
