import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from "../../config/auth";

export default async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ erro: "Token not provided"});
    }

    const [ , token ] = authHeader.split(' ');

     console.log(authHeader);
     console.log(token);


    try {
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);

        console.log(decoded);

        req.userId = decoded.id;

        return next();

    }catch (e) {
        return res.status(401).json({ erro: "Invalid Token"});
    }
    // return next();
}
