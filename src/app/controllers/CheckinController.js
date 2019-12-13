import { subDays } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    const { student_id } = req.body;

    const studentExist = await Student.findByPk(student_id);

    if (!studentExist) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const verifyCheckin = await Checkin.findAndCountAll({
      where: {
        student_id,
        created_at: {
          [Op.between]: [subDays(new Date(), 7), new Date()],
        },
      },
      include: [
        {
          model: Student,
          as: 'checkin',
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
      student_id,
    });

    return res.json(checkin);
  }
}
export default new CheckinController();
