import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Some is not valid' });
    }
    const { email } = req.body;

    const student = await Student.findOne({ where: { email } });

    if (student) {
      return res.status(401).json({ error: 'This email is already in use' });
    }

    Student.create(req.body);

    return res.status(201).json(req.body);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number(),
      weight: Yup.number(),
      height: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro na validação' });
    }

    const { id, email } = req.body;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'This student does not exists' });
    }
    if (email !== student.email) {
      const studentExist = await Student.findOne({ where: { email } });

      if (studentExist) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }
    const update = await student.update(req.body);

    return res.json(update);
  }
}
export default new StudentController();
