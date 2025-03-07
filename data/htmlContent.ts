// buildHTML.ts
export function buildHTML(data: any): string {
  console.log('[buildHTML] Iniciando a construção do HTML do PDF.');
  console.log('[buildHTML] Dados recebidos:', data);

  // Extração dos dados essenciais utilizando find()
  const nameResponse = data.responses.find((resp: any) =>
    resp.question.toLowerCase().includes('nome')
  );
  const patientName = nameResponse ? nameResponse.answer : 'Não informado';
  console.log('[buildHTML] patientName extraído:', patientName);

  const cpfResponse = data.responses.find((resp: any) =>
    resp.question.toLowerCase().includes('cpf')
  );
  const cpfValue = cpfResponse ? cpfResponse.answer : 'Não informado';
  console.log('[buildHTML] CPF extraído:', cpfValue);

  const birthDateResponse = data.responses.find(
    (resp: any) =>
      resp.question.toLowerCase().includes('data de nascimento') ||
      resp.question.toLowerCase().includes('birthdate')
  );
  const birthDateValue = birthDateResponse
    ? birthDateResponse.answer
    : 'Não informado';
  console.log('[buildHTML] Data de Nascimento extraída:', birthDateValue);

  // Remoção dos itens duplicados do array de respostas
  const filteredResponses = data.responses.filter((resp: any) => {
    const lowerQ = resp.question.toLowerCase();
    const isEssential =
      lowerQ.includes('nome') ||
      lowerQ.includes('cpf') ||
      lowerQ.includes('data de nascimento') ||
      lowerQ.includes('birthdate');
    return !isEssential;
  });
  console.log(
    '[buildHTML] Respostas filtradas (sem dados essenciais):',
    filteredResponses
  );

  // Extração do motivo
  const motivoResponse = data.responses.find((resp: any) =>
    resp.question.toLowerCase().includes('motivo')
  );
  const motivo = motivoResponse ? motivoResponse.answer : '';
  console.log('[buildHTML] Motivo extraído:', motivo);

  // Geração do HTML para as demais respostas (com altura fixa para cada item)
  const otherResponsesHtml = filteredResponses
    .map(
      (resp: any) => `
    <div class="qa-item">
      <div class="question"><strong>Pergunta:</strong> ${resp.question}</div>
      <div class="answer"><strong>Resposta:</strong> ${resp.answer}</div>
    </div>
  `
    )
    .join('');
  console.log(
    '[buildHTML] HTML das demais respostas gerado:',
    otherResponsesHtml
  );

  const responsesHtml = `
    <div class="motivo-box">
      <strong>Motivo:</strong> ${motivo}
    </div>
    <div class="other-responses">
      ${otherResponsesHtml}
    </div>
  `;
  console.log('[buildHTML] Seção de respostas completa:', responsesHtml);

  // Formatação da assinatura
  const signatureSrc = data.signature.startsWith('data:image')
    ? data.signature
    : `data:image/png;base64,${data.signature}`;
  console.log('[buildHTML] Fonte da assinatura definida:', signatureSrc);

  // Monta o HTML completo com alturas fixas para as seções
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Formulário de Questionário e Consentimento</title>
        <style>
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
          .patient-data {
            margin: 2px 0;
            padding: 2px 0;
          }
          .patient-data span {
            display: inline-block;
            margin-right: 20px;
          }
          .section.responses {
            margin: 0;
            padding: 0;
            border: none;
            height: 400px; /* Altura fixa para a seção de perguntas */
            overflow-y: auto;
          }
          .section.responses h2 {
            font-size: 12pt;
            margin-top: 10px;
            margin-bottom: 5px;
            border-bottom: 1px solid #666;
            padding-bottom: 5px;
          }
          .motivo-box {
            display: inline-block;
            margin: 20px;
            padding: 5px 10px;
            border: 1px solid #333;
            border-radius: 3px;
            background: #f9f9f9;
            width: 100%;
          }
          .other-responses {
            margin: 20px;
          }
          .qa-item {
            margin-bottom: 10px;
            padding: 5px;
            border-bottom: 1px dashed #ccc;
            height: 50px; /* Altura fixa para cada pergunta/resposta */
            overflow: hidden;
          }
          .question {
            font-weight: bold;
            margin-bottom: 5px;
          }
          .answer {
            margin-left: 10px;
          }
          .consent-term {
            margin: 20px 0;
            padding: 10px 20px;
            background: #f9f9f9;
            border: 1px solid #333;
            border-radius: 5px;
            page-break-inside: avoid;
            text-align: justify;
            height: 200px; /* Altura fixa para o termo de consentimento */
            overflow-y: auto;
          }
          .section.signature {
            text-align: center;
            margin: 18px 0;
            margin-bottom: 20px;
            height: 100px; /* Altura fixa para a área de assinatura */
          }
          .section.signature img {
            width: 150px;
            border: 1px solid #333;
            display: block;
            margin: 0 auto;
            transform: rotate(90deg);
          }
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
          <span><strong>Nome:</strong> ${patientName}</span>
          <span><strong>CPF:</strong> ${cpfValue}</span>
          <span><strong>Data de Nascimento:</strong> ${birthDateValue}</span>
        </div>
        <div class="section responses">
          <h2>Respostas do Questionário</h2>
          ${responsesHtml}
        </div>
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
        <div class="section signature">
          <h2>Assinatura</h2>
          <img src="${signatureSrc}" alt="Assinatura" />
        </div>
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

  console.log('[buildHTML] HTML completo gerado.');
  return htmlContent;
}
