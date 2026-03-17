import { useState, useEffect } from "react";
import { MainLayout } from "../MainLayout.jsx";
// import { fetchAll } from "./ImageFetcher.js";
import { ImageGrid } from "./ImageGrid.jsx";

export function AllImages({ authToken }) {

    const[fetch_data,set_Fech_data] = useState(true);
    const[error_name,set_error]= useState("");

    const [imageData, _setImageData] = useState([]);

      useEffect(() => {
        async function fetchData() {
        const url="/api/images";
        set_Fech_data(true);
        try{
            const response = await fetch(url, {
                headers: {
                    "Authorization": `Bearer ${authToken}`
                }
            });
            if(!response.ok){
               throw new Error(`Error: HTTP ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
                _setImageData(data);
        }catch(error){
           set_error(error.message);
           set_Fech_data(false);
        }finally{
            set_Fech_data(false);
        }
        }
        fetchData();
    }, [authToken]);

    if(fetch_data === true){
            return(
                <p>Loading....</p>
            )
    }
    if(error_name !== ""){
        return(
            <p>{error_name}</p>
        )
    }



    return (
        <>
            <h2>All Images</h2>
            <ImageGrid images={imageData} />
        </>
    );
}

// useEffect(() => {
//         fetch("/api/images")
//          .then((response) => response.json())
//             .then((data) => {
//                 _setImageData(data);
//                 set_Fech_data(false);
//             })
//             .catch(() => {
//                 set_error("Failed to load images");
//                 set_Fech_data(false);
//             });
