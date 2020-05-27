import * as Yup from 'Yup';
import {parseISO, startOfHour, isBefore} from "date-fns";
import User from "../models/User";
import Agendamento from "../models/Agendamento";
import File from "../models/File";

class AgendamentoController {
    async index(request, response) {
        const agendamentos = await Agendamento.findAll({
            where: {
                userId:  request.userId, canceledAt: null
            },
            order: ['date'],
            attributes: ['id', 'date'],
            include: [
                {
                    model: User,
                    as: 'recurso',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: File,
                            as: 'avatar',
                            attributes: ['id','path','url'],
                        }
                    ]
                }
            ]

        })
        return response.json(agendamentos);
    }


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

        const horaInicio =  startOfHour(parseISO(date));
        if (isBefore(horaInicio, new Date())) {
            return response.status(400).json({ erro: "Não é possivel agendar datas no passado"});
        }

        const checkDisponibilidade = await Agendamento.findOne({
            where: {
                recursoId,
                canceledAt: null,
                date: horaInicio,
            }
        })

        if (checkDisponibilidade) {
            return response.status(400).json({ erro: "Horario não disponivel para agendamento"});
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