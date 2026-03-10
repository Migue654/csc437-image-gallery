import express from "express";

import { ObjectId } from "mongodb";


function waitDuration(numMs) {
  return new Promise((resolve) => setTimeout(resolve, numMs));
}

export function registerImageRoutes(app, imageProvider) {
  app.get("/api/images", async (req, res) => {
    await waitDuration(1000);
    try {
      const images = await imageProvider.getAllImages();
      res.json(images);
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({ error: "Failed to fetch images" });
    }
  });

  app.get("/api/images/:imageId", async (req, res) => {
    const { imageId } = req.params;
    await waitDuration(1000);
    try {
      const image = await imageProvider.getOneImage(imageId);
      if (!image) {
        res.status(404).json({ error: "Image not found" });
      } else {
        res.json(image);
      }
    } catch (error) {
      console.error("Error fetching image:", error);
      res.status(500).json({ error: "Failed to fetch image" });
    }
  });

  app.put("/api/images/:imageId/rename", async (req, res) => {
    const { imageId } = req.params;
    const { newName } = req.body;
    const Max_length = 100;
    if(!newName || newName.length === 0){
        return res.status(400).send({
        error: "Bad Request",
        message: "The New Name is required and cannot be empty."
    });
    }
    if(newName.length > Max_length){
        return res.status(413).send({
            error: "Bad Request",
            message: `The New Name cannot exceed ${Max_length} characters.`
        });
    }
    if(!ObjectId.isValid(imageId)){
        return res.status(404).send({
            error: "Bad Request",
            message: "The provided imageId is not valid."
        });
    }

    await waitDuration(1000);
    const matched_count= await imageProvider.renameImage(imageId, newName);
    if(matched_count === 0){
        return res.status(404).send({
            error: "Not Found",
            message: "No image found with the provided imageId."
        });
    }
    res.status(204).send();

  });
}
