import Sequelize, { Model } from "sequelize";
import bcrypt from 'bcryptjs';
class User extends Model {
    static init(sequelize) {
        super.init({
            nomeUser: Sequelize.STRING,
            emailUser: Sequelize.STRING,
            password: Sequelize.VIRTUAL,
            passwordUser: Sequelize.STRING,
            tipoUser: Sequelize.BOOLEAN,
        }, {
            sequelize,
            }
        );
        this.addHook('beforeSave',async (user) => {
            if (user.password) {
                user.passwordUser = await bcrypt.hash(user.password, 8);
            }
        })
        return this;
    }

    static associate(models) {
        this.belongsTo(models.File, { foreignKey: 'avatarId'});
    }

    checkPassword(password) {
        return bcrypt.compare(password, this.passwordUser);
    }
}

export default User;