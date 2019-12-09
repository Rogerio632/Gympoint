import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll({
      where: { active: true },
      attributes: ['id', 'title', 'duration', 'price', 'active'],
    });

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

  async store(req, res) {}

  async update(req, res) {}

  async delete(req, res) {}
}
export default new PlanController();
