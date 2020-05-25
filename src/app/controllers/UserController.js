import User from "../models/User";

class UserController {
    async store(req, res) {

        const userExists = await User.findOne({ where: { emailUser: req.body.emailUser} });

        if(userExists) {
            return res.status(400).json({ erro: 'Email já existe, favor cadastrar outro'});
        }

        const {id, nomeUser, emailUser, tipoUser} = await User.create(req.body);

        return res.json({
            id,
            nomeUser,
            emailUser,
            tipoUser,
        });
    }

    async update(req, res) {

        const { emailUser, oldPassword } = req.body;

        const user = await User.findByPk(req.userId);

        if (emailUser !== user.emailUser) {
            const userExists = await User.findOne({ where: { emailUser } });

            if(userExists) {
                return res.status(400).json({ erro: 'Email já existe, favor cadastrar outro'});
            }
        }
        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(401).json({ erro: "Senha antiga não confere"});
        }

        const {id, nomeUser, tipoUser } = await user.update(req.body);

        return res.json({
            id,
            nomeUser,
            emailUser,
            tipoUser
        });
    }
}
export default new UserController();