package br.com.safraplus.capital_service.service;

import br.com.safraplus.capital_service.model.User;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    public String generateToken(User user) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer("safraplus-auth-api")
                    .withSubject(user.getEmail())
                    .withExpiresAt(generateExpirationDate())
                    .sign(algorithm);
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Erro ao gerar o token JWT.", exception);
        }
    }

    public String validateToken(String token) {
        try {
            // 1. Pega o mesmo segredo e algoritmo que usamos para criar o token.
            Algorithm algorithm = Algorithm.HMAC256(secret);

            // 2. Cria um objeto "verificador" com as regras que esperamos.
            JWTVerifier verifier = JWT.require(algorithm)
                    .withIssuer("safraplus-auth-api") // O token DEVE ter sido emitido por nós.
                    .build();

            // 3. Tenta verificar o token. Se estiver expirado, inválido ou com a assinatura errada,
            // esta linha vai lançar uma exceção (JWTVerificationException).
            DecodedJWT decodedJWT = verifier.verify(token);

            // 4. Se a verificação passou, retorna o "subject" (o email do usuário).
            return decodedJWT.getSubject();

        } catch (JWTVerificationException exception) {
            // 5. Se a verificação falhou, retorna uma string vazia, sinalizando um token inválido.
            return "";
        }
    }

    private Instant generateExpirationDate() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
