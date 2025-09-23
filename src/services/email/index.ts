import nodemailer from 'nodemailer';

type RiscossoData = {
  client: string;
  total: number;
  id: string;
  link: string;
};

const address = 'matteopieroni6@gmail.com';

const getPlainText = (data: RiscossoData) =>
  `Un nuovo riscosso e' stato aggiunto.\n\nCliente: ${data.client}\nImporto: ${data.total}\nId: ${data.id}\nVedilo su ${data.link}`;
const getHtml = (data: RiscossoData) =>
  `<h1>Un nuovo riscosso e' stato aggiunto.</h1>\n\n
		<p>Cliente: ${data.client}</p>
		<p>Importo: ${data.total}</p>
		<p>Id: ${data.id}</p>
		<p>Vedilo su <a href="${data.link}">${data.link}</a></p>
	`;

export const sendRiscossoCreation = async (data: RiscossoData) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_APP_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.verify();

    const send = await transporter.sendMail({
      to: address,
      subject: 'Nuovo riscosso aggiunto',
      text: getPlainText(data),
      html: getHtml(data),
    });

    if (!send.accepted.some((acceptedAddress) => acceptedAddress === address)) {
      throw new Error('Rejected send');
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
};
