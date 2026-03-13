# Safra Plus | Inteligencia de Dados e Decisao Agricola

## 1. Proposito do Sistema
O Safra Plus e uma plataforma de suporte a decisao estrategica voltada ao agronegocio. O sistema integra dados economicos com variaveis agricolas para mitigar o risco financeiro do pequeno e medio produtor rural.

* Problema: Incerteza sobre o custo de oportunidade (Plantio vs. Renda Fixa/Selic).
* Publico-alvo: Pequenos agricultores e cooperativas.
* Visao Geral: A plataforma processa modelos de recomendacao para comparar lucros estimados de safras contra rendimentos financeiros conservadores.

## 2. Arquitetura do Sistema
O projeto utiliza uma arquitetura de sistemas distribuidos, priorizando o desacoplamento entre a coleta de dados e a regra de negocio core.

### Fluxo de Comunicacao
1. Frontend (React) consome a API REST do Core Backend (Spring Boot).
2. O Backend delega processamentos intensivos e web scraping para o servico Python via RabbitMQ.
3. O servico Python processa os algoritmos e devolve os resultados para persistencia em banco de dados SQL.

### Diagrama Arquitetural
[ Usuario ] -> [ Frontend React ] -> [ Backend Spring Boot ]
                                            |
                                     [ Message Broker RabbitMQ ]
                                            |
                                     [ Service Python / Scraper ] -> [ Database SQL ]

## 3. Tecnologias Utilizadas

### Frontend
* Framework: React.js
* Gerenciador de Pacotes: NPM/Yarn
* Comunicacao: Axios para integracao com API REST

### Backend Core
* Linguagem: Java 17+
* Framework: Spring Boot 3.x
* Mensageria: RabbitMQ (AMQP Protocol)
* Gerenciamento de Dependencias: Maven

### Intelligence Service
* Linguagem: Python 3.10+
* Bibliotecas: Scrapy / Pandas para analise de dados e scraping de indices financeiros

### Infraestrutura
* Containerizacao: Docker
* Orquestracao: Docker Compose
* Banco de Dados: PostgreSQL / MySQL

## 4. Estrutura de Diretorios

* /backend: Servico principal responsavel pelas regras de negocio e API.
* /frontend: Interface de usuario e dashboards analiticos.
* /scraper-api: Motor de calculo financeiro e coleta de dados externos em Python.
* /docker: Arquivos de configuracao de ambiente e redes.

## 5. Como Rodar o Projeto Localmente

### Pre-requisitos
* Docker e Docker Compose instalados.

### Execucao via Docker (Recomendado)
1. Clone o repositorio.
2. Na raiz do projeto, execute:
   docker-compose up --build
3. Acesse a aplicacao em http://localhost:3000.

### Execucao Manual (Modo Desenvolvimento)
* Backend: Executar via Maven (./mvnw spring-boot:run) na porta 8080.
* Frontend: Executar via npm install && npm start na porta 3000.
* Scraper: Executar script python com as dependencias do requirements.txt instaladas.

## 6. Fluxo de Desenvolvimento (Git Workflow)
O projeto segue o modelo GitFlow simplificado:
* main: Codigo estavel em producao.
* develop: Branch de integracao de funcionalidades.
* feature/*: Branches para novas implementacoes.

## 7. Endpoints Principais (Exemplos)
* POST /api/v1/auth/login: Autenticacao.
* GET /api/v1/recommendations: Retorna o comparativo entre plantio e Selic.
* POST /api/v1/safra: Registro de novos dados agricolas.
