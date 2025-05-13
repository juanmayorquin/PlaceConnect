import nodemailer from 'nodemailer';

async function testMail() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'juanjosemayorquincabrera@gmail.com',
      pass: 'xynusznrprninnyp'
    }
  });

  try {
    const info = await transporter.sendMail({
      from: '"PlaceConnect" <juanjosemayorquincabrera@gmail.com>',
      to: 'tu_otro_correo@gmail.com',
      subject: 'Prueba de correo',
      text: '¡Funciona!',
    });

    console.log('Correo enviado:', info.messageId);
  } catch (error) {
    console.error('Error al enviar:', error);
  }
}

testMail();