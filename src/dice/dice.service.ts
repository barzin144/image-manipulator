import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as Jimp from "jimp";

@Injectable()
export class DiceService {
  private diceSize: number = 7;
  private whiteColor = Jimp.rgbaToInt(255, 255, 255, 255);
  private blackColor = Jimp.rgbaToInt(0, 0, 0, 255);
  private grayColor = Jimp.rgbaToInt(150, 150, 150, 255);
  private dicesImageList: Jimp[] = [];

  constructor() {
    for (let i = 1; i <= 6; i++) {
      this.dicesImageList.push(this.createDiceImage(i));
    }
  }

  async dicelateImage(base64Image: string) {
    //convert base64 image to Jimp image object
    const image: Jimp = (await this.returnImageFromBase64String(base64Image)).grayscale();

    //create new blank image
    let dicelate = new Jimp(
      image.bitmap.width * this.diceSize,
      image.bitmap.height * this.diceSize
    );

    //iterate over each images' pixel
    for (const pixel of this.getPixel(image, 1)) {
      const pixelColor = image.getPixelColor(pixel.x, pixel.y);
      const pixelSaturation = Jimp.intToRGBA(pixelColor);
      const diceIndex = Math.floor(pixelSaturation.r / (255 / 6));
      //console.log(Jimp.intToRGBA(pixelColor));

      //iterate over biger pixel and set a color to all of them
      for (const bigerPixel of this.bigerPixelXY(
        pixel.x * this.diceSize,
        pixel.y * this.diceSize,
        this.diceSize
      )) {
        dicelate = dicelate.setPixelColor(
          this.dicesImageList[5 - diceIndex].getPixelColor(
            bigerPixel.x % this.diceSize,
            bigerPixel.y % this.diceSize
          ),
          bigerPixel.x,
          bigerPixel.y
        );
      }
    }

    fs.writeFile("dice-out.jpeg", await dicelate.getBufferAsync(Jimp.MIME_JPEG), (error) =>
      console.log(error)
    );
    return true;
  }

  //a generator which return xy of biger pixel
  private *bigerPixelXY(xStartFrom: number, yStartFrom: number, pixelSize: number) {
    for (let i = xStartFrom; i < xStartFrom + pixelSize; i++) {
      for (let j = yStartFrom; j < yStartFrom + pixelSize; j++) {
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

  //convert base64 image to Jimp image object
  private async returnImageFromBase64String(base64Image: string) {
    const imageBuffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), "base64");

    return await Jimp.read(imageBuffer);
  }

  private createDiceImage(diceNumber: number): Jimp {
    const emptyDice = this.createEmptyDicePixel();
    switch (diceNumber) {
      case 1:
        return emptyDice.setPixelColor(this.blackColor, 3, 3);
      case 2:
        return emptyDice.setPixelColor(this.blackColor, 1, 2).setPixelColor(this.blackColor, 5, 4);
      case 3:
        return emptyDice
          .setPixelColor(this.blackColor, 1, 1)
          .setPixelColor(this.blackColor, 3, 3)
          .setPixelColor(this.blackColor, 5, 5);
      case 4:
        return emptyDice
          .setPixelColor(this.blackColor, 2, 2)
          .setPixelColor(this.blackColor, 2, 4)
          .setPixelColor(this.blackColor, 4, 2)
          .setPixelColor(this.blackColor, 4, 4);
      case 5:
        return emptyDice
          .setPixelColor(this.blackColor, 1, 1)
          .setPixelColor(this.blackColor, 5, 1)
          .setPixelColor(this.blackColor, 3, 3)
          .setPixelColor(this.blackColor, 1, 5)
          .setPixelColor(this.blackColor, 5, 5);
      case 6:
        return emptyDice
          .setPixelColor(this.blackColor, 2, 1)
          .setPixelColor(this.blackColor, 4, 1)
          .setPixelColor(this.blackColor, 2, 3)
          .setPixelColor(this.blackColor, 4, 3)
          .setPixelColor(this.blackColor, 2, 5)
          .setPixelColor(this.blackColor, 4, 5);
    }
  }

  private createEmptyDicePixel(): Jimp {
    let emptyDice = new Jimp(this.diceSize, this.diceSize, this.whiteColor);
    for (let index = 0; index < this.diceSize; index++) {
      emptyDice = emptyDice
        .setPixelColor(this.grayColor, index, 0)
        .setPixelColor(this.grayColor, 0, index)
        .setPixelColor(this.grayColor, index, this.diceSize - 1)
        .setPixelColor(this.grayColor, this.diceSize - 1, index);
    }
    return emptyDice;
  }
}
