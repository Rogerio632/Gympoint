import * as Yup from 'yup';
import AnswerHelpMail from '../jobs/AnswerHelpMail';
import Queue from '../../lib/Queue';
import Help from '../models/Help_order';
import Student from '../models/Student';

class AnswerController {
  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        message: 'A error has been found. Please fix it and try again',
      });
    }
    const { id } = req.params;

    const helpOrder = await Help.findByPk(id);

    const { answer } = req.body;

    const submitAnswer = await helpOrder.update({
      answer,
      answer_at: new Date(),
    });

    const student = await Student.findByPk(submitAnswer.student_id);

    await Queue.add(AnswerHelpMail.key, {
      student,
      submitAnswer,
    });

    return res.status(201).json(submitAnswer);
  }
}
export default new AnswerController();
