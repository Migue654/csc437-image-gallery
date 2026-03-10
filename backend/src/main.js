import express from "express";
import { getEnvVar } from "./getEnvVar.js";
import { SHARED_TEST } from "./shared/example.js";
import { Valid_Routes } from "./shared/ValidRoutes.js";
import { registerImageRoutes } from "./routes/imageRoutes.js";
import { MongoClient } from "mongodb";
import { ImageProvider } from "./ImageProvider.js";

const PORT = Number.parseInt(getEnvVar("PORT", false), 10) || 3000;
const STATIC_DIR = getEnvVar("STATIC_DIR") || "public";
const app = express();
app.use(express.static(STATIC_DIR));
app.use(express.json());


const mongoUser = getEnvVar("MONGO_USER");
const mongoPwd = getEnvVar("MONGO_PWD");
const mongoCluster = getEnvVar("MONGO_CLUSTER");
const dbName = getEnvVar("DB_NAME");

const uri = `mongodb+srv://${mongoUser}:${mongoPwd}@${mongoCluster}/?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(uri, { dbName }); // pass dbName here
await mongoClient.connect();
const imageProvider = new ImageProvider(mongoClient);


app.get("/api/hello", (req, res) => {
    res.send("Hello, World " + SHARED_TEST);
});

app.get(Object.values(Valid_Routes), (req, res) => {
    res.sendFile("index.html", { root: STATIC_DIR });
});

registerImageRoutes(app, imageProvider);


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}.  CTRL+C to stop.`);
});
