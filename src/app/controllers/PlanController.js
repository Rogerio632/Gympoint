import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll({
      where: { active: true },
      attributes: ['id', 'title', 'duration', 'price', 'active'],
    });

    if (!plans) {
      return res.json({ error: 'No one plan has been founded' });
    }

    return res.json(plans);
  }

  async show(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({
        error:
          'The ID expects a number to be passed, but a text value was received.',
      });
    }

    const { id } = req.params;

    const findPlan = await Plan.findOne({
      where: {
        id,
      },
    });

    if (!findPlan) {
      return res.status(400).json({ error: 'Plan not found' });
    }

    return res.json(findPlan);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'You writed something wrong.' });
    }

    const { title, duration, price } = req.body;
    const savePlan = await Plan.create({
      title,
      duration,
      price,
      active: true,
    });

    return res.status(201).json(savePlan);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'You writed something wrong' });

    const { id } = req.params;

    const plan = await Plan.findOne({
      where: { id },
    });

    if (!plan) {
      return res.status(400).json({ error: 'This plan does not exists' });
    }

    plan.update(req.body);

    return res.json(plan);
  }

  async delete(req, res) {
    const { id } = req.params;

    const plan = await Plan.findOne({
      where: { id },
    });

    if (!plan) {
      return res.status(400).json({ error: 'Plan not found' });
    }

    plan.destroy();

    return res.json({ message: 'Plan deleted!' });
  }
}
export default new PlanController();
