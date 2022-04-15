import { Injectable } from "@nestjs/common";
import * as Jimp from "jimp";
import ServiceResponse from "src/helpers/serviceResponse";

@Injectable()
export class PixelateService {
  async pixelateImage(base64Image: string, pixelateRate: number = 8) {
    //convert base64 image to Jimp image object
    const image: Jimp = await this.returnImageFromBase64String(base64Image);

    // return error if the image is large
    if (image.bitmap.width > 500 || image.bitmap.height > 500) {
      return new ServiceResponse(null, "The image is larger than 500px x 500px", false);
    }

    //create new blank image
    let pixelate = new Jimp(image.bitmap.width, image.bitmap.height);

    //iterate over each images' pixel
    for (const pixel of this.getPixel(pixelate, pixelateRate)) {
      const pixelColor = this.getAvgOfPixels(image, pixel.x, pixel.y, pixelateRate / 2);
      //iterate over biger pixel and set a color to all of them
      for (const bigerPixel of this.bigerPixelXY(pixelateRate)) {
        pixelate = pixelate.setPixelColor(
          pixelColor,
          pixel.x + bigerPixel.x,
          pixel.y + bigerPixel.y
        );
      }
    }

    const result = await pixelate.getBase64Async(Jimp.MIME_JPEG);

    return new ServiceResponse({ image: result }, null, true);
  }

  //a generator which return xy of biger pixel
  private *bigerPixelXY(pixelSize: number) {
    for (let i = 0; i < pixelSize; i++) {
      for (let j = 0; j < pixelSize; j++) {
        yield { x: i, y: j };
      }
    }
  }

  //a generator which return one pixel x and y
  private *getPixel(image: Jimp, jumpStep: number) {
    for (let wIndex = 0; wIndex < image.bitmap.width; wIndex += jumpStep) {
      for (let hIndex = 0; hIndex < image.bitmap.height; hIndex += jumpStep) {
        yield { x: wIndex, y: hIndex };
      }
    }
  }

  //get color avarage of pixels
  private getAvgOfPixels(image: Jimp, x: number, y: number, radius: number) {
    let r = 0;
    let g = 0;
    let b = 0;
    let a = 0;
    let num = 0;

    for (let i = x - radius; i < x + radius; i++) {
      for (let j = y - radius; j < y + radius; j++) {
        if (i < 0 || i >= image.bitmap.width || j < 0 || j >= image.bitmap.height) {
          continue;
        }

        if (this.dist(x, y, i, j) > radius) {
          continue;
        }

        const color = Jimp.intToRGBA(image.getPixelColor(i, j));
        r += color.r;
        g += color.g;
        b += color.b;
        a += color.a;
        num++;
      }
    }
    return Jimp.rgbaToInt(r / num, g / num, b / num, a / num);
  }

  //return distance of 2 points in 2D
  private dist(x: number, y: number, i: number, j: number) {
    const xDist = x - i;
    const yDist = y - j;
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
  }

  //convert base64 image to Jimp image object
  private async returnImageFromBase64String(base64Image: string) {
    const imageBuffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), "base64");

    return await Jimp.read(imageBuffer);
  }
}
