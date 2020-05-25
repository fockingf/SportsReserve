import jwt from 'jsonwebtoken';
import User from "../models/User";
import authConfig from "../../config/auth";


class SessionController {
    async store(req, res) {
        const { emailUser, password } = req.body;

        const user = await User.findOne({ where: { emailUser} });

        if (!user) {
            return res.status(401).json({ erro: "Usuário não encontrado!"});
        }

        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ erro: "Senha inválida!"});
        }

        const { id, nomeUser } = user;

        return res.json({
            user: {
                id,
                nomeUser,
                emailUser,
            },
            token: jwt.sign({id}, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        })
    }
}

export default new SessionController();