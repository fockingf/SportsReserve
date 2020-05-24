import jwt from 'jsonwebtoken';
import User from "../models/User";


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
            // sercret gerado da frase 'sportsreserve' no md5online: https://www.md5online.org/
            token: jwt.sign({id}, '1515d998e182df3988786b26248e6890', {
                expiresIn: '7d',
            }),
        })
    }
}

export default new SessionController();