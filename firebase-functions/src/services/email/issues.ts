import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend';

type IssueData = {
  client: string;
  id: string;
  link: string;
};

const getPlainText = (data: IssueData) =>
  `Un nuovo modulo e' stato aggiunto.\n\nCliente: ${data.client}\nId: ${data.id}\nVedilo su ${data.link}`;
const getHtml = (data: IssueData) =>
  `<h1>Un nuovo modulo e' stato aggiunto.</h1>\n\n
		<p>Cliente: ${data.client}</p>
		<p>Id: ${data.id}</p>
		<p>Vedilo su <a href="${data.link}">${data.link}</a></p>
	`;

const sentFrom = new Sender('interno@pieroni.it', 'Servizio intranet');

export const sendIssueCreation = async (
  transporter: MailerSend,
  recipient: string,
  data: IssueData
) => {
  try {
    const emailTo = new Recipient(recipient);

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo([emailTo])
      .setReplyTo(sentFrom)
      .setSubject('Nuovo modulo aggiunto')
      .setHtml(getHtml(data))
      .setText(getPlainText(data));

    await transporter.email.send(emailParams);
  } catch (e) {
    console.error(e);
    throw e;
  }
};
