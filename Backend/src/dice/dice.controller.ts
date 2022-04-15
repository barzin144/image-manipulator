import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { DiceService } from "./dice.service";

@Controller("dice")
export class DiceController {
  constructor(private diceService: DiceService) {}

  @Post("receiveImage")
  async receiveImage(@Body() postData: { base64Image: string }) {
    const result = await this.diceService.dicelateImage(postData.base64Image);
    if (result.success) {
      return result.data;
    } else {
      throw new HttpException(result.error, HttpStatus.FORBIDDEN);
    }
  }
}
