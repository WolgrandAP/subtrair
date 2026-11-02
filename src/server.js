const http = require('node:http');

/**
 * Envia uma resposta JSON padronizada com código HTTP
 */
function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

/**
 * Envia um erro padronizado conforme o contrato da API
 */
function sendError(res, statusCode, codigo, mensagem) {
  sendJson(res, statusCode, {
    erro: {
      codigo,
      mensagem,
    },
  });
}

/**
 * Cria a aplicação/servidor HTTP
 */
function createServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    // Endpoint de verificação de integridade (Health Check)
    if (req.method === 'GET' && (url.pathname === '/health' || url.pathname === '/')) {
      return sendJson(res, 200, {
        status: 'OK',
        servico: 'subtrair',
        versao: '1.0.0',
      });
    }

    // Endpoint de Subtração
    if (url.pathname === '/subtrair') {
      if (req.method !== 'POST') {
        return sendError(res, 405, 'METHOD_NOT_ALLOWED', 'Método HTTP não permitido. Utilize POST.');
      }

      let rawBody = '';

      req.on('data', (chunk) => {
        rawBody += chunk;
        // Prevenção básica de payloads abusivos (> 1MB)
        if (rawBody.length > 1e6) {
          req.destroy();
        }
      });

      req.on('end', () => {
        let body;
        try {
          body = JSON.parse(rawBody || '{}');
        } catch {
          return sendError(res, 400, 'INVALID_JSON', 'O corpo da requisição deve ser um JSON válido.');
        }

        // Validação de presença e tipo numérico restrito (número JSON, rejeitando null, strings e ausência)
        if (
          body === null ||
          typeof body !== 'object' ||
          Array.isArray(body) ||
          typeof body.a !== 'number' ||
          typeof body.b !== 'number' ||
          !Number.isFinite(body.a) ||
          !Number.isFinite(body.b)
        ) {
          return sendError(res, 400, 'INVALID_INPUT', "Os campos 'a' e 'b' devem ser números.");
        }

        const resultado = body.a - body.b;

        return sendJson(res, 200, {
          resultado,
        });
      });

      return;
    }

    // Rota não encontrada
    return sendError(res, 404, 'NOT_FOUND', 'Endpoint não encontrado.');
  });
}

// Inicialização direta do servidor se executado pelo CLI
if (require.main === module) {
  const PORT = process.env.PORT || 3002;
  const server = createServer();
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Time 2 - Subtrair] Microsserviço rodando na porta ${PORT}`);
  });
}

module.exports = { createServer, sendJson, sendError };
