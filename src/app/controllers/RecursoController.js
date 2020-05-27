import User from "../models/User";
import File from "../models/File";

class RecursoController {
    async index(request, response) {
        const admin = await User.findAll({
            where: { recurso: true },
            attributes: ['id', 'name', 'email', 'avatarId'],
            include: [{
                model: File,
                as: 'avatar',
                attributes: ['name', 'path', 'url']
            }]
        })
        return response.json(admin);
    }
}

export default new RecursoController();