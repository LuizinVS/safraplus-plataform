package br.com.safraplus.authservice.controller;

import br.com.safraplus.authservice.dto.LoginRequestDTO;
import br.com.safraplus.authservice.dto.LoginResponseDTO;
import br.com.safraplus.authservice.dto.RegisterUserRequestDTO;
import br.com.safraplus.authservice.dto.UserResponseDTO;
import br.com.safraplus.authservice.model.User;
import br.com.safraplus.authservice.service.TokenService;
import br.com.safraplus.authservice.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    @Autowired
    public AuthController(UserService userService, AuthenticationManager authenticationManager,
                          TokenService tokenService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }


    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(@Valid @RequestBody RegisterUserRequestDTO requestDTO) {
        User newUser = new User();
        newUser.setName(requestDTO.name());
        newUser.setEmail(requestDTO.email());
        newUser.setPasswordHash(requestDTO.password());

        User savedUser = userService.registerUser(newUser);

        UserResponseDTO responseDTO = new UserResponseDTO(savedUser.getId(), savedUser.getName(), savedUser.getEmail());

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid LoginRequestDTO data) {
        // 1. Cria um token de autenticação com email e senha (ainda não validado)
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());

        // 2. Valida as credenciais. Se estiverem erradas, o Spring lança uma exceção (retornando 403)
        var auth = this.authenticationManager.authenticate(usernamePassword);

        // 3. Se a autenticação deu certo, pega o objeto User que o Spring Security encontrou
        var user = (User) auth.getPrincipal();

        // 4. Gera o token JWT para este usuário
        var token = tokenService.generateToken(user);

        // 5. Retorna o token em um DTO
        return ResponseEntity.ok(new LoginResponseDTO(token));
    }
}
