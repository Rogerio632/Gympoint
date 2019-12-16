import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class AnswerHelpMail {
  get key() {
    return 'AnswerHelpMail';
  }

  async handle({ data }) {
    const { student, submitAnswer } = data;

    const answer_at = parseISO(submitAnswer.answer_at);

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: `Pedido de auxílio respondido! [Gympoint]`,
      template: 'answer-help',
      context: {
        student: student.name,
        question: submitAnswer.question,
        answer: submitAnswer.answer,
        answer_at: format(answer_at, "dd 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
      },
    });
  }
}
export default new AnswerHelpMail();
