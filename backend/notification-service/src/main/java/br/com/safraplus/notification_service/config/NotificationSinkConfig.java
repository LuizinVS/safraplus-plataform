package br.com.safraplus.notification_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

@Configuration
public class NotificationSinkConfig {

    @Bean
    public Sinks.Many<String> notificationSink(){
        return Sinks.many().multicast().onBackpressureBuffer();
    }

    @Bean
    public Flux<String> notificationFlux(Sinks.Many<String> sink) {
        return sink.asFlux();
    }
}
