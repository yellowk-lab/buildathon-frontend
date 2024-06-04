import { supabase } from "@core/supabase";
import { useState, useCallback } from "react";

interface UseTextRecognitionResult {
  data: string | null;
  loading: boolean;
  error: Error | null;
}

export const useTextRecognition = (): [
  (imageUrl: string) => Promise<void>,
  UseTextRecognitionResult,
] => {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const getTextFromScannedImage = useCallback(async (imageUrl: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const base64data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(blob);
      });

      const { data: result, error: invokeError } =
        await supabase.functions.invoke("extract-text-from-image", {
          body: JSON.stringify({ image_base64: base64data }),
        });

      if (invokeError) {
        throw new Error(invokeError.message);
      }

      if (result?.responses[0]?.textAnnotations !== undefined) {
        setData(result.responses[0].textAnnotations[0].description);
      } else {
        setError(Error("Aucun text n'a été détecté, veuillez ressayer."));
      }
    } catch (e) {
      console.error(e);
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return [getTextFromScannedImage, { data, loading, error }];
};
