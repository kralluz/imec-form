import * as Print from 'expo-print';

export interface ConsentPDFData {
  id: string;
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
  responses: { [key: string]: any }[]; // Array de objetos com {id, question, answer}
  signature: string;
}

export async function generatePDF(data: ConsentPDFData): Promise<string> {
  // Extração dos dados essenciais do array responses
  const nameResponse = data.responses.find((resp) =>
    resp.question.toLowerCase().includes('nome')
  );
  const patientName = nameResponse ? nameResponse.answer : 'Não informado';

  const cpfResponse = data.responses.find((resp) =>
    resp.question.toLowerCase().includes('cpf')
  );
  const cpfValue = cpfResponse ? cpfResponse.answer : data.cpf;

  const birthDateResponse = data.responses.find(
    (resp) =>
      resp.question.toLowerCase().includes('data de nascimento') ||
      resp.question.toLowerCase().includes('birthdate')
  );
  const birthDateValue = birthDateResponse
    ? birthDateResponse.answer
    : data.birthDate;

  // Cálculo da idade a partir da data de nascimento
  const birthDateObj = new Date(birthDateValue);
  const hoje = new Date();
  let idade = hoje.getFullYear() - birthDateObj.getFullYear();
  const mes = hoje.getMonth() - birthDateObj.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < birthDateObj.getDate())) {
    idade--;
  }

  // Remove os itens essenciais do array responses para evitar duplicação
  const filteredResponses = data.responses.filter((resp) => {
    const lowerQ = resp.question.toLowerCase();
    return !(
      lowerQ.includes('nome') ||
      lowerQ.includes('cpf') ||
      lowerQ.includes('data de nascimento') ||
      lowerQ.includes('birthdate')
    );
  });

  // Extração do motivo (se existir)
  const motivoResponse = data.responses.find((resp) =>
    resp.question.toLowerCase().includes('motivo')
  );
  const motivo = motivoResponse ? motivoResponse.answer : '';

  // Geração do HTML para as respostas, separando cada item com uma linha pontilhada
  const otherResponsesHtml = filteredResponses
    .map(
      (resp) => `
    <div class="response-item">
      <p class="pergunta"><strong>Pergunta:</strong> ${resp.question}</p>
      <p class="resposta"><strong>Resposta:</strong> ${resp.answer}</p>
    </div>
  `
    )
    .join('');

  const responsesHtml = `
    <div class="responses-section">
      ${
        motivo
          ? `<div class="response-item">
                <p class="pergunta"><strong>Pergunta:</strong> Motivo</p>
                <p class="resposta"><strong>Resposta:</strong> ${motivo}</p>
             </div>`
          : ''
      }
      ${otherResponsesHtml}
    </div>
  `;

  // Processamento da assinatura
  const signatureSrc = data.signature.startsWith('data:image')
    ? data.signature
    : `data:image/png;base64,${data.signature}`;

  // Monta o HTML completo com estilos para impressão
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Formulário de Questionário e Consentimento</title>
        <style>
          /* Espaçamento lateral pequeno */
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0 2%; 
          }
          /* Cabeçalho com logo à esquerda e informações à direita */
          .header {
            width: 100%;
            padding: 10px 2%;
            border-bottom: 1px solid #ccc;
            display: flex;
            align-items: center;
            background: #fff;
          }
          .logo {
            flex-shrink: 0;
          }
          .logo img {
            height: 60px;
          }
          .header-info {
            margin-left: 15px;
            font-size: 14px;
            line-height: 1.4;
          }
          /* Formatação do cabeçalho conforme solicitado */
          .header-info p {
            margin: 2px 0;
          }
          /* Rodapé centralizado */
          .footer {
            width: 100%;
            padding: 10px 2%;
            border-top: 1px solid #ccc;
            text-align: center;
            font-size: 12px;
            position: fixed;
            bottom: 0;
            left: 0;
            background: #fff;
          }
          /* Estrutura das páginas */
          .page {
            min-height: 100vh;
            box-sizing: border-box;
            padding-top: 100px;  /* Espaço para o cabeçalho */
            padding-bottom: 60px; /* Espaço para o rodapé */
          }
          /* Dados do usuário */
          .user-data {
            margin-bottom: 20px;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            align-items: center;
            font-size: 14px;
          }
          /* Respostas com linha pontilhada separando cada item */
          .responses-section .response-item {
            padding: 5px 0;
            border-bottom: 1px dotted #ccc;
          }
          .responses-section .response-item:last-child {
            border-bottom: none;
          }
          /* Conteúdo do termo */
          .term-content {
            text-align: justify;
            margin-bottom: 20px;
          }
          .term-content p {
            margin-bottom: 1em;
          }
          /* Assinatura */
          .signature-section {
            text-align: center;
            margin-top: 20px;
          }
          .signature-section img {
            max-width: 250px;
            max-height: 150px;
            border: 1px solid #000;
          }
          /* Títulos */
          h1 {
            text-align: center;
            margin-bottom: 1rem;
          }
          h2 {
            margin-bottom: 0.5rem;
            margin-top: 1.5rem;
          }
          /* Estilos específicos para impressão */
          @media print {
            @page {
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0 2%;
            }
            .header, .footer {
              position: fixed;
            }
            /* Apenas a assinatura será girada */
            .signature-rotated {
              transform: rotate(90deg);
              transform-origin: center;
              display: inline-block;
              margin: 20px 0;
            }
          }
        </style>
      </head>
      <body>
        <!-- Cabeçalho -->
        <div class="header">
          <div class="logo">
            <img src="https://i.imgur.com/t2vijVc.png" alt="Logo do Hospital" />
          </div>
          <div class="header-info">
            <p><strong>Data/Hora:</strong> ${data.header.formatted}</p>
            <p><strong>Endereço:</strong> Rua Leopoldina Salgado, n.°203, R. Leopoldina Salgado, 3 - Centro, Ceres - GO, 76300-000</p>
          </div>
        </div>

        <!-- Página 1: Questionário -->
        <div class="page">
          <h1>Formulário de Questionário e Consentimento</h1>
          <div class="user-data">
            <span><strong>Nome:</strong> ${patientName}</span>
            <span><strong>CPF:</strong> ${cpfValue}</span>
            <span><strong>Data de Nascimento:</strong> ${birthDateValue} - ${idade} anos de idade</span>
          </div>
          <div>
            <h2>Respostas do Questionário</h2>
            ${responsesHtml}
          </div>
        </div>

        <!-- Página 2: Termo e Assinatura -->
        <div class="page">
          <div class="term-content">
            <h2>TERMO DE CONSENTIMENTO PARA USO DE CONTRASTE</h2>
            <p>
              <strong>GRAVIDEZ:</strong> Neste exame utilizam-se raios-x que são prejudiciais no caso de gravidez, principalmente no início da gestação. Recomenda-se não fazer o exame neste caso. No caso de dúvidas da presença de gestação, consulte seu médico.
            </p>
            <p>
              <strong>UTILIZAÇÃO DO CONTRASTE ENDOVENOSO:</strong> O seu médico solicitou a realização do exame de Tomografia Computadorizada que, em alguns casos, precisa ser realizado com uso de meio de contraste injetado na veia (endovenoso). O uso de contraste é importante, pois destaca as estruturas vasculares (artérias e veias) e os tecidos por elas irrigados, aumentando a sensibilidade do exame que sem o contraste pode não ficar evidente.
            </p>
            <p>
              O meio de contraste endovenoso da Tomografia Computadorizada contém iodo e, em raríssimas condições, pode acarretar reações alérgicas graves. Qualquer dúvida poderá ser esclarecida pelo médico ou o técnico antes do exame.
            </p>
            <p>
              <strong>UTILIZAÇÃO DO CONTRASTE ENDOVENOSO:</strong> Estando esclarecido sobre os benefícios da injeção do meio de contraste, concordo com a realização do procedimento, que será acompanhado por equipe médica especializada.
            </p>
          </div>

          <div class="signature-section">
            <h2>Assinatura</h2>
            <div class="signature-rotated">
              <img src="${signatureSrc}" alt="Assinatura" />
            </div>
          </div>
        </div>

        <!-- Rodapé -->
        <div class="footer">
          <p>
            <strong>Dispositivo:</strong> Data: ${data.header.date}, Hora: ${data.header.time}, IP: ${data.header.ip}
          </p>
          <p>
            <strong>CNPJ:</strong> 20.714.637/0001-57 - IMEC Diagnostico
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    return uri;
  } catch (error) {
    console.error('[generatePDF] Erro ao gerar PDF:', error);
    throw error;
  }
}
