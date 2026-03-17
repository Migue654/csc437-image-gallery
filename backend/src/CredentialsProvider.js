
import { getEnvVar } from "./getEnvVar.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

export class CredentialsProvider {
    constructor(mongoClient) {
        this.mongoClient= mongoClient; //saves the client passed in
        const credentials = getEnvVar("CREDS_COLLECTION_NAME"); //request the collection from the DB
        this.credentials = this.mongoClient.db().collection(credentials); //(connects to the collection).(gets refrence to collection).(saves the collection for later use to this.collection)

        const usersCollectionName = getEnvVar("USERS_COLLECTION_NAME"); // get users collection name from env
        this.usersCollection = this.mongoClient.db().collection(usersCollectionName); // save users collection for later
    }


    async registerUser(username,email,password){
        const existingUser = await this.credentials.findOne(
        {   username:username,


        }) // checks the db to see if the user already exist before adding
        if(existingUser){
            return false;// user already exists
        }
        const salt = bcrypt.genSaltSync(10); // generates a salt for hashing the password
        const hashedPassword = await bcrypt.hash(password, salt); // hashes the password with the generated salt

        await this.credentials.insertOne({
            username:username,
            password:hashedPassword
        })
        await this.usersCollection.insertOne({
            username:username,
            email:email
        })
        return true;// user successfully registered
    }
    async authenticateUser(username,password){
        const user = await this.credentials.findOne(
        {
            username:username
        });
        if(!user){
            return false; // the useer is not in the db
        }
        const passwordVer= await bcrypt.compare(password,user.password); // compares the input password with the hashed password in the db

        return passwordVer; // returns true if the password is correct, false otherwise
    }

}
