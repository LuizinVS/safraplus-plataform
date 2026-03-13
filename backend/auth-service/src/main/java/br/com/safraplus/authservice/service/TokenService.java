package br.com.safraplus.authservice.service;

import br.com.safraplus.authservice.model.User;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    // Esta anotação injeta o valor da propriedade do nosso application.properties
    @Value("${api.security.token.secret}")
    private String secret;

    public String generateToken(User user) {
        try {
            // Define o algoritmo de assinatura usando nosso segredo
            Algorithm algorithm = Algorithm.HMAC256(secret);

            String token = JWT.create()
                    .withIssuer("safraplus-auth-api") // Emissor do token
                    .withSubject(user.getEmail()) // O "dono" do token (geralmente o email/login)
                    .withExpiresAt(generateExpirationDate()) // Data de expiração
                    .sign(algorithm); // Assina o token
            return token;
        } catch (JWTCreationException exception){
            throw new RuntimeException("Erro ao gerar o token JWT.", exception);
        }
    }

    // Método para definir a expiração do token (ex: 2 horas a partir de agora)
    private Instant generateExpirationDate() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
