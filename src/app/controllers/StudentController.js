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

  async update(req, res) {}
}
export default new StudentController();
