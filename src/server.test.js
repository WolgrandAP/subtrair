const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('./server');

function makeRequest(server, options, bodyData = null) {
  return new Promise((resolve, reject) => {
    const address = server.address();
    const reqOptions = {
      hostname: '127.0.0.1',
      port: address.port,
      path: options.path,
      method: options.method,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    const req = require('node:http').request(reqOptions, (res) => {
      let raw = '';
      res.on('data', (chunk) => (raw += chunk));
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(raw);
        } catch {
          // not json
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: json,
          raw,
        });
      });
    });

    req.on('error', reject);

    if (bodyData !== null) {
      req.write(typeof bodyData === 'string' ? bodyData : JSON.stringify(bodyData));
    }
    req.end();
  });
}

test('Microsserviço Subtrair - Suíte de Testes Contratuais', async (t) => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

  t.after(() => {
    server.close();
  });

  await t.test('Healthcheck retorna 200 OK com status e versão', async () => {
    const res = await makeRequest(server, { path: '/health', method: 'GET' });
    assert.equal(res.statusCode, 200);
    assert.equal(res.data.status, 'OK');
    assert.equal(res.data.servico, 'subtrair');
    assert.equal(res.data.versao, '1.0.0');
  });

  await t.test('POST /subtrair calcula a subtração correta de números inteiros positivos', async () => {
    const res = await makeRequest(server, { path: '/subtrair', method: 'POST' }, { a: 10, b: 5 });
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.data, { resultado: 5 });
  });

  await t.test('POST /subtrair calcula a subtração com números negativos e decimais', async () => {
    const res = await makeRequest(server, { path: '/subtrair', method: 'POST' }, { a: -2.5, b: 7.5 });
    assert.equal(res.statusCode, 200);
    assert.equal(res.data.resultado, -10);
  });

  await t.test('POST /subtrair rejeita string numérica com 400 INVALID_INPUT', async () => {
    const res = await makeRequest(server, { path: '/subtrair', method: 'POST' }, { a: "10", b: 5 });
    assert.equal(res.statusCode, 400);
    assert.equal(res.data.erro.codigo, 'INVALID_INPUT');
  });

  await t.test('POST /subtrair rejeita campo ausente com 400 INVALID_INPUT', async () => {
    const res = await makeRequest(server, { path: '/subtrair', method: 'POST' }, { a: 10 });
    assert.equal(res.statusCode, 400);
    assert.equal(res.data.erro.codigo, 'INVALID_INPUT');
  });

  await t.test('POST /subtrair rejeita payload com JSON malformado com 400 INVALID_JSON', async () => {
    const res = await makeRequest(server, { path: '/subtrair', method: 'POST' }, '{ "a": 10, invalid_json }');
    assert.equal(res.statusCode, 400);
    assert.equal(res.data.erro.codigo, 'INVALID_JSON');
  });

  await t.test('GET /subtrair retorna 405 METHOD_NOT_ALLOWED', async () => {
    const res = await makeRequest(server, { path: '/subtrair', method: 'GET' });
    assert.equal(res.statusCode, 405);
    assert.equal(res.data.erro.codigo, 'METHOD_NOT_ALLOWED');
  });
});
