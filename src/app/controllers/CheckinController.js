import { subDays } from 'date-fns';
import { Op } from 'sequelize';
import * as Yup from 'yup';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'ID is missing' });
    }

    const { id } = req.params;

    const studentExist = await Student.findByPk(id);

    if (!studentExist) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const currentDate = new Date();

    const verifyCheckin = await Checkin.findAndCountAll({
      where: {
        student_id: id,
        created_at: {
          [Op.between]: [subDays(currentDate, 7), currentDate],
        },
      },
      include: [
        {
          model: Student,
          as: 'student_checkin',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (verifyCheckin.count >= 5) {
      return res.status(401).json({
        message: 'You already have five check-ins in a seven day period ',
      });
    }

    const checkin = await Checkin.create({
      student_id: id,
    });

    return res.json(checkin);
  }

  async show(req, res) {
    const { id } = req.params;

    /**
     * trazer todos os checkins de um estudante
     */

    const student = Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const showCheckins = await Checkin.findAll({
      where: {
        student_id: id,
      },
      order: [['created_at', 'desc']],
    });

    if (showCheckins.length === 0) {
      return res.json({ message: "This Student doesn't have any checkin yet" });
    }

    return res.json(showCheckins);
  }
}
export default new CheckinController();
