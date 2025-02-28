import * as Print from 'expo-print';

export interface ConsentPDFData {
  header: {
    date: string;
    time: string;
    ip: string;
    mask: string;
    mac: string;
    formatted: string;
  };
  cpf: string;
  rg: string;
  birthDate: string;
  responses: { [key: string]: any };
  signature: string;
}

export async function generatePDF(data: ConsentPDFData): Promise<string> {
  const responsesHtml = Object.entries(data.responses)
    .map(([question, answer]) => {
      if (typeof answer === 'object' && answer !== null) {
        const subResponses = Object.entries(answer)
          .map(
            ([subQuestion, subAnswer]) =>
              `<p style="margin-left:20px;"><strong>${subQuestion}:</strong> ${subAnswer}</p>`
          )
          .join('');
        return `<div style="margin-bottom:10px;"><p><strong>${question}:</strong></p>${subResponses}</div>`;
      }
      return `<p style="margin-bottom:10px;"><strong>${question}:</strong> ${answer}</p>`;
    })
    .join('');

  const signatureSrc = data.signature.startsWith('data:image')
    ? data.signature
    : `data:image/png;base64,${data.signature}`;

  const htmlContent = `
    <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Formulário de Questionário e Consentimento</title>
    <style>
      /* Aumenta a altura da folha definindo um tamanho customizado */
      @page {
        margin: 10mm;
        size: 210mm 297; /* 210mm de largura x 400mm de altura */
      }
      body {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 10pt;
        color: #333;
        line-height: 1.5;
        margin: 0;
        padding: 0;
      }
      .print-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 2px solid #333;
        padding: 8px 16px;
      }
      .print-header img {
        height: 60px;
      }
      .print-header .header-info {
        text-align: right;
        font-size: 10pt;
      }
      .print-header .header-info p {
        margin: 2px;
        margin-right: 25px; 
      }
      header.doc-title {
        text-align: center;
        margin: 18px 0;
      }
      header.doc-title h1 {
        font-size: 18pt;
        margin: 0;
      }
      .patient-data {
        margin: 20px;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background: #fff;
        font-size: 12pt;
      }
      .patient-data p {
        display: inline-block;
        margin-right: 30px;
      }
      .section.responses {
        margin: 20px;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background: #fff;
      }
      .section.responses h2 {
        font-size: 14pt;
        margin-bottom: 10px;
        border-bottom: 1px solid #666;
        padding-bottom: 5px;
      }
      .section.responses p {
        margin-left: 20px;
      }
      .consent-term {
        margin: 10px;
        padding: 10px 20px;
        background: #f9f9f9;
        border: 1px solid #333;
        border-radius: 5px;
        page-break-inside: avoid;
      }
      .section.signature {
        text-align: center;
        margin: 18px;
        margin-bottom: 20px;
      }
      .section.signature img {
        width: 270px;
        border: 1px solid #333;
        display: block;
        margin: 0 auto;
      }
      footer {
        border-top: 2px solid #333;
        padding: 10px 20px;
        font-size: 10pt;
        background: #fff;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
      }
      footer .device-info {
        font-size: 10pt;
        text-align: center;
        margin-bottom: 5px;
      }
      footer .institution-info {
        text-align: center;
      }
      @media print {
        body {
          margin-top: 100px;
          margin-bottom: 100px;
        }
        .print-header,
        footer {
          position: fixed;
          width: 100%;
        }
        .print-header {
          top: 0;
        }
        footer {
          bottom: 0;
        }
        header.doc-title {
          margin-top: 90px;
        }
      }
    </style>
  </head>
  <body>
    <div class="print-header">
      <div class="header-logo">
        <img src="https://i.imgur.com/t2vijVc.png" alt="Logo do Hospital" />
      </div>
      <div class="header-info">
        <p><strong>Data/Hora:</strong> ${data.header.formatted}</p>
        <p>
          <strong>Endereço:</strong> Rua Leopoldina Salgado, n.°203, R.
          Leopoldina Salgado, 3 - Centro, Ceres - GO, 76300-000
        </p>
      </div>
    </div>

    <header class="doc-title">
      <h1>Formulário de Questionário e Consentimento</h1>
    </header>

    <div class="patient-data">
      <p><strong>CPF:</strong> ${data.cpf}</p>
      <p><strong>RG:</strong> ${data.rg}</p>
      <p><strong>Data de Nascimento:</strong> ${data.birthDate}</p>
    </div>

    <div class="section responses">
      <h2>Respostas do Questionário</h2>
      ${responsesHtml}
    </div>

    <div class="consent-term">
      <h2>TERMO DE CONSENTIMENTO PARA USO DE CONTRASTE</h2>
      <p>
        <strong>GRAVIDEZ:</strong> Neste exame utilizam-se raios-x que são
        prejudiciais no caso de gravidez, principalmente no início da gestação.
        Recomenda-se não fazer o exame neste caso. No caso de dúvidas da
        presença de gestação, consulte seu médico.
      </p>
      <p>
        <strong>UTILIZAÇÃO DO CONTRASTE ENDOVENOSO:</strong> O seu médico
        solicitou a realização do exame de Tomografia Computadorizada que, em
        alguns casos, precisa ser realizado com uso de meio de contraste
        injetado na veia (endovenoso). O uso de contraste é importante, pois
        destaca as estruturas vasculares (artérias e veias) e os tecidos por
        elas irrigados, aumentando a sensibilidade do exame que sem o contraste
        pode não ficar evidente.
      </p>
      <p>
        O meio de contraste endovenoso da Tomografia Computadorizada contém iodo
        e, em raríssimas condições, pode acarretar reações alérgicas graves.
        Qualquer dúvida poderá ser esclarecida pelo médico ou o técnico antes do
        exame.
      </p>
      <p>
        <strong>UTILIZAÇÃO DO CONTRASTE ENDOVENOSO:</strong> Estando esclarecido
        sobre os benefícios da injeção do meio de contraste, concordo com a
        realização do procedimento, que será acompanhado por equipe médica
        especializada.
      </p>
    </div>

    <div class="section signature">
      <h2>Assinatura</h2>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6a/Assinatura_de_Fernando_Henrique_Cardoso_-_vers%C3%A3o_2.png"
        alt="Assinatura"
      />
    </div>
    <br /><br /><br />

    <footer>
      <div class="device-info">
        <p>
          <strong>Dispositivo:</strong> Data: ${data.header.date}, Hora:
          ${data.header.time}, IP: ${data.header.ip}, Máscara:
          ${data.header.mask}, MAC: ${data.header.mac}
        </p>
      </div>
      <div class="institution-info">
        <p>CNPJ: 78.364.687/0001-31 - IMEC Diagnostico</p>
      </div>
    </footer>
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
