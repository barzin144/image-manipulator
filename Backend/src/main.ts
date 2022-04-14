import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { json } from "body-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = {
    origin: "http://localhost:8080",
    methods: "GET,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    credentials: true,
  };

  app.enableCors(options);
  app.use(json({ limit: "5mb" }));
  await app.listen(8081);
}
bootstrap();
