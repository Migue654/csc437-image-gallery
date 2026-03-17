import express from "express";

import { ObjectId } from "mongodb";
import { imageMiddlewareFactory, handleImageFileErrors } from "../imageUploadMiddleware.js";

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

    const image = await imageProvider.getOneImage(imageId); // get the image we want to check for ownership
    if(!image){
      return res.status(404).send({
        error: "Not Found",
        message: "No image found with the provided imageId."
      });
    }

    if (image.authorId !== req.userInfo.username) { // compare owner to logged in user
    return res.status(403).send({
        error: "Forbidden",
        message: "This user does not own this image"
    });
}


    await waitDuration(1000);
    await imageProvider.renameImage(imageId, newName);

    res.status(204).send();

  });

  app.post(
    "/api/images",
    imageMiddlewareFactory.single("image"),
    handleImageFileErrors,
    async (req, res) => {
         if (!req.file || !req.body.name) {
        return res.status(400).send({
            error: "Bad Request",
            message: "Missing image file or name"
        });
    }
    const newImageId = await imageProvider.createImage(
        `/uploads/${req.file.filename}`,
        req.body.name,
        req.userInfo.username
    );
    res.status(201).json({ id: newImageId });
    }
);
}
