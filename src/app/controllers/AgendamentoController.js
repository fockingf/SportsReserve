import Agendamento from "../models/Agendamento";
import * as Yup from 'Yup';
import User from "../models/User";

class AgendamentoController {
    async store(request, response) {
        const schema = Yup.object().shape({
            recursoId: Yup.number().required(),
            date: Yup.date().required(),
        });

        if (!(await schema.isValid(request.body))) {
            return response.status(400).json({ erro: "Erro de validação nos campos"});
        }

        const { recursoId, date } = request.body;

        // checa se o cadastro é um recurso
        const isRecurso = await User.findOne({
            where: { id: recursoId, recurso: true },
        })

        if (!isRecurso) {
            return response.status(401).json({ erro: "Voce só consegue criar agendamentos com recursos"})
        }

        const agendamento = await Agendamento.create({
            userId: request.userId,
            recursoId,
            date
        })

        response.json(agendamento);
    }

}

export default new AgendamentoController();