import Sequelize, { Model } from 'sequelize';

class Plan extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        duration: Sequelize.INTEGER,
        price: Sequelize.FLOAT,
        active: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
  }
}
export default Plan;
