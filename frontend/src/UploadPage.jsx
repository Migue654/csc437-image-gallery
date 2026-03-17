import { MainLayout } from "./MainLayout.jsx";
import { useState } from "react";
import { useActionState } from "react";
import { useNavigate } from "react-router";

 function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
            });
        }


export function UploadPage({ authToken }) {
    const [previewURL, setPreviewURL] = useState("");
    const navigate = useNavigate();

    const [error, formAction, isPending] = useActionState(
        async (prevState, formData) => {
            const response = await fetch("/api/images", {
                method: "POST",
                headers: { "Authorization": `Bearer ${authToken}` },
                body: formData
            });
            if (!response.ok) {
                return "Upload failed, please try again";
            }
            const { id } = await response.json();
            navigate(`/images/${id}`);
            return null;
        },
        null
    );
    return (
        <>
            <h2>Upload</h2>
            <form action={formAction}>
                <div>
                    <label htmlFor="imageInput" >Choose image to upload: </label>
                    <input
                        id="imageInput"
                        name="image"
                        type="file"
                        accept=".png,.jpg,.jpeg"
                        required
                        disabled={isPending}
                        onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const dataURL = await readAsDataURL(file);
                            setPreviewURL(dataURL);
                        }
                            }}
                    />
                </div>
                <div>
                    <label>
                        <span>Image title: </span>
                        <input name="name" disabled={isPending}  required />
                    </label>
                </div>
                <div>
                   <img style={{width: "20em", maxWidth: "100%"}} src={previewURL} alt="" />
                </div>
                {error && <p style={{color: "red"}}>{error}</p>}
                <input type="submit" value="Confirm upload" disabled={isPending} />
            </form>
        </>
    );
}
