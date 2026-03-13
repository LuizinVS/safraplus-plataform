package br.com.safraplus.authservice.service;


import br.com.safraplus.authservice.model.User;

public interface UserService {

    // Por enquanto, nosso serviço só precisa fazer uma coisa: registrar um usuário.
    // Ele receberá um objeto User e retornará o usuário que foi salvo no banco.
    User registerUser(User user);
}
