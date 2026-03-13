# Safra Plus 🌾 | Inteligência de Dados e Decisão Agrícola

![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-Messaging-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)

O **Safra Plus** é uma plataforma de suporte à decisão estratégica voltada ao agronegócio. O sistema integra dados econômicos em tempo real com variáveis agrícolas para mitigar o risco financeiro do pequeno e médio produtor rural.

## 1️⃣ Propósito do Sistema
O setor agrícola enfrenta constantes dilemas de alocação de capital. O Safra Plus resolve o problema da **incerteza sobre o custo de oportunidade**. 

* **Problema:** O agricultor muitas vezes não sabe se o retorno esperado de uma safra superará o rendimento de investimentos conservadores (como a Taxa Selic) no mesmo período.
* **Público-alvo:** Pequenos agricultores, cooperativas e gestores de agrotechs.
* **Visão Geral:** A plataforma coleta dados financeiros, processa modelos de recomendação em Python e entrega uma interface analítica para comparação de lucros estimados vs. rendimentos financeiros.

---

## 2️⃣ 🧠 Arquitetura do Sistema
O projeto adota uma arquitetura de **Sistemas Distribuídos** organizada em um Monorepo, utilizando comunicação assíncrona para garantir desacoplamento e resiliência.

### Fluxo de Comunicação
1.  O **Frontend (React)** solicita análises ao **Core Backend (Spring Boot)**.
2.  O Backend delega cálculos complexos e coleta de dados (Scraping) para o **Scraper/Service Python** via **RabbitMQ**.
3.  O serviço Python processa os algoritmos financeiros e devolve os resultados para persistência em **SQL**.

### Diagrama Arquitetural (ASCII)
```text
       [ Usuário ]
            │
      ┌─────▼─────┐      HTTP/REST      ┌──────────────┐
      │  Frontend │◄───────────────────►│ Core Backend │
      │  (React)  │                     │ (Spring Boot)│
      └───────────┘                     └──────┬───────┘
                                               │
      ┌───────────┐         AMQP               │         ┌──────────┐
      │ Scraper / │◄───────────────────────────┘         │ Database │
      │ Python API│─────────────────────────────────────►│  (SQL)   │
      └───────────┘                                      └──────────┘
3️⃣ 🛠️ Tecnologias UtilizadasCamadaTecnologiaPapel PrincipalFrontendReact.jsInterface SPA, Hooks e Consumo de APIs.Backend CoreJava / Spring BootRegras de negócio, segurança e orquestração.IntelligencePython / ScrapyWeb Scraping e modelos de cálculo financeiro.MensageriaRabbitMQDesacoplamento de tarefas intensivas (background jobs).DatabasePostgreSQL / MySQLPersistência de dados relacionais e histórico.Infra/DevOpsDocker / ComposePadronização do ambiente e isolamento.4️⃣ 📂 Estrutura de Pastas/backend: API Principal em Spring Boot. Responsável pelo CRUD e gestão de usuários./frontend: Aplicação Web em React. Contém componentes reutilizáveis e Dashboards./scraper-api: Serviço Python especializado em processamento de dados e integração Selic./docker: Arquivos de configuração específicos para infraestrutura (Network, Volumes).docker-compose.yml: Orquestrador oficial de todos os serviços da plataforma.5️⃣ ⚙️ Como Rodar LocalmentePré-requisitosDocker (v20.10+) e Docker Compose instalado.Java 17 (caso deseje rodar o backend fora do container).Node.js 18+ (caso deseje rodar o frontend fora do container).Execução Rápida (Recomendado)Para subir o ecossistema completo com um único comando:Clone o repositório:Bashgit clone [https://github.com/seu-usuario/safraplus-platform.git](https://github.com/seu-usuario/safraplus-platform.git)
cd safraplus-platform
Inicie os containers:Bashdocker-compose up --build
Validação:Frontend: http://localhost:3000Backend API: http://localhost:8080/swagger-ui.htmlRabbitMQ Management: http://localhost:156726️⃣ 🔐 Configuração de AmbienteAs variáveis de ambiente são gerenciadas via arquivo .env. Certifique-se de configurar:VariávelValor PadrãoDescriçãoDB_PASSWORDguestSenha do banco de dados.RABBITMQ_URLamqp://rabbitmq:5672Endpoint da fila.FINANCE_API_KEYhiddenChave para coleta de dados financeiros externos.7️⃣ 🔄 Fluxo de DesenvolvimentoSeguimos o padrão GitFlow adaptado para agilidade:main: Código estável pronto para produção.develop: Integração de novas funcionalidades.feature/escopo-descricao: Branches temporárias para desenvolvimento.Regra: Pull Requests devem passar por Code Review antes do merge em develop.8️⃣ 📡 Endpoints Principais (Exemplos)MétodoEndpointFuncionalidadePOST/api/v1/auth/loginAutenticação de usuário.GET/api/v1/recommendationsRetorna análise Plantio vs Selic.POST/api/v1/safraCadastra novos dados de colheita.9️⃣ 🧪 TestesUnitários: JUnit 5 para Backend e Jest para Frontend.Execução:Bash# Backend
./mvnw test
# Frontend
npm test
🔟 🚀 DeployA estratégia recomendada é baseada em Containers. O projeto está pronto para ser orquestrado em AWS ECS ou Kubernetes.CI/CD: Recomenda-se GitHub Actions para build das imagens e push para o Docker Hub.🤝 ContribuiçãoFaça um Fork do projeto.Crie uma Branch (git checkout -b feature/MinhaFeature).Commit suas mudanças (git commit -m 'Add: nova funcionalidade').Push para a Branch (git push origin feature/MinhaFeature).Abra um Pull Request.📄 LicençaDistribuído sob a licença MIT. Veja LICENSE para mais informações.Contato: [Seu Nome] - [Seu E-mail/LinkedIn]
### Por que este README é eficaz para a Senior?
1.  **Destaque da Selic:** Ao explicar o negócio logo no começo, você mostra que não é apenas um "codificador", mas alguém que entende o impacto econômico do software.
2.  **Diagrama ASCII:** Mostra senioridade ao documentar a arquitetura antes de falar de código.
3.  **RabbitMQ & Docker:** Estão em destaque, provando que você domina as ferramentas que eles usam.
4.  **Organização:** O uso de tabelas e seções numeradas facilita a vida do revisor técnico.

**Posso te ajudar com o texto da Bio do seu perfil ou com algum ajuste fino nas s
