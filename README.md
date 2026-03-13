# 🌾 Safra Plus  
### Plataforma Inteligente de Análise Financeira para Decisão Agrícola

O **Safra Plus** é uma plataforma de suporte à decisão estratégica voltada ao agronegócio, que integra **dados econômicos em tempo real**, análise financeira e projeções agrícolas para auxiliar produtores na tomada de decisões sobre **alocação de capital e viabilidade de safra**.

O sistema compara o **retorno estimado da produção agrícola** com indicadores financeiros como a **Taxa Selic**, reduzindo o risco econômico para pequenos e médios produtores.

---

## 🚀 Visão Geral da Solução

O projeto foi desenvolvido utilizando uma arquitetura **distribuída e orientada a eventos**, garantindo:

- Escalabilidade horizontal  
- Desacoplamento entre serviços  
- Processamento assíncrono de tarefas pesadas  
- Facilidade de deploy em ambientes cloud  

A plataforma é composta por:

- Frontend analítico em **React**
- Backend principal em **Spring Boot**
- Serviço de inteligência financeira em **Python**
- Mensageria via **RabbitMQ**
- Persistência em **Banco Relacional**
- Infraestrutura containerizada com **Docker**

---

## 🧠 Arquitetura do Sistema

### 📊 Fluxo Macro

1. O usuário interage com o **Frontend (SPA)**  
2. O Frontend consome a **API Core (Spring Boot)**  
3. O Backend envia tarefas intensivas para o **Worker Python**  
4. O Worker processa scraping e cálculos financeiros  
5. Os resultados são persistidos no banco  
6. O Backend retorna análises consolidadas ao usuário  

### 📐 Diagrama Arquitetural

  Usuário
       │
       ▼
 ┌───────────┐
 │ Frontend  │
 │  React    │
 └─────┬─────┘
       │ HTTP
       ▼
 ┌──────────────┐
 │ Core Backend │
 │ Spring Boot  │
 └─────┬────────┘
       │ AMQP
       ▼
 ┌──────────────┐
 │ Python Worker│
 │ Scraper + IA │
 └─────┬────────┘
       │
       ▼
    Database

    ---

## 🛠️ Tecnologias Utilizadas

### 🎨 Frontend
- React 18  
- JavaScript ES6+  
- Hooks e Context API  
- Axios  

### ⚙️ Backend
- Java 17  
- Spring Boot 3  
- Spring Security  
- JPA / Hibernate  
- Maven  

### 🧠 Inteligência de Dados
- Python 3.10+  
- Scrapy / Requests  
- Modelos de cálculo financeiro  

### 📡 Mensageria
- RabbitMQ (AMQP)

### 🗄️ Banco de Dados
- PostgreSQL ou MySQL  

### 🐳 Infraestrutura
- Docker  
- Docker Compose  

---

## 📂 Estrutura do Projeto

safraplus-platform/
│
├── backend/ → API principal (regras de negócio)
├── frontend/ → Interface web analítica
├── scraper-api/ → Worker Python e coleta de dados financeiros
├── docker/ → Configurações de containers
├── docs/ → Documentação complementar
└── docker-compose.yml → Orquestração completa do ambiente


---

## ⚙️ Como Executar o Projeto

### ✅ Pré-requisitos

- Docker + Docker Compose  
- Git  
- (Opcional) Java 17  
- (Opcional) Node 18  

### ▶️ Execução Completa (Recomendado)

```bash
git clone https://github.com/LuizinVS/safraplus-platform.git
cd safraplus-platform

docker-compose up --build

Variáveis de Ambiente

O projeto utiliza .env para configuração.

Exemplo:

DB_PASSWORD=guest
RABBITMQ_URL=amqp://rabbitmq:5672
FINANCE_API_KEY=your_key_here

📡 Endpoints Principais
Método	Endpoint	Descrição
POST	/api/v1/auth/login	Autenticação
GET	/api/v1/recommendations	Análise Safra vs Selic
POST	/api/v1/safra	Cadastro de produção
🧪 Testes
Backend
./mvnw test

Frontend
npm test

🚀 Estratégia de Deploy

O sistema foi projetado para deploy em ambientes cloud modernos:

AWS ECS

Kubernetes

Docker Swarm

Pipeline recomendado:

Build automático com GitHub Actions

Push de imagens para Docker Hub

Deploy automatizado

🔄 Fluxo de Desenvolvimento

Modelo baseado em GitFlow simplificado:

main → produção

develop → integração

feature/* → novas funcionalidades

Pull Requests devem passar por code review antes do merge.

🤝 Contribuição

Fork o projeto

Crie uma branch

git checkout -b feature/nova-feature


Commit

git commit -m "feat: descrição"


Push

git push origin feature/nova-feature


Abra um Pull Request

📄 Licença

Distribuído sob licença MIT.
