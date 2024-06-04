import {
  DocumentNode,
  OperationVariables,
  TypedDocumentNode,
  useLazyQuery,
} from "@apollo/client";
import { useState } from "react";

type FileUploadExecutor = (file: File) => Promise<string>;

interface FileUploadState {
  fileUrl: string | null;
  loading: boolean;
  error: any;
}

export const useFileUpload = (
  fileUploadQuery: DocumentNode | TypedDocumentNode<any, OperationVariables>,
): [FileUploadExecutor, FileUploadState] => {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const [getFileUploadUrl] = useLazyQuery(fileUploadQuery, {
    fetchPolicy: "network-only",
  });

  const uploadFile: FileUploadExecutor = (file: File) => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      setError(null);
      // setCurrentFile(file);
      getFileUploadUrl({
        variables: { imageType: file.type.split("/")[1] },
        onCompleted: async (data) => {
          const resultObjectName = Object.keys(data)[0];
          const { uploadURL: presignedUrl, fileStorageHash } =
            data?.[resultObjectName];

          try {
            const response = await fetch(presignedUrl, {
              method: "PUT",
              body: file,
              headers: {
                "X-Amz-Acl": "public-read",
              },
            });

            if (!response.ok) {
              throw new Error("File upload failed.");
            }

            setData(fileStorageHash);
            resolve(fileStorageHash);
          } catch (error: any) {
            setError(error);
            reject(error);
          } finally {
            setLoading(false);
          }
        },
        onError: (err: any) => {
          setError(err);
          setLoading(false);
        },
      });
    });
  };

  return [uploadFile, { fileUrl: data, loading, error }];
};
