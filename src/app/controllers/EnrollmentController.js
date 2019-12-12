import * as Yup from 'yup';
import { parseISO, isBefore, addMonths, startOfHour, format } from 'date-fns';
import { pt } from 'date-fns/locale/pt';
import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';
import Mail from '../../lib/mail';

class EnrollmentController {
  async index(req, res) {
    const { page } = req.query;

    const enrollments = await Enrollment.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price'],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: Student,
          attributes: ['id', 'name'],
          as: 'student',
        },
        {
          model: Plan,
          attributes: ['id', 'title'],
          as: 'plan',
        },
      ],
    });

    return res.json(enrollments);
  }

  async show(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'ID is missing' });
    }

    const { id } = req.params;

    const enrollment = await Enrollment.findOne({
      where: { id },
      attributes: ['id', 'start_date', 'end_date', 'price', 'active'],
      include: [
        {
          model: Student,
          attributes: ['name'],
          as: 'student',
        },
        {
          model: Plan,
          attributes: ['title'],
          as: 'plan',
        },
      ],
    });
    if (!enrollment) {
      return res.status(400).json({ error: 'Any enroll has been found!' });
    }

    return res.json(enrollment);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { student_id, start_date, plan_id } = req.body;

    const findStudent = await Student.findOne({
      where: { id: student_id },
    });

    if (!findStudent) {
      return res
        .status(400)
        .json({ error: 'Oh! This student does not exists' });
    }

    const alreadyEnrolled = await Enrollment.findOne({
      where: { student_id },
    });

    if (alreadyEnrolled) {
      return res.status(401).json({
        error:
          'This Student is already  enrolled and not be able to do another enrollment',
      });
    }

    const begin_date = startOfHour(parseISO(start_date));

    if (isBefore(begin_date, new Date())) {
      return res.status(400).json({ error: 'Please, select a valid date' });
    }

    const plan = await Plan.findOne({
      where: { id: plan_id, active: true },
      attributes: ['title', 'duration', 'price'],
    });

    const end_date = addMonths(begin_date, plan.duration);
    const price = plan.duration * plan.price;

    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    await Mail.sendMail({
      to: `${findStudent.name} <${findStudent.email}>`,
      subject: `Sua vida fitness começa agora![Gympoint]`,
      template: 'cancellation',
      context: {
        plan: plan.title,
        price,
        end_date: format(end_date, "dd 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
      },
    });

    return res.json(enrollment);
  }

  async update(req, res) {
    const { id } = req.params;
    const { plan_id, start_date } = req.body;

    const enrollment = await Enrollment.findByPk(id);

    if (!enrollment) {
      return res.status(400).json({ error: 'enrollment not found' });
    }

    const begin_date = startOfHour(parseISO(start_date));

    if (isBefore(begin_date, new Date())) {
      return res.status(400).json({ error: 'Please, select a valid date' });
    }

    const plan = await Plan.findOne({
      where: { id: plan_id, active: true },
      attributes: ['duration', 'price'],
    });

    const end_date = addMonths(begin_date, plan.duration);
    const price = plan.duration * plan.price;

    await enrollment.update({ plan_id, start_date, end_date, price });

    return res.json();
  }

  async delete(req, res) {
    const { id } = req.params;

    const enrollment = Enrollment.findByPk(id);

    enrollment.destroy();

    return res.json({ message: 'Deleted with success' });
  }
}
export default new EnrollmentController();
