# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning (SemVer)](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2026-11-02

### Adicionado
- Implementação inicial do microsserviço de subtração (`POST /subtrair`) em conformidade com o Contrato de API `v1.0.0`.
- Endpoint de verificação de integridade (`GET /health`).
- Validação estrita de entrada (rejeitando strings numéricas, valores nulos e operandos ausentes).
- Tratamento e padronização de erros (`INVALID_INPUT`, `INVALID_JSON`, `METHOD_NOT_ALLOWED`, `NOT_FOUND`).
- Dockerfile otimizado multi-stage baseado em `node:20-alpine` com usuário não-root.
- Arquivo de exemplo `docker-compose.example.yml` para facilitar a orquestração central.
- Suíte de testes automatizados com cobertura total dos cenários contratuais (`npm test`).
- Documentação completa em `README.md` e `CONTRATO_API.md`.
