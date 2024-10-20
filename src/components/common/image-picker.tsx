"use client";
import { CldUploadButton } from "next-cloudinary";
import toast from "react-hot-toast";

type Props = {
  // eslint-disable-next-line no-unused-vars
  setUrl: (url: string) => void;
  url: string;
};

export default function CldImagePicker({ setUrl, url }: Props) {
  return (
    <div>
      <CldUploadButton
        className="btn btn-outline-primary"
        uploadPreset="bklqqjos"
        onSuccessAction={(results) => {
          console.log("upload results", results);
          toast.success("Image uploaded successfully");
          if (typeof results.info === "object") {
            setUrl(results.info.url);
          }
        }}
        onError={(error) => {
          console.error("upload error", error);
          toast.error("Image upload failed, please try again");
        }}
      >
        {url ? "Done" : "Upload"}
      </CldUploadButton>
    </div>
  );
}
