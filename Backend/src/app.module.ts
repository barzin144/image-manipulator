import { Module } from "@nestjs/common";
import { DiceModule } from "./dice/dice.module";
import { PixelateModule } from "./pixelate/pixelate.module";
@Module({
  imports: [PixelateModule, DiceModule],
})
export class AppModule {}
