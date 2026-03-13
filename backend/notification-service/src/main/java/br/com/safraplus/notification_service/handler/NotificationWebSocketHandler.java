package br.com.safraplus.notification_service.handler;

import br.com.safraplus.notification_service.service.TokenService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;

@Component
@Slf4j
public class NotificationWebSocketHandler implements WebSocketHandler {

    private final TokenService tokenService;
    private final WebSocketSessionManager webSocketSessionManager;

    public NotificationWebSocketHandler(TokenService tokenService,
                                        WebSocketSessionManager webSocketSessionManager) {
        this.tokenService = tokenService;
        this.webSocketSessionManager = webSocketSessionManager;
    }

    @Override
    public Mono<Void> handle(WebSocketSession session){
        String token = UriComponentsBuilder.fromUri(session.getHandshakeInfo().getUri())
                .build().getQueryParams().getFirst("token");

        String userEmail = tokenService.validateToken(token);

        if(userEmail.isEmpty()){
            log.warn("Tentativa de conexão WebSocket com token inválido. Fechando sessão.");
            return session.close();
        }

        String userId = userEmail;

        log.info("Sessão WebSocket autenticada para o usuário {}: {}", userId, session.getId());

        Sinks.Many<String> sink = Sinks.many().unicast().onBackpressureBuffer();
        webSocketSessionManager.addSession(userId, sink);

        return session.send(sink.asFlux().map(session::textMessage))
                .doOnTerminate(() -> {
                    log.info("Sessão WebSocket encerrada para o usuário: {}: {}", userId, session.getId());
                    webSocketSessionManager.removeSession(userId);
                });
    }
}
