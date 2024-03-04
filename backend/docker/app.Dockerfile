# stage 1: install dependencies
FROM bellsoft/liberica-openjdk-debian:21 as install
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline

# stage 2: package the application into JAR
COPY src ./src
RUN ./mvnw package -DskipTests

# stage 3: running the JAR
FROM alpine:latest as app_server
RUN apk add --update npm
RUN apk add --update nodejs
RUN apk add --update nano
RUN apk add openjdk21
RUN apk add --no-cache postgresql-client

WORKDIR /app
COPY --from=install /app/target/app.jar ./app.jar
COPY ./scripts ./scripts
RUN cd scripts && npm install

CMD ["java", "-jar", "app.jar"]
# CMD ["tail", "-f", "/dev/null"]