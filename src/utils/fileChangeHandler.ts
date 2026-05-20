/**
 * File Change Handler Hook
 * Encapsulates file upload logic for different options
 */

import { OPTIONS } from '@/stores/useConverstionsStore';
import { compressImage } from '@/utils/imageCompression';
import {
  isFileUploadAllowed,
  isDocumentOption,
  isValidFileExtension,
  resetFileInput,
  showInvalidFileAlert,
} from '@/utils/fileValidation';
import { RefObject } from 'react';

interface UseFileChangeHandlerParams {
  selectedOption: OPTIONS | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
  setImageBase64: (base64: string | null) => void;
  setSelectedOption: (option: OPTIONS | null) => void;
  allowedDocExtensions: string[];
}

/**
 * Handles file input change events based on selected option
 */
export const createFileChangeHandler = ({
  selectedOption,
  fileInputRef,
  selectedFiles,
  setSelectedFiles,
  setImageBase64,
  setSelectedOption,
  allowedDocExtensions,
}: UseFileChangeHandlerParams) => {
  return async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check if upload is allowed for current option
    if (!isFileUploadAllowed(selectedOption)) {
      resetFileInput(fileInputRef);
      return;
    }

    try {
      // Handle document files (Review, Rewrite, Translate, Plan, Contract, Report)
      if (isDocumentOption(selectedOption)) {
        const validFiles: File[] = [];
        for (const file of files) {
          if (isValidFileExtension(file.name, allowedDocExtensions)) {
            validFiles.push(file);
          } else {
            showInvalidFileAlert(allowedDocExtensions);
          }
        }
        if (validFiles.length > 0) {
          setSelectedFiles([...selectedFiles, ...validFiles]);
        }
      }
      // Handle image files (Image Generation & Edit)
      else {
        const file = files[0];
        if (file.type.startsWith('image/')) {
          const compressedDataUrl = await compressImage(file);
          setImageBase64(compressedDataUrl);

          // Auto-switch to EDIT_IMAGE mode if currently in IMAGE mode
          if (selectedOption !== OPTIONS.EDIT_IMAGE) {
            setSelectedOption(OPTIONS.EDIT_IMAGE);
          }
        }
      }
    } catch (error) {
      console.error('[FileChangeHandler] Error processing file:', error);
    } finally {
      // Always reset input to allow re-selecting the same file
      resetFileInput(fileInputRef);
    }
  };
};
