'use client';
import { uploadfileToKnowledgeBaseAction } from '@/actions/knowledgeBaseAction';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useQueryClient } from '@tanstack/react-query';
import { Check, Upload } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useRef } from 'react';

const KnowledgeBaseFileUpload = ({ baseId }: { baseId: string }) => {
  const { data } = useSession();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isUploadded, setIsUploadded] = React.useState(false);

  const queryClient = useQueryClient();

  const handleFileFocus = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('knowledgebotId', baseId);
      try {
        const response = await uploadfileToKnowledgeBaseAction(
          formData,
          data?.accessToken as string,
        );

        if (response.success) {
          setIsUploadded(true);
          setIsUploading(false);
          queryClient.invalidateQueries({
            queryKey: ['knowledgeBasesFiles', baseId, data?.accessToken],
          });
        }

        setTimeout(() => {
          setIsUploadded(false);
        }, 2000);
      } catch (error) {
        setIsUploadded(false);
        setIsUploading(false);
        console.log(error);
      } finally {
        setIsUploading(false);
      }
    }
  };
  return (
    <div>
      <div className="flex gap-5">
        <Button
          className="flex items-center justify-start text-sm font-normal"
          onClick={handleFileFocus}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Spinner />
              Uploading
            </>
          ) : isUploadded ? (
            <>
              <Check />
              Uploaded
            </>
          ) : (
            <>
              <Upload />
              Upload file
            </>
          )}
        </Button>
        <input
          ref={inputRef}
          className="hidden"
          type="file"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default KnowledgeBaseFileUpload;
