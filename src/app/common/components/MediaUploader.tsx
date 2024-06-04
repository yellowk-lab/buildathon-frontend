import React, { useState, ChangeEvent } from "react";
import {
  Box,
  CardMedia,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { AddRounded, CancelRounded } from "@mui/icons-material";
import { useTranslations } from "next-intl";

interface ImageUploaderProps {
  onFileChange: (file: File) => void;
  onFileRemove?: () => void;
}

enum MuiSupportedMediaType {
  VIDEO = "video",
  AUDIO = "audio",
  PICTURE = "picture",
  IFRAME = "iframe",
  IMG = "img",
}

const MediaUploader: React.FC<ImageUploaderProps> = ({
  onFileChange,
  onFileRemove,
}) => {
  const theme = useTheme();
  const t = useTranslations("common.components.MediaUploader");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [mediaType, setMediaType] = useState<MuiSupportedMediaType>(
    MuiSupportedMediaType.IMG
  );
  const [aspectRatio, setAspectRatio] = useState<number>(0.64);

  const handleMediaChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const fileType = file.type.split("/")[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          const url = e.target.result.toString();
          setMediaUrl(url);

          if (fileType === "image") {
            const img = new Image();
            img.onload = () => {
              const aspectRatio = img.naturalWidth / img.naturalHeight;
              setAspectRatio(aspectRatio);
              setMediaType(MuiSupportedMediaType.IMG);
            };
            img.src = url;
          } else if (fileType === "video") {
            const video = document.createElement("video");
            video.onloadstart = () => {
              video.volume = 0;
            };
            video.onloadedmetadata = () => {
              const aspectRatio = video.videoWidth / video.videoHeight;
              setAspectRatio(aspectRatio);
              setMediaType(MuiSupportedMediaType.VIDEO);
            };
            video.src = url;
          } else if (fileType === "application") {
            // Handle PDFs with pdf.js or another library that can read PDF metadata
            console.log("PDFs are not supported yet");
          }

          onFileChange(file);
        }
      };

      if (fileType === "image" || fileType === "video") {
        reader.readAsDataURL(file);
      } else if (fileType === "application") {
        // Directly handle PDF files here if necessary
      }
    }
  };

  const handleMediaRemove = () => {
    setMediaUrl("");
    if (onFileRemove) {
      onFileRemove();
    }
  };

  const renderMedia = (mediaUrl: string) => {
    return (
      <Box
        sx={{
          position: "relative",
          height: "50vh",
          width: `100%`,
          maxHeight: "35vh",
          overflow: "hidden",
          borderRadius: 4,
        }}
      >
        <CardMedia
          component={mediaType}
          src={mediaUrl}
          sx={{
            objectFit: "cover",
            height: "100%",
            width: "100%",
          }}
        />
        <IconButton
          onClick={handleMediaRemove}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CancelRounded />
        </IconButton>
      </Box>
    );
  };

  return (
    <Box textAlign="center" my={4}>
      {mediaUrl ? (
        renderMedia(mediaUrl)
      ) : (
        <Box p={4}>
          <IconButton
            component="label"
            size="large"
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            }}
          >
            <AddRounded fontSize="large" color="inherit" />
            <input
              type="file"
              hidden
              onChange={handleMediaChange}
              accept="image/*,video/*"
            />
          </IconButton>
          <Typography variant="h6" fontWeight={700} mt={2}>
            {t("add_media")}
          </Typography>
          <Typography variant="subtitle2">{t("any_kind")}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default MediaUploader;
