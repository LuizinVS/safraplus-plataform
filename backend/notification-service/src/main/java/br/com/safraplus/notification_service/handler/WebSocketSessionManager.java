package br.com.safraplus.notification_service.handler;

import org.springframework.stereotype.Component;
import reactor.core.publisher.Sinks;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketSessionManager {
    private final Map<String, Sinks.Many<String>> userSinks = new ConcurrentHashMap<>();

    public void addSession(String userId, Sinks.Many<String> sink){
        userSinks.put(userId, sink);
    }

    public void removeSession(String userId) {
        userSinks.remove(userId);
    }

    public void sendMessageToUser(String userId, String message) {
        Sinks.Many<String> sink = userSinks.get(userId);
        if (sink != null) {
            sink.tryEmitNext(message);
        }
    }
}
