# Contrato de API — Calculadora Distribuída

**Versão:** `v1.0.0`  
**Disciplina:** Gerenciamento de Configuração e Mudança de Software (GCMS)

## 1. Objetivo

Estabelecer o contrato REST/JSON compartilhado pelos quatro microsserviços independentes da Calculadora Distribuída.

## 2. Endpoints

| Time | Operação | Método | Endpoint |
| --- | --- | --- | --- |
| 1 | Adição | `POST` | `/somar` |
| 2 | Subtração | `POST` | `/subtrair` |
| 3 | Multiplicação | `POST` | `/multiplicar` |
| 4 | Divisão | `POST` | `/dividir` |

## 3. Requisição

Todas as operações recebem o mesmo corpo JSON:

```json
{
  "a": 10,
  "b": 5
}
```

### Regras de entrada

- `a`: campo obrigatório, do tipo número JSON.
- `b`: campo obrigatório, do tipo número JSON.
- São aceitos valores inteiros, decimais e negativos.
- Strings numéricas, como `"10"`, não são aceitas.
- Os serviços não devem atribuir valores padrão a campos ausentes.
- O corpo deve ser um objeto JSON válido.
- A requisição deve utilizar `Content-Type: application/json`.

## 4. Resposta de sucesso

**Status HTTP:** `200 OK`  
**Content-Type:** `application/json`

```json
{
  "resultado": 5
}
```

O campo `resultado` é obrigatório e contém um número JSON finito. Não deve haver arredondamento deliberado do resultado.

## 5. Respostas de erro

Todas as respostas de erro devem seguir a estrutura:

```json
{
  "erro": {
    "codigo": "INVALID_INPUT",
    "mensagem": "Os campos 'a' e 'b' devem ser números."
  }
}
```

| Situação | Status HTTP | `erro.codigo` |
| --- | --- | --- |
| Campo obrigatório ausente | `400 Bad Request` | `INVALID_INPUT` |
| Operando não numérico | `400 Bad Request` | `INVALID_INPUT` |
| JSON sintaticamente inválido | `400 Bad Request` | `INVALID_JSON` |
| Divisão por zero | `422 Unprocessable Content` | `DIVISION_BY_ZERO` |
| Erro inesperado no servidor | `500 Internal Server Error` | `INTERNAL_ERROR` |

## 6. Versionamento e Gestão de Mudanças

O contrato segue o versionamento semântico (SemVer):
- **MAJOR:** mudanças incompatíveis no contrato.
- **MINOR:** adições compatíveis de funcionalidades.
- **PATCH:** correções que preservem a compatibilidade.
