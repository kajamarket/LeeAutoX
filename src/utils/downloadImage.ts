/**
 * Image Download Utility
 * Attempts to fetch image as blob and trigger browser download.
 * Falls back to opening image in a new tab if CORS prevents direct download.
 */
export async function downloadImage(url: string, suggestedFilename: string): Promise<void> {
  if (!url) return;

  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = suggestedFilename || 'vehicle-photo.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.warn('CORS or network error downloading image, falling back to new window/tab:', err);
    // Fallback for cross-origin images where fetch is restricted
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.download = suggestedFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
