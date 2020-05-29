import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import FileController from "./app/controllers/FileController";
import RecursoController from "./app/controllers/RecursoController";

import authMiddleware from "./app/middlewares/auth";
import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import AgendamentoController from "./app/controllers/AgendamentoController";
import AgendaController from "./app/controllers/AgendaController";
import NotificationController from "./app/controllers/NotificationController";

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// a partir daqui, apenas usuarios autenticados tem acesso a essas rotas.
routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/recursos', RecursoController.index);

routes.get('/agendamentos', AgendamentoController.index);
routes.post('/agendamentos', AgendamentoController.store);
routes.delete('/agendamentos/:id', AgendamentoController.delete);

routes.get('/agenda', AgendaController.index);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;