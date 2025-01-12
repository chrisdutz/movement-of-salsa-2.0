import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import { Image as Img } from "../generated/plc4j-tools-ui-frontend.ts";
import { Image as ImageView } from "primereact/image";
import { useEffect, useState } from "react";

export interface ImageEditorEvent {
    value: Img;
}

interface ImageEditorProps {
    id?: string;
    value?: Img;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    onChange?(event: ImageEditorEvent): void;
}

export default function ImageEditor({
                                        id,
                                        value,
                                        disabled,
                                        className,
                                        onChange,
                                    }: ImageEditorProps) {
    const [imageData, setImageData] = useState<string>("");

    useEffect(() => {
        if (value?.imageData) {
            setImageData(value.imageData);
        }
    }, [value]);

    const customUploader = (event: FileUploadHandlerEvent) => {
        const file = event.files[0];
        const reader = new FileReader();

        reader.onloadend = (e) => {
            const base64Data = e.target?.result as string;
            const image = new Image();

            image.onload = () => {
                const updatedValue: Img = {
                    ...value,
                    width: image.naturalWidth,
                    height: image.naturalHeight,
                    imageData: base64Data,
                };

                setImageData(base64Data);

                if (onChange) {
                    onChange({ value: updatedValue });
                }
            };

            image.src = base64Data;
        };

        reader.readAsDataURL(file);
    };

    return (
        <div className="flex flex-column md:flex-row gap-4 w-full">
            <FileUpload
                id={id}
                mode="basic"
                disabled={disabled}
                className={className}
                accept="image/*"
                maxFileSize={1000000}
                auto
                chooseLabel="Browse"
                customUpload
                uploadHandler={customUploader}
            />
            {imageData && <ImageView src={imageData} />}
        </div>
    );
}
