package br.com.safraplus.notification_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                // 1. Desabilita o CSRF
                .csrf(ServerHttpSecurity.CsrfSpec::disable)

                // 2. Desabilita a autenticação básica
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)

                // 3. Configura as regras de autorização
                .authorizeExchange(exchange -> exchange
                        // Permite acesso público e irrestrito ao nosso endpoint de WebSocket
                        .pathMatchers("/ws/notifications").permitAll()

                        // Exige autenticação para qualquer outra requisição
                        .anyExchange().authenticated()
                )
                .build();
    }
}
