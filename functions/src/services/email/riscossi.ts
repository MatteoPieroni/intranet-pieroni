import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend';

type RiscossoData = {
  client: string;
  total: number;
  id: string;
  link: string;
};

const getPlainText = (data: RiscossoData) =>
  `Un nuovo riscosso e' stato aggiunto.\n\nCliente: ${data.client}\nImporto: ${data.total}\nId: ${data.id}\nVedilo su ${data.link}`;
const getHtml = (data: RiscossoData) =>
  `<h1>Un nuovo riscosso e' stato aggiunto.</h1>\n\n
		<p>Cliente: ${data.client}</p>
		<p>Importo: ${data.total}</p>
		<p>Id: ${data.id}</p>
		<p>Vedilo su <a href="${data.link}">${data.link}</a></p>
	`;

const sentFrom = new Sender('interno@pieroni.it', 'Servizio intranet');

export const sendRiscossoCreation = async (
  transporter: MailerSend,
  recipient: string,
  data: RiscossoData
) => {
  try {
    const emailTo = new Recipient(recipient);

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo([emailTo])
      .setReplyTo(sentFrom)
      .setSubject('Nuovo riscosso aggiunto')
      .setHtml(getHtml(data))
      .setText(getPlainText(data));

    await transporter.email.send(emailParams);
  } catch (e) {
    console.error(e);
    throw e;
  }
};
