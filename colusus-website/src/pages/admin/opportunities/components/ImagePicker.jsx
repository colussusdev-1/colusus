import { useEffect, useRef, useState } from "react";
import {
    HiOutlineArrowUpTray,
    HiOutlinePhoto,
    HiOutlineTrash,
} from "react-icons/hi2";
import api from "../../../../services/api";

const ImagePicker = ({
    label = "Image",
    value = "",
    onChange,
    hint = "Upload a JPG or PNG image. Maximum file size is 10 MB.",
    aspect = "landscape",
}) => {
    const inputRef = useRef(null);

    const [preview, setPreview] = useState(value || "");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setPreview(value || "");
    }, [value]);

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setError("");

        const allowedTypes = [
            "image/jpeg",
            "image/png",
        ];

        if (!allowedTypes.includes(file.type)) {
            setError("Please select a JPG or PNG image.");
            event.target.value = "";
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError("Image must be 10 MB or smaller.");
            event.target.value = "";
            return;
        }

        const localPreview = URL.createObjectURL(file);
        setPreview(localPreview);
        setUploading(true);

        try {
            const formData = new FormData();

            formData.append("file", file);
            formData.append("type", "OPPORTUNITY_IMAGE");

            const { data } = await api.post(
                "/uploads",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            const uploadedUrl = data?.data?.url;

            if (!uploadedUrl) {
                throw new Error(
                    "The upload completed but no image URL was returned.",
                );
            }

            onChange(uploadedUrl);
        } catch (uploadError) {
            setPreview(value || "");
            setError(
                uploadError?.response?.data?.message ||
                uploadError?.message ||
                "Image upload failed. Please try again.",
            );
        } finally {
            setUploading(false);
            event.target.value = "";
            URL.revokeObjectURL(localPreview);
        }
    };

    const handleRemove = () => {
        setPreview("");
        setError("");
        onChange("");
    };

    return (
        <div className={`image-picker image-picker--${aspect}`}>
            <div className="image-picker__header">
                <div>
                    <label className="field__label">
                        {label}
                    </label>

                    {hint && (
                        <p className="field__hint">
                            {hint}
                        </p>
                    )}
                </div>

                {preview && (
                    <button
                        type="button"
                        className="image-picker__remove"
                        onClick={handleRemove}
                        disabled={uploading}
                    >
                        <HiOutlineTrash />
                        Remove
                    </button>
                )}
            </div>

            <div
                className={`image-picker__surface ${preview ? "has-image" : ""
                    } ${uploading ? "is-uploading" : ""}`}
            >
                {preview ? (
                    <img
                        src={preview}
                        alt=""
                        className="image-picker__preview"
                    />
                ) : (
                    <div className="image-picker__empty">
                        <span className="image-picker__empty-icon">
                            <HiOutlinePhoto />
                        </span>

                        <strong>
                            No image selected
                        </strong>

                        <span>
                            Upload an image for this opportunity.
                        </span>
                    </div>
                )}

                {uploading && (
                    <div className="image-picker__uploading">
                        <span className="image-picker__spinner" />
                        <strong>Uploading image...</strong>
                        <span>
                            Saving securely to Cloudinary
                        </span>
                    </div>
                )}

                <button
                    type="button"
                    className="image-picker__upload"
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                >
                    <HiOutlineArrowUpTray />

                    {preview
                        ? "Replace image"
                        : "Choose image"}
                </button>

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleFileChange}
                    hidden
                />
            </div>

            {error && (
                <div className="image-picker__error">
                    {error}
                </div>
            )}
        </div>
    );
};

export default ImagePicker;