/**
 * api.js  —  Thin wrapper around the Flask caption API
 */

const BASE = import.meta.env.VITE_API_URL || "";

/**
 * Convert a File object → base64 data-URL string
 * @param {File} file
 * @returns {Promise<string>}
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * POST /generate-caption
 * @param {File}   imageFile
 * @param {"normal"|"instagram"|"funny"} style
 * @returns {Promise<{ caption: string, style: string, imageName: string }>}
 */
export async function generateCaption(imageFile, style = "normal") {
  const base64 = await fileToBase64(imageFile);

  const res = await fetch(`${BASE}/generate-caption`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imageBase64: base64,
      style,
      imageName: imageFile.name,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Caption generation failed");
  }

  return res.json();
}

/**
 * GET /history
 * @returns {Promise<Array>}
 */
export async function fetchHistory() {
  const res = await fetch(`${BASE}/history`);
  if (!res.ok) throw new Error("Could not load history");
  return res.json();
}

/**
 * DELETE /history/:id
 * @param {number} id
 */
export async function deleteHistory(id) {
  const res = await fetch(`${BASE}/history/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Could not delete record");
  return res.json();
}
