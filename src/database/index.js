import Sequelize from "sequelize";
import User from "../app/models/User";
import File from "../app/models/File";
import databaseConfig from '../config/database';
import Agendamento from "../app/models/Agendamento";

const models = [User, File, Agendamento];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);
        models.map(model => model.init(this.connection))
        .map(model => model.associate && model.associate(this.connection.models));

    }
}

export default new Database();