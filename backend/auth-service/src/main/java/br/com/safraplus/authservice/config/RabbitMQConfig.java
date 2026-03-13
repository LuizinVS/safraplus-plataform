package br.com.safraplus.authservice.config;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    @Bean
    public TopicExchange notificationExchange(){
        return new TopicExchange("notification_exchange");
    }
}
