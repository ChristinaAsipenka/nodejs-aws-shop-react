import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  localStorage.setItem('authorization_token', 'Q2hyaXN0aW5hQXNpcGVua2E6VEVTVF9QQVNTV09SRA==')
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);
    if (!file) return;

    try {
      console.log("Requesting presigned URL from", url);
      const authorization_token = localStorage.getItem('authorization_token');
      const authHeaders = {
        Authorization: `Basic ${authorization_token}`,
      };

      const response = await axios(url, {
        method: "GET",
        headers: authHeaders,
        params: {
          name: encodeURIComponent(file.name),
        },
      });

      const presignedUrl = response.data;

      console.log("Presigned URL:", presignedUrl);

      console.log("File to upload: ", file.name);

      const result = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
      });

      console.log("File uploaded response:", result);
      if (!result.ok) {
        console.error("Failed to upload:", await result.text());
      }
      setFile(undefined);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
