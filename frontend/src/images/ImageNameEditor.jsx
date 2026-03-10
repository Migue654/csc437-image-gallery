import { useState } from "react";

export function ImageNameEditor({ imageId, initialValue, onNameUpdate }) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameInput, setNameInput] = useState(initialValue || "");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    function handleEditPressed() {
        setIsEditingName(true);
        setNameInput(initialValue || "");
    }
    async function handleSubmitPressed() {
        // TODO
        setIsLoading(true);
        setError("");
        try {
            const response = await fetch(`/api/images/${imageId}/rename`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ newName: nameInput }),

            })
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error: HTTP ${response.status} ${response.statusText} - ${errorData.message}`);
            }
            onNameUpdate(nameInput);

            setIsEditingName(false);
        }


        catch(err){
            setError(err.message);
        }
        finally{
            setIsLoading(false);
        }
    }

    if (isEditingName) {
        return (
            <div style={{ margin: "1em 0" }}>
                <label>
                    New Name
                    <input
                        required
                        disabled={isLoading}
                        style={{ marginLeft: "0.5em" }}
                        value={nameInput}
                        onChange={e => setNameInput(e.target.value)}
                    />
                </label>
                <button disabled={nameInput.length === 0} onClick={handleSubmitPressed}>Submit</button>
                <button onClick={() => setIsEditingName(false)}>Cancel</button>
                <div aria-live="polite">
                    {isLoading && <p>Renaming image...</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </div>
            </div>

        );
    } else {
        return (
            <div style={{ margin: "1em 0" }}>
                <button onClick={handleEditPressed}>Edit name</button>
            </div>
        );
    }
}
