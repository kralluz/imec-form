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

  // Geração do HTML para as respostas (cada item com altura fixa removida)
  const otherResponsesHtml = filteredResponses
    .map(
      (resp) => `
    <div class="response-item">
      <div class="question"><strong>Pergunta:</strong> ${resp.question}</div>
      <div class="answer"><strong>Resposta:</strong> ${resp.answer}</div>
    </div>
  `
    )
    .join('');

  const responsesHtml = `
    <div class="responses-section">
       ${
         motivo
           ? `<div class="motivo"><strong>Motivo:</strong> ${motivo}</div>`
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
          /* Estilos gerais */
          body {
            font-family: Arial, sans-serif;
            margin: 0; /* Remova margens padrão do body */
            padding: 0;
          }

          .header, .footer {
            width: 100%;
            position: fixed; /* Fixa o cabeçalho e rodapé */
            padding: 10px;
          }
          .header{
            top:0;
            left: 0;
          }

          .footer {
            bottom: 0;
            left: 0;
          }

          .header-content, .footer-content {
              display: flex;
              justify-content: space-between;
              align-items: center; /* Centraliza verticalmente */
          }
          .header img{
            height: 60px; /*Altura do logo*/
          }

          .header-info, .footer-info{
             text-align: right;
          }


          .page-content {
            padding-top: 120px; /* Espaço para o cabeçalho */
            padding-bottom: 80px; /* Espaço para o rodapé */
             page-break-after: always; /* Quebra de página após cada .page-content */

          }

            .page-content:last-child {
                page-break-after: auto; /* Remove a quebra de página do último .page-content */
            }


          .user-data {
            margin-bottom: 20px; /* Espaço entre os dados do usuário e as respostas */
            display: flex;
            justify-content: space-between;
          }

          .user-data span {
             display: block; /* Cada item em uma linha */
             margin-bottom: 5px;
          }

          .responses-section {
            margin-bottom: 20px; /* Espaço entre as respostas e o termo */
          }

          .response-item {
            margin-bottom: 10px;
          }

          .question, .answer {
             margin-bottom: 2px;
          }

          .term-content {
             text-align: justify;
          }
            .term-content p {
                margin-bottom: 1em; /* Espaçamento entre parágrafos */
            }


          .signature-section img {
            max-width: 200px; /* Largura máxima da assinatura */
            max-height: 100px;
            border: 1px solid #000; /*Borda para visualizacao*/
          }

          h1{
            text-align: center;
            margin-bottom: 1rem;
          }
           h2{
            margin-bottom: .5rem;
            margin-top: 1.5rem;
          }

            /* Estilos específicos para impressão */
            @media print {
                @page {
                    margin: 0; /* Margens da página na impressão */
                }
              body{
                margin: 0; /*zera as margens do body na impressão*/
              }
                .header, .footer {
                    position: fixed; /* Mantém fixo na impressão */
                }

              .page-content{
                 padding: 0; /*Remove paddings na impressão*/
              }

                .second-page{
                    transform: rotate(90deg) translate(50vh, -50vh); /* Gira e centraliza a página*/
                    transform-origin: top left; /* Define a origem da rotação */
                    width: 100vh; /* Ajuste para ocupar a largura da página girada. */
                    height: 100vw;  /*Ajuste para ocupar a altura da página girada.*/
                    display: flex;
                    flex-direction: column; /* Para alinhar o conteúdo verticalmente. */
                }
              .term-content, .signature-section{
                padding: 0 10vh; /*margem lateral na página girada*/
              }
            }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-content">
             <div>
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
        </div>

        <div class="page-content">
          <h1>Formulário de Questionário e Consentimento</h1>
          <div class="user-data">
            <span><strong>Nome:</strong> ${patientName}</span>
            <span><strong>CPF:</strong> ${cpfValue}</span>
            <span><strong>Data de Nascimento:</strong> ${birthDateValue}</span>
          </div>
          <div>
            <h2>Respostas do Questionário</h2>
            ${responsesHtml}
          </div>
        </div>

        <div class="page-content second-page">
              <div class="term-content">
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

            <div class="signature-section">
            <h2>Assinatura</h2>
            <img src="${signatureSrc}" alt="Assinatura" />
          </div>
        </div>

        <div class="footer">
          <div class="footer-content">
            <div class="footer-info">
              <p>
                <strong>Dispositivo:</strong> Data: ${data.header.date}, Hora:
                ${data.header.time}, IP: ${data.header.ip}${
    data.header.mask ? `, Máscara: ${data.header.mask}` : ''
  }${data.header.mac ? `, MAC: ${data.header.mac}` : ''}
              </p>
              <p>CNPJ: 20.714.637/0001-57 - IMEC Diagnostico</p>
            </div>
          </div>
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
