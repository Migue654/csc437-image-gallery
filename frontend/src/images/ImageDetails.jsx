import { useState,useEffect } from "react";

import { useParams } from "react-router";

import {ImageNameEditor} from "./ImageNameEditor.jsx";
export function ImageDetails() {

    const[fetch_data,set_Fech_data] = useState(true);
    const[error_name,set_error]= useState("");


    const{imageId}= useParams();
    const [image, _setImage] = useState(null);

    useEffect(() => {
        async function fetchData() {
        const url=`/api/images/${imageId}`;
        set_Fech_data(true);
        try{
            const response = await fetch(url);
            if(!response.ok){
               throw new Error(`Error: HTTP ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            // const foundImage = data.find((img) => img._id === imageId);
            _setImage(data);
        }catch(error){
           set_error(error.message);
           set_Fech_data(false);
        }finally{
            set_Fech_data(false);
        }
        }
        fetchData();
    }, [imageId]);
    if(fetch_data === true){
        return(
            <p>Loading....</p>
        )
    }
    if (!image) {
        return <h2>Image not found</h2>;
    }


    if(error_name !== ""){
        return(
            <p>{error_name}</p>
        )
    }

    return (
        <>
            <h2>{image.name}</h2>
            <p>By {image.author.username}</p>
            <ImageNameEditor
                imageId={image._id}
                initialValue={image.name}
                onNameUpdate={(newName) => { _setImage({...image, name: newName});}}
            />
            <img className="ImageDetails-img" src={image.src} alt={image.name} />
        </>
    )
}
