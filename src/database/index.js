import 'dotenv/config';
import Sequelize from "sequelize";
import mongoose from 'mongoose';
import User from "../app/models/User";
import File from "../app/models/File";
import databaseConfig from '../config/database';
import Agendamento from "../app/models/Agendamento";

const models = [User, File, Agendamento];

class Database {
    constructor() {
        this.init();
        this.mongo();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);
        models.map(model => model.init(this.connection))
            .map(model => model.associate && model
            .associate(this.connection.models));
    }

    mongo() {
        this.mongoConnection = mongoose.connect(process.env.MONGO_URL,
            {
                useNewUrlParser: true,
                useFindAndModify: true,
                useUnifiedTopology: true
            }
        )
    }
}

export default new Database();