import React, { useState } from "react";
import axios, { AxiosResponse } from "axios";
import Upload from "./assets/components/upload";
import "./app.scss";

const App = () => {
  const [image, setImage] = useState(null);

  const uploadChange = (uploadedImage: { dataUrl: string }) => {
    if (!!uploadedImage.dataUrl) {
      setImage(uploadedImage);
    } else {
      setImage(null);
    }
  };

  const diceMeClick = () => {
    const data = { base64Image: image.dataUrl };
    axios
      .post("http://localhost:8081/dice/receiveImage", data)
      .then((response) => setImage({ dataUrl: response.data.image }));
  };

  const pixelMeClick = () => {
    const data = { base64Image: image.dataUrl };
    axios
      .post("http://localhost:8081/pixelate/receiveImage", data)
      .then((response) => setImage({ dataUrl: response.data.image }));
  };

  return (
    <div className="App">
      <p>This tool changes your avatar &#128513;</p>
      <Upload
        onChange={uploadChange}
        image={image}
        maxResolutionHeight={500}
        maxResolutionWidth={500}
      >
        <div className="uploadChildren">
          <i className="fa-solid fa-cloud-arrow-up"></i>
          <span>Upload your avatar</span>
          <small>Max 500px x 500px</small>
        </div>
      </Upload>
      {!!image && (
        <div>
          <span className="btn" onClick={pixelMeClick}>
            <i className="fa-solid fa-clone"></i>pixel me
          </span>
          <span className="btn" onClick={diceMeClick}>
            <i className="fa-solid fa-dice"></i>dice me
          </span>
        </div>
      )}
    </div>
  );
};

export default App;
