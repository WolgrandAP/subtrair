# Microsserviço de Subtração — Time 2

> Componente da **Calculadora Distribuída** — ADS 6º Período  
> Disciplina: **Gerenciamento de Configuração e Mudança de Software (GCMS)**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](CHANGELOG.md)
[![Contract](https://img.shields.io/badge/contract-v1.0.0-green.svg)](CONTRATO_API.md)
[![Docker](https://img.shields.io/badge/docker-ready-2496ED.svg)](Dockerfile)

---

## 1. Visão Geral

Este microsserviço é responsável exclusivamente pela operação matemática de **Subtração** (`a - b`) na Calculadora Distribuída. Ele foi desenvolvido seguindo as diretrizes de governança de configuração, conteinerização isolada e cumprimento rigoroso do contrato de API compartilhado.

## 2. Contrato de API

O serviço expõe a seguinte interface em conformidade com o [`CONTRATO_API.md`](CONTRATO_API.md):

### `POST /subtrair`

#### Requisição
```http
POST /subtrair HTTP/1.1
Content-Type: application/json

{
  "a": 10,
  "b": 5
}
```

#### Resposta de Sucesso (`200 OK`)
```json
{
  "resultado": 5
}
```

#### Respostas de Erro

- **400 Bad Request (`INVALID_INPUT`)**: Quando `a` ou `b` estão ausentes ou não são do tipo número (ex: strings numéricas `"10"` não são aceitas).
  ```json
  {
    "erro": {
      "codigo": "INVALID_INPUT",
      "mensagem": "Os campos 'a' e 'b' devem ser números."
    }
  }
  ```
- **400 Bad Request (`INVALID_JSON`)**: Quando o corpo da requisição é um JSON malformado.
  ```json
  {
    "erro": {
      "codigo": "INVALID_JSON",
      "mensagem": "O corpo da requisição deve ser um JSON válido."
    }
  }
  ```

### `GET /health`

Retorna o status operacional do microsserviço:
```json
{
  "status": "OK",
  "servico": "subtrair",
  "versao": "1.0.0"
}
```

---

## 3. Execução Local

### Pré-requisitos
- Node.js 18+ (sem dependências externas necessárias)

### Instalação e Execução
```bash
# Executar a suíte de testes contratuais
npm test

# Iniciar o servidor (porta padrão: 3002)
npm start
```

Para rodar em porta customizada:
```bash
PORT=4000 npm start
```

---

## 4. Execução com Docker

### Construir a Imagem
```bash
docker build -t calculadora-subtrair:1.0.0 .
```

### Rodar o Container Individualmente
```bash
docker run -d --name subtrair -p 3002:3002 calculadora-subtrair:1.0.0
```

### Testar com cURL
```bash
curl -X POST http://localhost:3002/subtrair \
  -H "Content-Type: application/json" \
  -d '{"a": 10, "b": 3}'
# Retorno esperado: {"resultado":7}
```

---

## 5. Integração com Docker Compose Central

Para integrar este microsserviço no arquivo central `docker-compose.yml` da Calculadora Distribuída:

```yaml
version: '3.8'

services:
  subtrair:
    build:
      context: ./subtrair
      dockerfile: Dockerfile
    image: calculadora-subtrair:1.0.0
    container_name: calculadora-subtrair
    ports:
      - "3002:3002"
    restart: unless-stopped
```

Consulte também o arquivo de referência [`docker-compose.example.yml`](docker-compose.example.yml).

---

## 6. Governança e Gestão de Mudanças (GCMS)

- **Versionamento Semântico (SemVer):** A versão estável atual é `v1.0.0`.
- **Rastreabilidade de Mudanças:** Todas as mudanças em código e contrato devem ser submetidas via **Issues** e **Pull Requests**.
- **Histórico:** Veja o histórico de lançamentos e versões no [`CHANGELOG.md`](CHANGELOG.md).
