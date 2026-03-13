package br.com.safraplus.capital_service.security;

import br.com.safraplus.capital_service.repository.UserRepository;
import br.com.safraplus.capital_service.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // 1. Tenta recuperar o token do cabeçalho da requisição
        var token = this.recoverToken(request);

        if (token != null) {
            // 2. Valida o token e extrai o email (subject)
            var email = tokenService.validateToken(token);
            UserDetails user = userRepository.findByEmail(email).orElse(null);

            if (user != null) {
                // 3. Se o token for válido e o usuário existir, nós o autenticamos para esta requisição
                var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        // O token vem no formato "Bearer eyJhbGciOiJ..."
        return authHeader.replace("Bearer ", "");
    }
}
