import User from "../models/User";

class UserController {
    async store(req, res) {

        const userExists = await User.findOne({ where: { emailUser: req.body.emailUser} });

        if(userExists) {
            return res.status(400).json({ erro: 'Email já existe, favor cadastrar outro'});
        }

        const {id, nomeUser, emailUser} = await User.create(req.body);

        return res.json({
            id,
            nomeUser,
            emailUser,
        });
    }
}
export default new UserController();