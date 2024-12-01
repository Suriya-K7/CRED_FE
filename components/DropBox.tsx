"use Client";
import { FileUpload, Close } from "@mui/icons-material";
import React, { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";

interface DropZoneProps {
  onFileAccepted: (files: File[]) => void;
  error: string | null | undefined; // Accept Formik error as a prop
  touched: boolean; // Accept Formik touched state as a prop
}

const DropZone: React.FC<DropZoneProps> = ({
  onFileAccepted,
  error,
  touched,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const newFileList = [...selectedFiles, ...acceptedFiles];
      if (fileRejections.length > 0) {
        const errorMessages = fileRejections.map((rejection) => {
          const { file, errors } = rejection;
          return `${file.name}: ${errors.map((e) => e.message).join(", ")}`;
        });
        setErrorMessage(errorMessages.join("\n"));
      } else if (newFileList.length > 6) {
        setErrorMessage("You can only upload a maximum of 6 files.");
      } else {
        setErrorMessage(null);
        setSelectedFiles(newFileList);
        onFileAccepted(newFileList);
      }
    },
    [onFileAccepted, selectedFiles]
  );

  const handleRemoveFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    onFileAccepted(updatedFiles); // Notify parent of updated file list
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: 2 * 1024 * 1024,
  });

  return (
    <div className="flex-1">
      <div
        {...getRootProps()}
        className={`p-5 text-center min-h-32 cursor-pointer rounded-lg border-2 border-dashed ${
          isDragActive ? "#f0f0f0" : "#fff"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the PDF here...</p>
        ) : (
          <p className="text-gray-400 flex flex-col items-center">
            <span className="bg-gray-300 rounded-full flex p-3 items-center justify-center">
              <FileUpload />
            </span>
            <>
              <u>Click to upload</u> or drag and drop Bank Statements
            </>
          </p>
        )}
      </div>
      {(errorMessage || (touched && error)) && (
        <div className="text-red-300 mt-3">
          <strong>Error:</strong>
          <pre style={{ whiteSpace: "pre-wrap" }}>{errorMessage || error}</pre>
        </div>
      )}
      {selectedFiles.length > 0 && (
        <div className="mt-3">
          <ul>
            {selectedFiles.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between border rounded-lg p-3 mb-3 bg-red-50 text-red-600 border-red-400"
              >
                <div className="flex items-center">
                  <div className="mr-3 text-red-500">
                    <FileUpload />
                  </div>
                  <div>
                    <span>{file.name}</span>
                  </div>
                </div>
                <button
                  className="text-red-500 hover:bg-red-200 rounded-full p-1"
                  onClick={() => handleRemoveFile(index)}
                >
                  <Close />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropZone;
