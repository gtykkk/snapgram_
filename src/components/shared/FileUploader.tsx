import React, { useCallback, useState } from "react"
import { FileWithPath, useDropzone } from "react-dropzone"
import { Button } from "../ui/button"

type FileUploaderProps = {
    fieldChange: (FILES: File[]) => void;
    mediaUrl: string;
}

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
    const [file, setFile] = useState<File[]>([]);
    const [fileUrl, setfileUrl] = useState('');

    // https://react-dropzone.js.org/ 따라서 만듦
    const onDrop = useCallback((accepedFiles: FileWithPath[]) => {
        setFile(accepedFiles);
        fieldChange(accepedFiles);
        setfileUrl(URL.createObjectURL(accepedFiles[0]))
    }, [file])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpeg', '.jpg', '.svg']
        }

    })
    return (
        <div {...getRootProps()} className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer">
            <input {...getInputProps()} className="cursor-pointer" />
            {
                fileUrl ? (
                    <>
                        <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
                            <img
                                src={fileUrl}
                                alt="img"
                                className="file_uploader-img"
                            />
                        </div>
                        <p className="file_uploader-label">사진을 변경하려면 사진을 클릭하거나, 드래그하세요.</p>
                    </>
                ) : (
                    <div className="file_uploader-box">
                        <img
                            src="/assets/icons/file-upload.svg"
                            width={96}
                            height={77}
                            alt="file-upload"
                        />
                        <h3 className="base-medium text-light-2 mb-2 mt-6">
                            사진을 드래그...
                        </h3>
                        <p className="text-light-4 small-regular mb-6">
                            SVG, PNG, JPG
                        </p>
                        <Button className="shad-button_dark_4">
                            컴퓨터에서 선택...
                        </Button>

                    </div>
                )
            }
        </div>
    )
}

export default FileUploader