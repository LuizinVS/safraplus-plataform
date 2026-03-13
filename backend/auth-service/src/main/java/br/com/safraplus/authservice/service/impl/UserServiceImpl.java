package br.com.safraplus.authservice.service.impl;

import br.com.safraplus.authservice.exception.EmailAlreadyExistsException;
import br.com.safraplus.authservice.model.User;
import br.com.safraplus.authservice.repository.UserRepository;
import br.com.safraplus.authservice.service.NotificationEventPublisher;
import br.com.safraplus.authservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationEventPublisher notificationEventPublisher;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,
                           NotificationEventPublisher notificationEventPublisher) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.notificationEventPublisher = notificationEventPublisher;
    }

    @Override
    public User registerUser(User user) {
        // 1. Lógica de Negócio: Verificar se o email já existe no banco
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("O email '" + user.getEmail() + "' já está em uso.");
        }
        // 2. Lógica de Segurança: Criptografar a senha antes de salvar
        String hashedPassword = passwordEncoder.encode(user.getPasswordHash());
        user.setPasswordHash(hashedPassword);

        // 3. Persistência: Salvar o usuário no banco de dados usando o repository
        User savedUser = userRepository.save(user);
        notificationEventPublisher.publishNotificationEvent(savedUser.getEmail(),
                "Bem-vindo ao Safra+! Seu cadastro foi realizado com sucesso.", "USER_REGISTERED");
        return savedUser;
    }
}
