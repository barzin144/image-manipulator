import { Module } from "@nestjs/common";
import { PixelateController } from "./pixelate.controller";
import { PixelateService } from "./pixelate.service";

@Module({
  imports: [],
  controllers: [PixelateController],
  providers: [PixelateService],
})
export class PixelateModule {}
