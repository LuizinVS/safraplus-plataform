# Estágio 1: Build da aplicação com Maven
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Otimização de cache do Docker: baixa dependências primeiro
COPY pom.xml .
RUN mvn dependency:go-offline

# Copia o código-fonte e compila
COPY src ./src
RUN mvn clean package -DskipTests

# Estágio 2: Criação da imagem final leve
FROM eclipse-temurin:17-jre-focal
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]