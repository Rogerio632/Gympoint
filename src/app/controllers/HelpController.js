import * as Yup from 'yup';
import Help from '../models/Help';
import Student from '../models/Student';

class HelpController {
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

    const submitHelp = await Help.findAll({
      where: { student_id: 1 },
    });

    return res.status(201).json(submitHelp);
  }
}
export default new HelpController();
