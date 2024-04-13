FROM node:21 AS ng-builder

RUN npm i -g @angular/cli

WORKDIR /ngapp

COPY frontend/package*.json .
COPY frontend/angular.json .
COPY frontend/tsconfig.* .
COPY frontend/src src
COPY frontend/ngsw-config.json .
COPY frontend/proxy.config.json .

RUN npm ci && ng build 

FROM openjdk:21-bookworm AS sb-builder

WORKDIR /sbapp

COPY backend/src src
COPY backend/.mvn .mvn
COPY backend/mvnw .
COPY backend/pom.xml .
COPY backend/mvnw.cmd .
COPY --from=ng-builder /ngapp/dist/frontend/browser/ src/main/resources/static

RUN ./mvnw package -Dmvn.test.skip=true

FROM openjdk:21-bookworm

COPY --from=sb-builder /sbapp/target/backend-0.0.1-SNAPSHOT.jar app.jar

ENV PORT=8080
ENV SPRING_DATA_MONGODB_URI=NOT_SET 
ENV S3_SECRET_KEY=abc123
ENV S3_ACCESS_KEY=abc123
ENV S3_BUCKET_NAME=abc123
ENV RAWG_API_KEY=
ENV SPRING_DATASOURCE_URL=
ENV SPRING_MAIL_USERNAME=
ENV SPRING_MAIL_PASSWORD=

EXPOSE $PORT

ENTRYPOINT SERVER_PORT=${PORT} java -jar ./app.jar
