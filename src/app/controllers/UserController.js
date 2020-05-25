import * as Yup from 'yup';
import User from "../models/User";

class UserController {
    async store(req, res) {
        //validação de campos com a biblioteca Yup
        const schema = Yup.object().shape({
            nomeUser: Yup.string().required(),
            emailUser: Yup.string().email().required(),
            password: Yup.string().required().min(6),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ erro: "Falha na validação dos campos"});
        }

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

        //validação de campos com a biblioteca Yup
        const schema = Yup.object().shape({
            nomeUser: Yup.string(),
            emailUser: Yup.string().email(),
            oldPassword: Yup.string().min(6),
            password: Yup.string().min(6)
                .when('oldPassword', (oldPassword, field) =>
                oldPassword ? field.required() : field
                ),
            confirmPassword: Yup.string().when('password', (password, field) =>
            password ? field.required().oneOf([Yup.ref('password')]) : field ),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ erro: "Falha na validação dos campos"});
        }

        const { emailUser, oldPassword } = req.body;

        const user = await User.findByPk(req.userId);

        if (emailUser !== user.emailUser) {

            const userExists = await User.findOne({where: emailUser});

            if (userExists) {
                return res.status(400).json({ erro: "Email já existe, favor cadastrar outro"});
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