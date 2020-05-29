import * as Yup from 'Yup';
import {parseISO, startOfHour, isBefore, format, subHours} from "date-fns";
import ptbr from 'date-fns/locale/pt-BR';
import User from "../models/User";
import Agendamento from "../models/Agendamento";
import File from "../models/File";
import Notification from "../schemas/Notification";

class AgendamentoController {
    async index(request, response) {
        const { page =1 } = request.query;
        const agendamentos = await Agendamento.findAll({
            where: {
                userId:  request.userId, canceledAt: null
            },
            order: ['date'],
            attributes: ['id', 'date'],
            limit: 20,
            offset: (page - 1) * 20,
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

        //Notificação do recurso agendado
        const user = await User.findByPk(request.userId);
        const formattedDate = format(horaInicio, "dd 'de' MMMM', às' H:mm'h'",{ locale: ptbr});
        await Notification.create({
            content: `Novo agendamento adicionado para o recurso ${user.name} para o dia ${formattedDate}`,
            user: recursoId,
        });

        response.json(agendamento);
    }

    async delete(request, response) {
        const agendamento = await Agendamento.findByPk(request.params.id);

        if (agendamento.userId !== request.userId) {
            return response.status(401).json({ erro: "Vodê não tem permissão para cancelar este agendamento"});
        }

        const tempoMinimoCancelamento = subHours(agendamento.date, 2);

        if (isBefore(tempoMinimoCancelamento, new Date())) {
            return response.status(401).json({ erro: "Você só pode cancelar agendamentos com no mínimo 2h de antecedência."});
        }

        agendamento.canceledAt = new Date();

        await agendamento.save();

        return response.json(agendamento);
    }

}

export default new AgendamentoController();