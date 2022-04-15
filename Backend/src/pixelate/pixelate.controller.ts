import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { PixelateService } from "./pixelate.service";

@Controller("pixelate")
export class PixelateController {
  constructor(private pixelateService: PixelateService) {}

  @Post("receiveImage")
  async receiveImage(@Body() postData: { base64Image: string; pixelateRate: number }) {
    const result = await this.pixelateService.pixelateImage(
      postData.base64Image,
      postData.pixelateRate
    );
    if (result.success) {
      return result.data;
    } else {
      throw new HttpException(result.error, HttpStatus.FORBIDDEN);
    }
  }
}
