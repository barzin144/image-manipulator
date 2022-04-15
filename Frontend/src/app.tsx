import React, { useState } from "react";
import axios, { AxiosResponse } from "axios";
import Upload from "./components/upload";
import "./app.scss";
import cogoToast from "cogo-toast";

const App = () => {
  const [image, setImage] = useState(null);
  const [resultImage, setResultImage] = useState("");
  const [imageIsChanged, setImageIsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const uploadChange = (uploadedImage: { dataUrl: string }) => {
    if (!!uploadedImage.dataUrl) {
      setImage(uploadedImage);
    } else {
      setImage(null);
    }
  };

  const diceMeClick = () => {
    const data = { base64Image: image.dataUrl };
    setIsLoading(true);
    axios
      .post(`${process.env.PUBLIC_URL}/dice/receiveImage`, data)
      .then((response) => {
        setResultImage(response.data.image);
        setImageIsChanged(true);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.response) {
          cogoToast.error(error.response.data.message);
        } else {
          cogoToast.error(error.message);
        }
        setIsLoading(false);
      });
  };

  const pixelMeClick = () => {
    const data = { base64Image: image.dataUrl };
    setIsLoading(true);
    axios
      .post(`${process.env.PUBLIC_URL}/pixelate/receiveImage`, data)
      .then((response) => {
        setResultImage(response.data.image);
        setImageIsChanged(true);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.response) {
          cogoToast.error(error.response.data.message);
        } else {
          cogoToast.error(error.message);
        }
        setIsLoading(false);
      });
  };
  const downloadImage = () => {};
  const newClick = () => {
    setImageIsChanged(false);
    setResultImage("");
    setImage(null);
  };
  return (
    <div className="App">
      {isLoading && (
        <div className="overlay">
          <span>&#129300; Processing...</span>
        </div>
      )}
      <p>This tool changes your avatar &#128513;</p>
      {!imageIsChanged && (
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
      )}
      {!imageIsChanged && !!image && (
        <div>
          <span className="btn" onClick={pixelMeClick}>
            <i className="fa-solid fa-clone"></i>pixel me
          </span>
          <span className="btn" onClick={diceMeClick}>
            <i className="fa-solid fa-dice"></i>dice me
          </span>
        </div>
      )}
      {imageIsChanged && (
        <>
          <div>
            <img src={resultImage} alt="" width="300" />
          </div>
          <div>
            <a className="btn" download="image.jpeg" href={resultImage}>
              <i className="fa-solid fa-cloud-arrow-down"></i>
              download
            </a>
            <span className="btn" onClick={newClick}>
              <i className="fa-solid fa-plus"></i>
              new
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
