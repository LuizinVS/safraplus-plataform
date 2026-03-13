package br.com.safraplus.notification_service.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import br.com.safraplus.notification_service.dto.NotificationEventDTO;
import br.com.safraplus.notification_service.handler.WebSocketSessionManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class NotificationListener {
    private final WebSocketSessionManager sessionManager;
    private final ObjectMapper objectMapper;

    public NotificationListener(WebSocketSessionManager sessionManager, ObjectMapper objectMapper) {
        this.sessionManager = sessionManager;
        this.objectMapper = objectMapper;
    }

    @RabbitListener(queues = "notification_events_queue")
    public void onNotificationReceived(String message) {
        try {
            log.info("Mensagem recebida do RabbitMQ: {}", message);
            NotificationEventDTO event = objectMapper.readValue(message, NotificationEventDTO.class);

            sessionManager.sendMessageToUser(event.userEmail(), event.message());
        } catch (Exception e) {
            log.error("Erro ao processar mensagem de notificação", e);
        }
    }
}
