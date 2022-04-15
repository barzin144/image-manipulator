import React, { ReactElement, useRef } from "react";
import cogoToast from "cogo-toast";
import "./upload.scss";

interface UploadPros {
  onChange: (value: { dataUrl: string }) => void;
  image?: { dataUrl: string };
  acceptType?: string;
  maxFileSize?: number;
  maxResolutionHeight: number;
  maxResolutionWidth: number;
  disabled?: boolean;
}
interface Error {
  acceptType: boolean;
  maxFileSize: boolean;
  resolution: boolean;
}

const Upload: (props: UploadPros & { children: React.ReactNode }) => ReactElement = ({
  children,
  onChange,
  image,
  acceptType = ".jpg,.png,.jpeg",
  maxFileSize = 10 * 1024 * 1024,
  maxResolutionHeight,
  maxResolutionWidth,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onError = (errors: Error) => {
    if (!!errors) {
      let errorText = "";

      if (errors.acceptType) {
        errorText += `Only files with following extentions are allowed: ${acceptType.replaceAll(
          ".",
          " "
        )}`;
      }
      if (errors.resolution) {
        errorText += `Only images with max dimensions ${maxResolutionWidth}x${maxResolutionHeight} px are allowed`;
      }
      if (errors.maxFileSize) {
        errorText += `Please select a file less than ${maxFileSize / (1024 * 1024)}MB`;
      }
      cogoToast.error(errorText, { hideAfter: 4 });
    }
  };

  const validate = async (file: File) => {
    const newErrors: Error = { acceptType: false, maxFileSize: false, resolution: false };
    const type = file.name.split(".").pop() || "";
    if (acceptType.includes(type) === false) {
      newErrors.acceptType = true;
    }
    if (maxFileSize && file.size > maxFileSize) {
      newErrors.maxFileSize = true;
    }
    if (file.type.includes("image")) {
      const image = await getImage(file);
      const checkRes = isResolutionValid(image, maxResolutionWidth, maxResolutionHeight);
      if (!checkRes) {
        newErrors.resolution = true;
      }
    }
    if (Object.values(newErrors).some((x) => x === true)) {
      onError(newErrors);
      return newErrors;
    }
    return null;
  };

  const isResolutionValid = (
    image: HTMLImageElement,
    maxResolutionWidth: number,
    maxResolutionHeight: number
  ) => {
    if (!maxResolutionWidth || !maxResolutionHeight || !image.width || !image.height) {
      return true;
    }
    if (image.width <= maxResolutionWidth && image.height <= maxResolutionHeight) {
      return true;
    }
    return false;
  };

  const getImage = (file: File): Promise<HTMLImageElement> => {
    const image = new Image();
    return new Promise((resolve) => {
      image.addEventListener("load", () => resolve(image));
      image.src = URL.createObjectURL(file);
    });
  };

  const handleClickInput = () => {
    if (inputRef.current && !disabled) {
      inputRef.current.click();
    }
  };

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleChange((e.target as HTMLInputElement).files);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleChange = async (file: FileList) => {
    if (!file) {
      return;
    }
    const fileObject = file[0];
    const checkValidate = await validate(fileObject);
    if (!!checkValidate) {
      return;
    }
    if (fileObject.type.includes("image")) {
      const fileWithDataUrl = await getFileDataUrl(fileObject);
      onChange(fileWithDataUrl);
    }
  };

  const getBase64 = (file: File): Promise<string> => {
    const reader = new FileReader();
    return new Promise((resolve: (value: string) => void) => {
      reader.addEventListener("load", () => resolve(reader.result.toString()));
      reader.readAsDataURL(file);
    });
  };

  const getFileDataUrl = async (file: File) => {
    const base64: string = await getBase64(file);
    const fileWithDataUrl = {
      dataUrl: base64,
    };
    return fileWithDataUrl;
  };

  return (
    <>
      <input
        type="file"
        accept={acceptType}
        ref={inputRef}
        multiple={false}
        onChange={onInputChange}
        style={{ display: "none" }}
        disabled={disabled}
      />
      <div className="Upload">
        {!!image && (
          <>
            <div className="imagePreview" onClick={() => handleClickInput()}>
              {!!image.dataUrl && <img src={image.dataUrl} alt="" width="300" />}
            </div>
            {!disabled && (
              <span
                className="removeButton btn"
                onClick={(e) => {
                  onChange({ dataUrl: "" });
                }}
              >
                <i className="fa-solid fa-trash-can"></i>
                remove
              </span>
            )}
          </>
        )}
        {!!image === false && (
          <div className="uploadContainer" onClick={() => handleClickInput()}>
            {children}
          </div>
        )}
      </div>
    </>
  );
};

export default Upload;
