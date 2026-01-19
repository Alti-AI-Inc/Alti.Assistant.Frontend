/**
 * File Validation Utilities
 * Provides helper functions for file validation and processing
 */

import { OPTIONS } from '@/stores/useConverstionsStore';

/**
 * Options that allow file uploads
 */
export const FILE_UPLOAD_OPTIONS = [
  OPTIONS.REVIEW_DOCUMENTS,
  OPTIONS.REWRITE,
  OPTIONS.TRANSLATE_DOCUMENTS,
  OPTIONS.GENERATE_PLAN,
  OPTIONS.REVIEW_CONTRACT,
  OPTIONS.IMAGE,
  OPTIONS.EDIT_IMAGE,
  OPTIONS.GENERATE_REPORT,
] as const;

/**
 * Options that specifically handle document files
 */
export const DOCUMENT_OPTIONS = [
  OPTIONS.REVIEW_DOCUMENTS,
  OPTIONS.REWRITE,
  OPTIONS.TRANSLATE_DOCUMENTS,
  OPTIONS.GENERATE_PLAN,
  OPTIONS.REVIEW_CONTRACT,
  OPTIONS.GENERATE_REPORT,
] as const;

/**
 * Check if file upload is allowed for the given option
 * @param option - The current selected option
 * @returns Whether file upload is allowed
 */
export const isFileUploadAllowed = (option: OPTIONS | null): boolean => {
  if (!option) return false;
  return FILE_UPLOAD_OPTIONS.includes(option as any);
};

/**
 * Check if the option handles document files
 * @param option - The current selected option
 * @returns Whether the option handles documents
 */
export const isDocumentOption = (option: OPTIONS | null): boolean => {
  if (!option) return false;
  return DOCUMENT_OPTIONS.includes(option as any);
};

/**
 * Get file extension from filename
 * @param filename - The name of the file
 * @returns Extension with leading dot (e.g., '.pdf')
 */
export const getFileExtension = (filename: string): string => {
  return '.' + filename.split('.').pop()?.toLowerCase();
};

/**
 * Validate file extension against allowed extensions
 * @param filename - The name of the file
 * @param allowedExtensions - Array of allowed extensions (e.g., ['.pdf', '.docx'])
 * @returns Whether the file extension is valid
 */
export const isValidFileExtension = (
  filename: string,
  allowedExtensions: string[],
): boolean => {
  const extension = getFileExtension(filename);
  return allowedExtensions.includes(extension);
};

/**
 * Reset file input value
 * @param inputRef - Reference to the file input element
 */
export const resetFileInput = (
  inputRef: React.RefObject<HTMLInputElement | null>,
): void => {
  if (inputRef.current) {
    inputRef.current.value = '';
  }
};

/**
 * Show invalid file type alert
 * @param allowedExtensions - Array of allowed extensions
 */
export const showInvalidFileAlert = (allowedExtensions: string[]): void => {
  alert(`Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`);
};
