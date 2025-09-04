FROM node:20-alpine

WORKDIR /app

# Copiar apenas o package.json primeiro para aproveitar o cache do Docker
COPY package.json ./

# Instalar dependências sem depender do yarn.lock
RUN yarn install

# Copiar o resto da aplicação
COPY . .

# Gerar prisma client ANTES da compilação
RUN npx prisma generate

# Compilar a aplicação depois de ter gerado o Prisma Client
RUN yarn build

# Expor a porta que a aplicação vai usar
EXPOSE 3001

# Executar migrações e iniciar aplicação diretamente sem script
CMD /bin/sh -c "echo 'Running migrations...' && npx prisma migrate deploy && npx prisma db seed && echo 'Starting application...' && node dist/src/main"
