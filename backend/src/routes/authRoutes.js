
import jwt from "jsonwebtoken";
import { getEnvVar } from "../getEnvVar.js";

/**
 * Creates a Promise for a JWT token, with a specified username embedded inside.
 *
 * @param username the username to embed in the JWT token
 * @return a Promise for a JWT
 */
function generateAuthToken(username) {
    return new Promise((resolve, reject) => {
        const payload = {
            username
        };
        jwt.sign(
            payload,
            getEnvVar("JWT_SECRET"),
            { expiresIn: "1d" },
            (error, token) => {
                if (error) reject(error);
                else resolve(token);
            }
        );
    });
}

export function registerAuthRoutes(app,CredentialsProvider) {
    app.post("/api/users", async (req, res) => {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Username, email, and password are required." });
        }
        const registrationSuccess = await CredentialsProvider.registerUser(username, email, password);
        if (!registrationSuccess) {
            return res.status(409).json({ error: "Username already exists." });
        }
        const token = await generateAuthToken(username);
        res.status(201).json({ token });
    });

    app.post ("/api/auth/tokens", async (req,res)=>{

        const {username,password} = req.body;
        if(!username || !password){
            return res.status(400).json({error:"Username or Password is not Valid"});
        }
        const auth = await CredentialsProvider.authenticateUser(username,password);
        if(!auth){
            return res.status(401).json({error:"Invalid username or password"});
        }
        const token = await generateAuthToken(username);
        res.status(200).json({ token });

    });

}
