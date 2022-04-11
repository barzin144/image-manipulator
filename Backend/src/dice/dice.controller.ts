import { Body, Controller, Post } from "@nestjs/common";
import { DiceService } from "./dice.service";

@Controller("dice")
export class DiceController {
  constructor(private diceService: DiceService) {}

  @Post("receiveImage")
  async receiveImage(@Body() postData: { base64Image: string }) {
    return await this.diceService.dicelateImage(postData.base64Image);
  }
}
