import * as Yup from 'yup';
import Help from '../models/Help_order';
import Student from '../models/Student';

class HelpController {
  async index(req, res) {
    const { page } = req.query;

    const findHelpOrders = await Help.findAll({
      where: {
        answer: null,
        answer_at: null,
      },
      attributes: ['id', 'question', 'created_at'],
      order: [['created_at', 'desc']],
      include: [
        {
          model: Student,
          attributes: ['id', 'name', 'email'],
          as: 'student',
        },
      ],
      limit: 5,
      offset: (page - 1) * 5,
    });

    if (!findHelpOrders) {
      return res.json({ message: "Don't have any ticket pending" });
    }

    return res.json(findHelpOrders);
  }

  async show(req, res) {
    const { id } = req.params;

    const studentExist = await Student.findByPk(id);

    if (!studentExist) {
      return res.status(400).json({ message: 'Student does not exist' });
    }

    const HelpOrdersByUser = await Help.findAll({
      where: {
        student_id: id,
      },
      order: [['created_at', 'desc']],
    });

    if (HelpOrdersByUser.length === 0) {
      return res.json({ message: "This user doesn't have any ticket to show" });
    }

    return res.json(HelpOrdersByUser);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    const { id } = req.params;

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Make sure you are not missing any fill' });
    }

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found.' });
    }

    const { question } = req.body;

    const submitHelp = await Help.create({
      student_id: id,
      question,
    });

    return res.status(201).json(submitHelp);
  }
}
export default new HelpController();
