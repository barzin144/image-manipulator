import { Body, Controller, Post } from "@nestjs/common";
import { PixelateService } from "./pixelate.service";

@Controller("pixelate")
export class PixelateController {
  constructor(private pixelateService: PixelateService) {}

  @Post("receiveImage")
  async receiveImage(
    @Body() postData: { base64Image: string; pixelateRate: number }
  ) {
    return await this.pixelateService.pixelateImage(
      postData.base64Image,
      postData.pixelateRate
    );
  }
}
