import Sequelize, { Model } from "sequelize";
class User extends Model {
    static init(sequelize) {
        super.init({
            nomeUser: Sequelize.STRING,
            emailUser: Sequelize.STRING,
            passwordUser: Sequelize.STRING,
            tipoUser: Sequelize.BOOLEAN,
        }, {
            sequelize,
            }
        );
    }
}

export default User;