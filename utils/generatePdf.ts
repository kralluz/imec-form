import * as Print from 'expo-print';

export interface ConsentPDFData {
  header: {
    date: string;
    time: string;
    ip: string;
    mask?: string;
    mac?: string;
    formatted: string;
  };
  cpf: string;
  rg: string;
  birthDate: string;
  responses: { [key: string]: any };
  signature: string;
}

export async function generatePDF(data: ConsentPDFData): Promise<string> {
  // Extrai nome do paciente e motivo para layout diferenciado
  const { pacienteNome, motivo, ...otherResponses } = data.responses;

  // Monta as demais respostas em uma única linha (separadas por ponto e vírgula)
  const otherResponsesHtml = Object.entries(otherResponses)
    .map(([key, value]) => `<span><strong>${key}:</strong> ${value}</span>`)
    .join('; ');

  // Monta a parte de respostas, destacando "motivo" em uma box
  const responsesHtml = `
    <div class="motivo-box">
      <strong>Motivo:</strong> ${motivo}
    </div>
    <div class="other-responses">
      ${otherResponsesHtml}
    </div>
  `;

  // Se a assinatura já for data:image/... usa direto; caso contrário, adiciona prefixo base64
  const signatureSrc = data.signature.startsWith('data:image')
    ? data.signature
    : `data:image/png;base64,${data.signature}`;

  // Monta o HTML completo do documento
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Formulário de Questionário e Consentimento</title>
        <style>
          /* Margens reduzidas na página e fonte levemente menor */
          @page {
            margin: 5mm;
            size: 210mm 297mm;
          }
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 9pt;
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
            font-size: 9pt;
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
            font-size: 16pt;
            margin: 0;
          }

          /* Dados do paciente com espaçamento vertical reduzido */
          .patient-data {
            margin: 2px 0;
            padding: 2px 0;
          }
          .patient-data span {
            display: inline-block;
            margin-right: 20px;
          }

          /* Respostas sem borda e espaçamentos */
          .section.responses {
            margin: 0;
            padding: 0;
            border: none;
          }
          .section.responses h2 {
            font-size: 12pt;
            margin-top: 10px;
            margin-bottom: 5px;
            border-bottom: 1px solid #666;
            padding-bottom: 5px;
          }

          /* Caixa para o "motivo" */
          .motivo-box {
            display: inline-block;
            margin: 0;
            margin-right: 20px;
            padding: 5px 10px;
            border: 1px solid #333;
            border-radius: 3px;
            background: #f9f9f9;
            width: 100%;
            margin: 20px;
          }

          /* Linha única para demais respostas */
          .other-responses span {
            margin-right: 10px;
            margin: 20px;            
          }

          /* Termo de consentimento com texto justificado */
          .consent-term {
            margin: 20px 0;
            padding: 10px 20px;
            background: #f9f9f9;
            border: 1px solid #333;
            border-radius: 5px;
            page-break-inside: avoid;
            text-align: justify;
          }

          /* Assinatura */
          .section.signature {
            text-align: center;
            margin: 18px 0;
            margin-bottom: 20px;
          }
          .section.signature img {
            width: 150px;
            border: 1px solid #333;
            display: block;
            margin: 0 auto;
            transform: rotate(90deg);
          }

          /* Rodapé */
          footer {
            border-top: 2px solid #333;
            padding: 10px 20px;
            font-size: 9pt;
            background: #fff;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
          }
          footer .device-info {
            font-size: 9pt;
            text-align: center;
            margin-bottom: 5px;
          }
          footer .institution-info {
            text-align: center;
          }

          /* Ajustes de impressão */
          @media print {
            body {
              margin-top: 120px;
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
        <!-- Cabeçalho com logo e data -->
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

        <!-- Título do documento -->
        <header class="doc-title">
          <h1>Formulário de Questionário e Consentimento</h1>
        </header>

        <!-- Dados do paciente (Nome, CPF, RG, Data de Nascimento) -->
        <div class="patient-data">
          <span><strong>Nome:</strong> ${pacienteNome}</span>
          <span><strong>CPF:</strong> ${data.cpf}</span>
          <span><strong>RG:</strong> ${data.rg}</span>
          <span><strong>Data de Nascimento:</strong> ${data.birthDate}</span>
        </div>

        <!-- Respostas do questionário -->
        <div class="section responses">
          <h2>Respostas do Questionário</h2>
          ${responsesHtml}
        </div>

        <!-- Texto do termo de consentimento -->
        <div class="consent-term">
          <h2>TERMO DE CONSENTIMENTO PARA USO DE CONTRASTE</h2>
          <p>
            <strong>GRAVIDEZ:</strong> Neste exame utilizam-se raios-x que são
            prejudiciais no caso de gravidez, principalmente no início da
            gestação. Recomenda-se não fazer o exame neste caso. No caso de
            dúvidas da presença de gestação, consulte seu médico.
          </p>
          <p>
            <strong>UTILIZAÇÃO DO CONTRASTE ENDOVENOSO:</strong> O seu médico
            solicitou a realização do exame de Tomografia Computadorizada que, em
            alguns casos, precisa ser realizado com uso de meio de contraste
            injetado na veia (endovenoso). O uso de contraste é importante, pois
            destaca as estruturas vasculares (artérias e veias) e os tecidos por
            elas irrigados, aumentando a sensibilidade do exame que sem o
            contraste pode não ficar evidente.
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

        <!-- Assinatura -->
        <div class="section signature">
          <h2>Assinatura</h2>
          <img src="${signatureSrc}" alt="Assinatura" />
        </div>

        <!-- Rodapé com informações do dispositivo e da instituição -->
        <footer>
          <div class="device-info">
            <p>
              <strong>Dispositivo:</strong> Data: ${data.header.date}, Hora:
              ${data.header.time}, IP: ${data.header.ip}${
    data.header.mask ? `, Máscara: ${data.header.mask}` : ''
  }${data.header.mac ? `, MAC: ${data.header.mac}` : ''}
            </p>
          </div>
          <div class="institution-info">
            <p>CNPJ: 20.714.637/0001-57 - IMEC Diagnostico</p>
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
