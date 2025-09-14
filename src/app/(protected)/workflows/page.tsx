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
    <div className="mx-auto -mt-10 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center">
      <div className="mx-auto w-3xl">
        <h1 className="mb-4 text-center text-4xl font-semibold">
         Workflow Automation
        </h1>
        <div>
          <form>
            <div className="rounded-2xl border-2 border-gray-200 px-4 shadow-sm">
              {(preview || fileType) && (
                <div className="relative w-fit">
                  {preview ? (
                    <>
                      <Image
                        className="my-[10px] ms-[8px] rounded-lg"
                        src={preview}
                        alt="Preview"
                        width={120}
                        height={120}
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
                    <div className="flex items-center my-[10px] ms-[8px] rounded-lg border p-2 bg-gray-50 w-full h-full justify-center">
                      <FileIcon size={25} className="text-gray-400" />
                      <span className="ml-2 text-xs break-all">{fileName}</span>
                      <XIcon
                        size={20}
                        className={`absolute top-[1px] right-[-8px] cursor-pointer rounded-full p-0.5`}
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
              <input
                type="text"
                className="w-full border-none px-2 py-2 outline-none"
                placeholder="Prompt your workflow"
              />
              <div className="flex justify-between py-2">
                <div className="flex items-center relative">
                  <Plus className="cursor-pointer rounded-full border-2 border-gray-300 p-0.5" />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="opacity-0 absolute left-0 w-[24px] cursor-pointer"
                  />
                </div>
                <ArrowRight
                  type="submit"
                  className="cursor-pointer rounded-full border-2 border-gray-300 bg-black p-0.5 text-white"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
