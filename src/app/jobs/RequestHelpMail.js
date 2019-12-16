import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class RequestHelpMail {
  get key() {
    return 'requestHelpMail';
  }

  async handle({ data }) {
    const { student, question } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: `Pedido de Auxílio Recebido! [Gympoint]`,
      template: 'request-help',
      context: {
        student: student.name,
        question,
        date: format(new Date(), "dd 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
      },
    });
  }
}
export default new RequestHelpMail();
