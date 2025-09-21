"use client";
import { ArrowRight, FileIcon, Plus, XIcon } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent } from "react";

export default function Page() {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [fileType, setFileType] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileType(file.type);
      setFileName(file.name);
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreview(url);
      } else {
        setPreview(null);
      }
    }
  };

  return (
    <div className="mx-auto -mt-10 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4">
      <div className="w-full max-w-3xl">
        {/* Heading */}
        <h1 className="mb-6 text-center text-2xl font-semibold sm:text-3xl md:text-4xl">
          Workflow Automation
        </h1>

        {/* Form */}
        <form>
          <div className="rounded-2xl border-2 border-gray-200 px-3 sm:px-4 shadow-sm">
            {(preview || fileType) && (
              <div className="relative w-fit">
                {preview ? (
                  <>
                    <Image
                      className="my-3 ms-2 rounded-lg"
                      src={preview}
                      alt="Preview"
                      width={100}
                      height={100}
                    />
                    <XIcon
                      size={20}
                      className="absolute top-1 right-1 cursor-pointer bg-white rounded-full p-0.5"
                      onClick={() => {
                        setPreview(null);
                        setFileType(null);
                        setFileName(null);
                      }}
                    />
                  </>
                ) : (
                  <div className="flex items-center my-3 ms-2 rounded-lg border p-2 bg-gray-50 w-full justify-center">
                    <FileIcon size={22} className="text-gray-400" />
                    <span className="ml-2 text-xs sm:text-sm break-all">
                      {fileName}
                    </span>
                    <XIcon
                      size={18}
                      className="absolute top-1 right-1 cursor-pointer rounded-full p-0.5"
                      onClick={() => {
                        setPreview(null);
                        setFileType(null);
                        setFileName(null);
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Input */}
            <input
              type="text"
              className="w-full border-none px-2 py-2 outline-none text-sm sm:text-base"
              placeholder="Prompt your workflow"
            />

            {/* Footer */}
            <div className="flex justify-between items-center py-2">
              {/* File upload */}
              <div className="flex items-center relative">
                <Plus className="cursor-pointer rounded-full border-2 border-gray-300 p-0.5" />
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute left-0 top-0 h-full w-[24px] opacity-0 cursor-pointer"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="flex items-center justify-center rounded-full border-2 border-gray-300 bg-black p-1.5 text-white"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
