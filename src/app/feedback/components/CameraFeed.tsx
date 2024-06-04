import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { usePermission } from "react-use";
import Image from "next/image";
import CameraAccess from "@assets/images/camera-access.png";
import { grey } from "@mui/material/colors";

interface CameraFeedProps {
  onCapture: (imageUrl: string) => void;
}

const CameraFeed: React.ForwardRefRenderFunction<unknown, CameraFeedProps> = (
  { onCapture },
  ref
) => {
  const router = useRouter();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraPermission = usePermission({ name: "camera" });

  useEffect(() => {
    const getMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        setError("Error accessing the camera: " + (err as Error).message);
      }
    };

    getMedia();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraPermission, router]);

  useImperativeHandle(ref, () => ({
    captureImage,
  }));

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        const width = videoRef.current.videoWidth;
        const height = videoRef.current.videoHeight;
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        context.drawImage(videoRef.current, 0, 0, width, height);
        canvasRef.current.toBlob(
          (blob) => {
            if (blob) {
              const imageUrl = URL.createObjectURL(blob);
              onCapture(imageUrl);
            }
          },
          "image/jpeg",
          0.3
        );
      }
    }
  };

  return (
    <Box>
      {cameraPermission === "granted" ? (
        <>
          <Box p={8}>
            <Typography textAlign="center">
              Si vous voyez ce message, veuillez rafraichire la page.{" "}
            </Typography>
          </Box>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              objectFit: "cover",
              height: "100%",
              width: "100%",
            }}
          ></video>
          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        </>
      ) : (
        <Box mt={2} px={4}>
          {/* <Box display="flex" justifyContent="center">
            <Image src={CameraAccess} alt="Gift box opened." height="200" />
          </Box> */}
          <Typography variant="h3" fontWeight={600} textAlign="left" mt={4}>
            Accès à la caméra
          </Typography>
          <Typography mt={2} fontWeight={600} color={grey[700]}>
            Nous avons besoin de votre permission pour accéder à la caméra afin
            que vous puissiez scanner des articles et nous donner vos avis.
          </Typography>
          <Button
            sx={{ mt: 2 }}
            fullWidth
            variant="contained"
            onClick={() => router.reload()}
          >{`Authorizer l'accès à la caméra`}</Button>
        </Box>
      )}
    </Box>
  );
};

export default forwardRef(CameraFeed);
