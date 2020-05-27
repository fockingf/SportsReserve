import Sequelize, { Model } from 'sequelize';

class Agendamento extends Model {
    static init(sequelize) {
        super.init({
                date: Sequelize.DATE,
                canceledAt: Sequelize.DATE,
            }, {
                sequelize,
            }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'userId', as: 'user'})
        this.belongsTo(models.User, { foreignKey: 'recursoId', as: 'recurso'})
    }
}

export default Agendamento;