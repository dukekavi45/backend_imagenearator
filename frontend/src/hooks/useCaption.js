/**
 * useCaption.js
 * Custom hook that manages the full caption generation lifecycle.
 */

import { useState, useCallback } from "react";
import { generateCaption } from "../utils/api";

export function useCaption() {
  const [imageFile,  setImageFile]  = useState(null);   // File | null
  const [imageURL,   setImageURL]   = useState(null);   // object URL for preview
  const [caption,    setCaption]    = useState("");
  const [style,      setStyle]      = useState("normal");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);

  /** Accept a new file, create a preview URL, reset caption. */
  const selectImage = useCallback((file) => {
    if (!file) return;
    if (imageURL) URL.revokeObjectURL(imageURL);   // free previous blob
    setImageFile(file);
    setImageURL(URL.createObjectURL(file));
    setCaption("");
    setError(null);
  }, [imageURL]);

  /** Call the API and update state. */
  const generate = useCallback(async (overrideStyle) => {
    if (!imageFile) { setError("Please upload an image first."); return; }

    const chosenStyle = overrideStyle || style;
    setLoading(true);
    setError(null);
    setCaption("");

    try {
      const data = await generateCaption(imageFile, chosenStyle);
      setCaption(data.caption);
      setStyle(chosenStyle);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [imageFile, style]);

  /** Reset everything. */
  const reset = useCallback(() => {
    if (imageURL) URL.revokeObjectURL(imageURL);
    setImageFile(null);
    setImageURL(null);
    setCaption("");
    setError(null);
    setLoading(false);
  }, [imageURL]);

  return {
    imageFile, imageURL,
    caption, style, setStyle,
    loading, error,
    selectImage, generate, reset,
  };
}
