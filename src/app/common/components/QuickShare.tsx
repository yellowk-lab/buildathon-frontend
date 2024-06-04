import React, { FC } from "react";
import { Button, Tooltip, Snackbar, IconButton, useTheme } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareFromSquare } from "@fortawesome/free-solid-svg-icons";

interface QuickCopyProps {
  url: string;
  displayText?: string;
  hideText?: boolean;
  variant?: "copy" | "share";
  onClick?: (link: string) => void;
  variantButton?: "contained" | "outlined";
}

interface BuildQuickShareURLFunc {
  (
    value: string,
    pathMatcher: (value: string) => string
  ): { url: string; shortUrl: string };
}

export const buildQuickShareURL: BuildQuickShareURLFunc = (
  value,
  pathMatcher
) => {
  if (typeof window !== "undefined") {
    const url = `${window.location.origin}/${pathMatcher(value)}`;
    const shortUrl = url.split("//")[1].substring(0, 30);
    return {
      url,
      shortUrl,
    };
  } else {
    return {
      url: "",
      shortUrl: "",
    };
  }
};

const QuickShare: FC<QuickCopyProps> = ({
  variant = "copy",
  url,
  displayText,
  hideText,
  onClick,
  variantButton = "outlined",
}) => {
  const t = useTranslations("common.components.QuickCopy");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const { palette } = useTheme();
  const isShareAvailable = () => {
    return typeof window !== "undefined" && navigator?.share;
  };

  const addEllipsis = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + "...";
    } else {
      return text;
    }
  };
  const handleClick = async () => {
    try {
      if (variant === "copy" || !isShareAvailable()) {
        await navigator.clipboard.writeText(url);
        setOpenSnackbar(true);
      } else {
        if (navigator.share) {
          navigator
            .share({
              title: "domain.com",
              url,
            })
            .catch((error) => console.log(error));
        }
      }
      onClick && onClick(url);
    } catch (error) {
      throw new Error("Clipboard copy error.");
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const icon =
    variant === "copy" ? (
      <ContentCopyIcon />
    ) : (
      <FontAwesomeIcon
        icon={faShareFromSquare}
        color={variantButton === "contained" ? "white" : palette.primary.main}
      />
    );
  const styleButton =
    variantButton === "contained"
      ? {
          bgcolor: palette.primary.light,
          "&:hover": { bgcolor: palette.primary.light },
        }
      : null;
  return (
    <>
      <Tooltip title={t("tooltip")} enterDelay={300}>
        {hideText ? (
          <IconButton onClick={handleClick}>{icon}</IconButton>
        ) : (
          <Button
            variant={variantButton}
            onClick={handleClick}
            disableElevation
            fullWidth
            sx={styleButton}
            endIcon={icon}
          >
            {displayText ? displayText : addEllipsis(url, 25)}
          </Button>
        )}
      </Tooltip>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={t("success")}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
};

export default QuickShare;
