import { MongoClient } from "mongodb";
import { getEnvVar } from "./getEnvVar.js";
import { ObjectId } from "mongodb";
export class ImageProvider {
  constructor(mongoClient) {
    this.mongoClient = mongoClient;
    const collectionName = getEnvVar("IMAGES_COLLECTION_NAME");
    this.collection = this.mongoClient.db().collection(collectionName);
  }

  getAllImages() {
    const pipeline = [];
    // Without any options or filters passed to it, find() will get all documents in the collection.
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "authorId",
        foreignField: "username",
        as: "author",
      },
    });
    pipeline.push({
      $unwind: {
        path: "$author",
      },
    });

    // return this.collection.find().toArray();
    return this.collection.aggregate(pipeline).toArray();
  }
  async getOneImage(imageId) {
    // Do keep in mind the type of _id in the DB is ObjectId, not string
    // Use `new ObjectId(imageId)` to convert a string to an ObjectId.
    // import { ObjectId } from "mongodb"
    const pipeline=[];
    if(!ObjectId.isValid(imageId)){

        return null;
    }
    pipeline.push({ $match:{_id: new ObjectId(imageId)} });
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "authorId",
        foreignField: "username",
        as: "author",
      },
    });
    pipeline.push({
      $unwind: {
        path: "$author",
      },
    });
    const results = await this.collection.aggregate(pipeline).toArray();
    return results[0] || null;

    //db.images.findOne({ _id: new ObjectId(imageId) });

    }
    async renameImage(imageId, newName) {


        const result = await this.collection.updateOne(
            { _id: new ObjectId(imageId) },
            { $set: { name: newName } }
        );
        return result.matchedCount;

    }

}
