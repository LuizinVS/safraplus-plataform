# frontend/Dockerfile

# 1. Imagem Base
FROM node:18-alpine

# 2. Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# 3. Copia os arquivos de dependência
# Isso otimiza o cache do Docker. Ele só reinstala se o package.json mudar.
COPY package.json package-lock.json ./

# 4. Instala as dependências
RUN npm install

# 5. Copia todo o resto do código-fonte do front-end
COPY . .

# 6. Expõe a porta que o Vite usa (padrão é 5173)
EXPOSE 5173

# 7. comando para iniciar a aplicação
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]