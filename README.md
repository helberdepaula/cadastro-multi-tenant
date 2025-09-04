# Sistema de Avaliação - Docker Setup

Este projeto utiliza Docker Compose para facilitar a execução da aplicação completa com todas as suas dependências.

## Pré-requisitos

- Docker
- Docker Compose

## Estrutura dos Serviços

- **Database**: PostgreSQL 15
- **Backend**: NestJS (API REST)
- **Frontend**: Next.js

## Como executar

### 1. Clone o repositório e navegue até a pasta

```bash
cd avalidacao
```

### 2. Execute com Docker Compose

```bash
# Construir e executar todos os serviços
docker-compose up --build

# Executar em background
docker-compose up -d --build
```

### 4. Acessar a aplicação

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Database**: localhost:5432

## Comandos úteis

```bash
# Parar todos os serviços
docker-compose down

# Parar e remover volumes (dados do banco)
docker-compose down -v

# Ver logs de um serviço específico
docker-compose logs backend
docker-compose logs frontend
docker-compose logs database
