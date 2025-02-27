import * as Print from 'expo-print';

interface ConsentPDFData {
  header: {
    date: string;
    time: string;
    ip: string;
    mask: string;
    mac: string;
  };
  cpf: string;
  rg: string;
  birthDate: string;
  responses: { [key: string]: string };
  signature: string;
}

export async function generatePDF(data: ConsentPDFData): Promise<string> {
  const responsesHtml = Object.entries(data.responses)
    .map(
      ([questionId, answer]) =>
        `<p><strong>${questionId}:</strong> ${answer}</p>`
    )
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; margin-bottom: 20px; }
          .section { margin-bottom: 20px; }
          .signature { text-align: center; margin-top: 20px; }
          .signature img { width: 200px; border: 1px solid #ccc; }
        </style>
      </head>
      <body>
        <h1>Formulário de Questionário e Consentimento</h1>
        <div class="section">
          <h2>Informações do Dispositivo</h2>
          <p><strong>Data:</strong> ${data.header.date}</p>
          <p><strong>Hora:</strong> ${data.header.time}</p>
          <p><strong>IP:</strong> ${data.header.ip}</p>
          <p><strong>Máscara:</strong> ${data.header.mask}</p>
          <p><strong>MAC:</strong> ${data.header.mac}</p>
        </div>
        <div class="section">
          <h2>Dados Pessoais</h2>
          <p><strong>CPF:</strong> ${data.cpf}</p>
          <p><strong>RG:</strong> ${data.rg}</p>
          <p><strong>Data de Nascimento:</strong> ${data.birthDate}</p>
        </div>
        <div class="section">
          <h2>Respostas do Questionário</h2>
          ${responsesHtml}
        </div>
        <div class="section signature">
          <h2>Assinatura</h2>
          <img src="data:image/png;base64,${data.signature}" alt="Assinatura" />
        </div>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    return uri;
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  }
}
