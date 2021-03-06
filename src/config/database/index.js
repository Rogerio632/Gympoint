import Sequelize from 'sequelize';
import 'dotenv';
import User from '../../app/models/User';
import Student from '../../app/models/Student';
import Plan from '../../app/models/Plan';
import Enrollment from '../../app/models/Enrollment';
import Checkin from '../../app/models/Checkin';
import Help from '../../app/models/Help_order';
import databaseConfig from '../database';

const models = [Enrollment, User, Student, Plan, Checkin, Help];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
