import Enrollment from '../models/Enrollment';

class EnrollmentController {
  async index(req, res) {
    return res.json({ message: 'Loading...' });
  }

  async show(req, res) {
    return res.json({ message: 'Loading...' });
  }

  async store(req, res) {
    const { student_id } = req.body;

    const alreadyEnrolled = await Enrollment.findOne({
      where: { student_id },
    });

    if (alreadyEnrolled) {
      return res
        .status(401)
        .json({ error: 'This Student is already  enrolled ' });
    }

    const enrollment = await Enrollment.create(req.body);

    return res.json(enrollment);

    /**
     * student_id
     * plan_id
     * start_date
     * end_date
     * price
     *
     */
  }

  async update(req, res) {
    return res.json();
  }

  async delete(req, res) {
    return res.json();
  }
}
export default new EnrollmentController();
