package br.com.safraplus.capital_service.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    public static final String SAFRA_CREATED_EXCHANGE_NAME = "safra_events_exchange";
    public static final String SAFRA_CREATED_QUEUE_NAME = "safra_created_queue";
    public static final String SAFRA_CREATED_ROUTING_KEY = "safra.created";

    public static final String ANALYSIS_REQUEST_EXCHANGE_NAME = "analysis_request_exchange";
    public static final String ANALYSIS_REQUEST_QUEUE_NAME = "analysis_request_queue";
    public static final String ANALYSIS_REQUEST_ROUTING_KEY = "analysis.request";

    public static final String NOTIFICATION_EXCHANGE = "notification_exchange";

    @Bean
    public Queue safraCreatedQueue() {
        return new Queue(SAFRA_CREATED_QUEUE_NAME, true);
    }

    @Bean
    public TopicExchange safraCreatedExchange() {
        return new TopicExchange(SAFRA_CREATED_EXCHANGE_NAME);
    }

    @Bean
    public Binding safraCreatedBinding(Queue safraCreatedQueue, TopicExchange safraCreatedExchange) {
        return BindingBuilder.bind(safraCreatedQueue).to(safraCreatedExchange).with(SAFRA_CREATED_ROUTING_KEY);
    }

    @Bean
    public Queue analysisRequestQueue() {
        return new Queue(ANALYSIS_REQUEST_QUEUE_NAME, true);
    }

    @Bean
    public TopicExchange analysisRequestExchange() {
        return new TopicExchange(ANALYSIS_REQUEST_EXCHANGE_NAME);
    }

    @Bean
    public Binding analysisRequestBinding(Queue analysisRequestQueue, TopicExchange analysisRequestExchange) {
        return BindingBuilder.bind(analysisRequestQueue).to(analysisRequestExchange).with(ANALYSIS_REQUEST_ROUTING_KEY);
    }

    @Bean
    public TopicExchange notificationExchange() {
        return new TopicExchange(NOTIFICATION_EXCHANGE);
    }
}