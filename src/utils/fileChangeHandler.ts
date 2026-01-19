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
  setSelectedFile: (file: File | undefined) => void;
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
  setSelectedFile,
  setImageBase64,
  setSelectedOption,
  allowedDocExtensions,
}: UseFileChangeHandlerParams) => {
  return async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if upload is allowed for current option
    if (!isFileUploadAllowed(selectedOption)) {
      resetFileInput(fileInputRef);
      return;
    }

    try {
      // Handle document files (Review, Rewrite, Translate, Plan, Contract, Report)
      if (isDocumentOption(selectedOption)) {
        if (!isValidFileExtension(file.name, allowedDocExtensions)) {
          showInvalidFileAlert(allowedDocExtensions);
          resetFileInput(fileInputRef);
          return;
        }
        setSelectedFile(file);
      }
      // Handle image files (Image Generation & Edit)
      else if (file.type.startsWith('image/')) {
        const compressedDataUrl = await compressImage(file);
        setImageBase64(compressedDataUrl);

        // Auto-switch to EDIT_IMAGE mode if currently in IMAGE mode
        if (selectedOption !== OPTIONS.EDIT_IMAGE) {
          setSelectedOption(OPTIONS.EDIT_IMAGE);
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
