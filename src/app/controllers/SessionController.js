import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from "../models/User";
import authConfig from "../../config/auth";


class SessionController {
    async store(req, res) {

        const schema = Yup.object().shape({
            emailUser: Yup.string().email().required(),
            password: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ erro: "Campos inválidos"});
        }

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