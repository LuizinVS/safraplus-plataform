# safraplus-plataform

# Padrões de Desenvolvimento e Contribuição

Para garantir a qualidade, estabilidade e organização do nosso código, seguimos um conjunto de regras para o versionamento com Git. Toda contribuição ao projeto deve, obrigatoriamente, seguir as diretrizes abaixo.

## 📜 Regra de Ouro: Proibido Push Direto

**É estritamente proibido fazer push direto nas branches `main` e `develop`.**

- A branch `main` representa o código em produção (stable).
- A branch `develop` representa a versão mais recente do desenvolvimento (unstable).

Essas branches são protegidas e todas as alterações devem ser integradas exclusivamente via **Pull Requests**.

## 🚀 Fluxo de Trabalho (Workflow)

Todo novo desenvolvimento, seja uma nova funcionalidade, correção de bug ou melhoria, deve ser feito em uma **feature branch**.

### Passo a Passo

1.  **Sincronize sua base:** Antes de começar, garanta que sua branch `develop` local está atualizada.
    ```bash
    git checkout develop
    git pull origin develop
    ```

2.  **Crie sua Feature Branch:** Crie uma nova branch a partir de `develop`. Use um nome descritivo e padronizado.

    **Padrão de Nomenclatura:** `tipo/escopo-descricao-curta`

    -   **`feature/`**: Para novas funcionalidades.
        -   *Exemplo:* `feature/backend-setup-ci`
        -   *Exemplo:* `feature/frontend-login-screen`
    -   **`fix/`**: Para correção de bugs.
        -   *Exemplo:* `fix/user-authentication-bug`
    -   **`chore/`**: Para tarefas de manutenção (updates de libs, ajustes de config, etc.).
        -   *Exemplo:* `chore/update-docker-dependencies`
    -   **`docs/`**: Para alterações na documentação.
        -   *Exemplo:* `docs/add-contribution-guide`

    **Comando para criar a branch:**
    ```bash
    git checkout -b feature/nome-da-sua-feature
    ```

3.  **Desenvolva e Faça Commits:** Trabalhe na sua branch. Faça commits pequenos, atômicos e com mensagens claras.

4.  **Envie sua Branch para o Repositório Remoto:**
    ```bash
    git push origin feature/nome-da-sua-feature
    ```

5.  **Abra um Pull Request (PR):**
    -   Acesse o repositório no GitHub/GitLab/Bitbucket.
    -   Abra um Pull Request da sua `feature/nome-da-sua-feature` para a branch `develop`.
    -   Preencha o template do PR, descrevendo o que foi feito, o motivo e como testar.
    -   Marque pelo menos um revisor (`reviewer`) do time.

6.  **Code Review:** Seu PR será revisado por outros membros da equipe. Fique atento aos comentários e faça os ajustes solicitados.

7.  **Merge:** Após a aprovação, o PR será "merged" na branch `develop`. Sua tarefa está concluída!

Obrigado por seguir este fluxo e ajudar a manter nosso projeto saudável e organizado! 👍
