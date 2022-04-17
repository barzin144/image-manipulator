import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { json } from "body-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = {
    origin:
      process.env.NODE_ENV === "production"
        ? "https://barzin144.github.io"
        : "http://localhost:8080",
    methods: "GET,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    credentials: true,
  };

  app.enableCors(options);
  app.use(json({ limit: "5mb" }));
  await app.listen(process.env.PORT || 8081, () =>
    console.log(`Server is running... ${JSON.stringify(process.env.NODE_ENV)}`)
  );
}
bootstrap();
