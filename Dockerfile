# Imagem base leve e oficial do Node.js Alpine
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Define ambiente de produção
ENV NODE_ENV=production
ENV PORT=3002

# Copia arquivos de definição e dependências
COPY package.json ./

# Copia o código-fonte da aplicação
COPY src/ ./src/

# Executa com usuário não-root por segurança
USER node

# Expõe a porta do serviço
EXPOSE 3002

# Comando de inicialização
CMD ["node", "src/server.js"]
