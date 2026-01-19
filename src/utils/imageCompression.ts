/**
 * Image Compression Utility
 * Compresses images to reduce file size while maintaining aspect ratio
 */

interface CompressionResult {
  compressedDataUrl: string;
  stats: {
    originalSize: number;
    originalDimensions: string;
    newDimensions: string;
    originalBase64Length: number;
    compressedBase64Length: number;
    compressionRatio: string;
  };
}

/**
 * Compresses an image file to a data URL with specified dimensions and quality
 * @param file - The image file to compress
 * @param maxWidth - Maximum width in pixels (default: 1920)
 * @param maxHeight - Maximum height in pixels (default: 1920)
 * @param quality - JPEG quality from 0 to 1 (default: 0.8)
 * @returns Promise resolving to base64 data URL of compressed image
 */
export const compressImage = (
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1920,
  quality: number = 0.8,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = event => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to base64 with compression
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

        // Log compression stats for debugging
        console.log('[ImageCompression]', {
          originalSize: file.size,
          originalDimensions: `${img.width}x${img.height}`,
          newDimensions: `${width}x${height}`,
          originalBase64Length: (event.target?.result as string).length,
          compressedBase64Length: compressedDataUrl.length,
          compressionRatio:
            (
              (((event.target?.result as string).length -
                compressedDataUrl.length) /
                (event.target?.result as string).length) *
              100
            ).toFixed(2) + '%',
        });

        resolve(compressedDataUrl);
      };

      img.onerror = reject;
    };

    reader.onerror = reject;
  });
};

/**
 * Compresses an image and returns both the data URL and compression statistics
 * @param file - The image file to compress
 * @param maxWidth - Maximum width in pixels
 * @param maxHeight - Maximum height in pixels
 * @param quality - JPEG quality from 0 to 1
 * @returns Promise resolving to compressed data URL and stats
 */
export const compressImageWithStats = (
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1920,
  quality: number = 0.8,
): Promise<CompressionResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = event => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        const originalLength = (event.target?.result as string).length;

        resolve({
          compressedDataUrl,
          stats: {
            originalSize: file.size,
            originalDimensions: `${img.width}x${img.height}`,
            newDimensions: `${width}x${height}`,
            originalBase64Length: originalLength,
            compressedBase64Length: compressedDataUrl.length,
            compressionRatio:
              (
                ((originalLength - compressedDataUrl.length) / originalLength) *
                100
              ).toFixed(2) + '%',
          },
        });
      };

      img.onerror = reject;
    };

    reader.onerror = reject;
  });
};
