import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class WelcomeMail {
  get key() {
    return 'WelcomeMail';
  }

  async handle({ data }) {
    const { enrollment, findStudent, plan } = data;

    const formatedDate = parseISO(enrollment.end_date);

    await Mail.sendMail({
      to: `${findStudent.name} <${findStudent.email}>`,
      subject: `Sua vida fitness começa agora! [Gympoint]`,
      template: 'enrollment-welcome',
      context: {
        plan: plan.title,
        price: enrollment.price,
        end_date: format(formatedDate, "dd 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
      },
    });
  }
}
export default new WelcomeMail();
