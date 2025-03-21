export const questionnaires: any = [
  {
    id: 'tomografia',
    title: 'Tomografia',
    icon: 'scan',
    questions: [
      {
        id: 'patientName',
        text: 'Qual é o seu nome?',
        type: 'text',
        options: [],
      },
      {
        id: 'cpf',
        text: 'Informe seu CPF:',
        type: 'text',
        options: [],
      },
      {
        id: 'birthDate',
        text: 'Data de Nascimento:',
        type: 'text',
        options: [],
      },
      {
        id: 'motivo',
        text: 'Qual o motivo que seu médico solicitou o exame de tomografia?',
        type: 'textarea',
        options: [],
      },
      {
        id: 'cirurgia',
        text: 'Você já fez alguma cirurgia?',
        type: 'radio',
        options: [
          { id: 'cirurgia_yes', label: 'Sim', value: 'yes' },
          { id: 'cirurgia_no', label: 'Não', value: 'no' },
        ],
        conditionalQuestions: [
          {
            value: 'yes',
            questions: [
              {
                id: 'cirurgia_details',
                text: 'Qual cirurgia você fez e a quanto tempo?',
                type: 'textarea',
                options: [],
              },
            ],
          },
        ],
      },
      {
        id: 'radioterapia_quimioterapia',
        text: 'Você já realizou radioterapia, quimioterapia ou procedimento similar?',
        type: 'radio',
        options: [
          { id: 'rq_yes', label: 'Sim', value: 'yes' },
          { id: 'rq_no', label: 'Não', value: 'no' },
        ],
        conditionalQuestions: [
          {
            value: 'yes',
            questions: [
              {
                id: 'rq_sessions',
                text: 'Quantas sessões você realizou?',
                type: 'text',
                options: [],
              },
            ],
          },
        ],
      },
      {
        id: 'medicamento_continuo',
        text: 'Faz uso de algum medicamento de uso contínuo?',
        type: 'radio',
        options: [
          { id: 'med_yes', label: 'Sim', value: 'yes' },
          { id: 'med_no', label: 'Não', value: 'no' },
        ],
        conditionalQuestions: [
          {
            value: 'yes',
            questions: [
              {
                id: 'med_details',
                text: 'Qual medicamento você utiliza?',
                type: 'textarea',
                options: [],
              },
            ],
          },
        ],
      },
      {
        id: 'suspeita_gravidez',
        text: 'Você tem suspeita de gravidez?',
        type: 'radio',
        options: [
          { id: 'gravidez_yes', label: 'Sim', value: 'yes' },
          { id: 'gravidez_no', label: 'Não', value: 'no' },
        ],
      },
      {
        id: 'condicoes_cronicas',
        text: 'Você possui alguma das seguintes condições: diabetes, hipertensão, doenças renais, asma ou bronquite?',
        type: 'checkbox',
        options: [
          { id: 'cond_diabetes', label: 'Diabetes', value: 'diabetes' },
          {
            id: 'cond_hipertensao',
            label: 'Hipertensão',
            value: 'hipertensao',
          },
          { id: 'cond_renais', label: 'Doenças Renais', value: 'renais' },
          { id: 'cond_asma', label: 'Asma', value: 'asma' },
          { id: 'cond_bronquite', label: 'Bronquite', value: 'bronquite' },
        ],
      },
      {
        id: 'fumante',
        text: 'Você é fumante?',
        type: 'radio',
        options: [
          { id: 'fumante_yes', label: 'Sim', value: 'yes' },
          { id: 'fumante_no', label: 'Não', value: 'no' },
        ],
        conditionalQuestions: [
          {
            value: 'yes',
            questions: [
              {
                id: 'fumante_tempo',
                text: 'Se sim, a quanto tempo você fuma?',
                type: 'text',
                options: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'mamografia',
    title: 'Mamografia',
    icon: 'scan',
    questions: [
      {
        id: 'patientName',
        text: 'Qual é o seu nome?',
        type: 'text',
        options: [],
      },
      {
        id: 'cpf',
        text: 'Informe seu CPF:',
        type: 'text',
        options: [],
      },
      {
        id: 'birthDate',
        text: 'Data de Nascimento:',
        type: 'text',
        options: [],
      },
      {
        id: 'primeira_mamografia',
        text: 'Esta é a sua primeira mamografia?',
        type: 'radio',
        options: [
          { id: 'primeira_mamografia_yes', label: 'Sim', value: 'yes' },
          { id: 'primeira_mamografia_no', label: 'Não', value: 'no' },
        ],
      },
      {
        id: 'mamografia_anterior',
        text: 'Você já fez mamografia antes?',
        type: 'radio',
        options: [
          { id: 'mamografia_anterior_yes', label: 'Sim', value: 'yes' },
          { id: 'mamografia_anterior_no', label: 'Não', value: 'no' },
        ],
        conditionalQuestions: [
          {
            value: 'yes',
            questions: [
              {
                id: 'mamografia_anterior_data',
                text: 'Quando foi a última vez que você fez uma mamografia?',
                type: 'text',
                options: [],
              },
              {
                id: 'mamografia_anterior_local',
                text: 'Onde você realizou sua última mamografia?',
                type: 'text',
                options: [],
              },
            ],
          },
        ],
      },
      {
        id: 'alteracao_mama',
        text: 'Você notou alguma alteração na mama (nódulo, secreção, dor)?',
        type: 'radio',
        options: [
          { id: 'alteracao_mama_yes', label: 'Sim', value: 'yes' },
          { id: 'alteracao_mama_no', label: 'Não', value: 'no' },
        ],
        conditionalQuestions: [
          {
            value: 'yes',
            questions: [
              {
                id: 'alteracao_mama_detalhes',
                text: 'Descreva a alteração que você notou.',
                type: 'textarea',
                options: [],
              },
            ],
          },
        ],
      },
      {
        id: 'historico_cancer',
        text: 'Você ou alguém da sua família já teve câncer de mama ou ovário?',
        type: 'radio',
        options: [
          { id: 'historico_cancer_yes', label: 'Sim', value: 'yes' },
          { id: 'historico_cancer_no', label: 'Não', value: 'no' },
        ],
        conditionalQuestions: [
          {
            value: 'yes',
            questions: [
              {
                id: 'historico_cancer_detalhes',
                text: 'Quem teve câncer e qual o grau de parentesco?',
                type: 'text',
                options: [],
              },
            ],
          },
        ],
      },
      {
        id: 'reposicao_hormonal',
        text: 'Você faz ou já fez reposição hormonal?',
        type: 'radio',
        options: [
          { id: 'reposicao_hormonal_yes', label: 'Sim', value: 'yes' },
          { id: 'reposicao_hormonal_no', label: 'Não', value: 'no' },
        ],
        conditionalQuestions: [
          {
            value: 'yes',
            questions: [
              {
                id: 'reposicao_hormonal_tempo',
                text: 'Por quanto tempo você fez ou faz reposição hormonal?',
                type: 'text',
                options: [],
              },
            ],
          },
        ],
      },
      {
        id: 'gravidez_amamentacao',
        text: 'Você está grávida ou amamentando?',
        type: 'radio',
        options: [
          { id: 'gravidez_amamentacao_yes', label: 'Sim', value: 'yes' },
          { id: 'gravidez_amamentacao_no', label: 'Não', value: 'no' },
        ],
      },
      {
        id: 'implante_silicone',
        text: 'Você possui implante de silicone nas mamas?',
        type: 'radio',
        options: [
          { id: 'implante_silicone_yes', label: 'Sim', value: 'yes' },
          { id: 'implante_silicone_no', label: 'Não', value: 'no' },
        ],
      },
    ],
  },
  {
    id: 'raio_x_contraste',
    title: 'Raio-X com Contraste',
    icon: 'scan',
    questions: [
      {
        id: 'patientName',
        text: 'Qual é o seu nome?',
        type: 'text',
        options: [],
      },
      {
        id: 'cpf',
        text: 'Informe seu CPF:',
        type: 'text',
        options: [],
      },
      {
        id: 'birthDate',
        text: 'Data de Nascimento:',
        type: 'text',
        options: [],
      },
      {
        id: 'motivo_raio_x_contraste',
        text: 'Qual o motivo do exame de Raio-X com contraste?',
        type: 'textarea',
        options: [],
      },
      {
        id: 'alergia_contraste',
        text: 'Você já teve alguma reação alérgica a contraste iodado?',
        type: 'radio',
        options: [
          { id: 'alergia_contraste_yes', label: 'Sim', value: 'yes' },
          { id: 'alergia_contraste_no', label: 'Não', value: 'no' },
        ],
        conditionalQuestions: [
          {
            value: 'yes',
            questions: [
              {
                id: 'alergia_contraste_detalhes',
                text: 'Descreva a reação alérgica que você teve.',
                type: 'textarea',
                options: [],
              },
            ],
          },
        ],
      },
      {
        id: 'alergia_outras',
        text: 'Você tem alergia a algum medicamento, alimento ou iodo?',
        type: 'radio',
        options: [
          { id: 'alergia_outras_yes', label: 'Sim', value: 'yes' },
          { id: 'alergia_outras_no', label: 'Não', value: 'no' },
        ],
        conditionalQuestions: [
          {
            value: 'yes',
            questions: [
              {
                id: 'alergia_outras_detalhes',
                text: 'Descreva suas alergias.',
                type: 'textarea',
                options: [],
              },
            ],
          },
        ],
      },
      {
        id: 'funcao_renal',
        text: 'Você tem algum problema de função renal?',
        type: 'radio',
        options: [
          { id: 'funcao_renal_yes', label: 'Sim', value: 'yes' },
          { id: 'funcao_renal_no', label: 'Não', value: 'no' },
        ],
      },
      {
        id: 'diabetes_medicacao',
        text: 'Você é diabético e faz uso de metformina ou outro medicamento para diabetes?',
        type: 'radio',
        options: [
          { id: 'diabetes_medicacao_yes', label: 'Sim', value: 'yes' },
          { id: 'diabetes_medicacao_no', label: 'Não', value: 'no' },
        ],
        conditionalQuestions: [
          {
            value: 'yes',
            questions: [
              {
                id: 'diabetes_medicacao_quais',
                text: 'Quais medicamentos você utiliza?',
                type: 'textarea',
                options: [],
              },
            ],
          },
        ],
      },
      {
        id: 'gravidez_amamentacao_raio_x',
        text: 'Você está grávida ou amamentando?',
        type: 'radio',
        options: [
          { id: 'gravidez_amamentacao_yes', label: 'Sim', value: 'yes' },
          { id: 'gravidez_amamentacao_no', label: 'Não', value: 'no' },
        ],
      },
    ],
  },
  {
    id: 'ressonancia_magnetica',
    title: 'Ressonância Magnética',
    icon: 'scan',
    questions: [
      {
        id: 'patientName',
        text: 'Qual é o seu nome?',
        type: 'text',
        options: [],
      },
      {
        id: 'cpf',
        text: 'Informe seu CPF:',
        type: 'text',
        options: [],
      },
      {
        id: 'birthDate',
        text: 'Data de Nascimento:',
        type: 'text',
        options: [],
      },
      {
        id: 'motivo_ressonancia',
        text: 'Qual o motivo do exame de Ressonância Magnética?',
        type: 'textarea',
        options: [],
      },
      {
        id: 'claustrofobia',
        text: 'Você tem claustrofobia?',
        type: 'radio',
        options: [
          { id: 'claustrofobia_yes', label: 'Sim', value: 'yes' },
          { id: 'claustrofobia_no', label: 'Não', value: 'no' },
        ],
      },
      {
        id: 'marcapasso',
        text: 'Você possui marcapasso ou outro dispositivo cardíaco implantado?',
        type: 'radio',
        options: [
          { id: 'marcapasso_yes', label: 'Sim', value: 'yes' },
          { id: 'marcapasso_no', label: 'Não', value: 'no' },
        ],
      },
      {
        id: 'implante_metalico',
        text: 'Você possui algum implante metálico (próteses, pinos, parafusos, placas, estilhaços de metal)?',
        type: 'radio',
        options: [
          { id: 'implante_metalico_yes', label: 'Sim', value: 'yes' },
          { id: 'implante_metalico_no', label: 'Não', value: 'no' },
        ],
        conditionalQuestions: [
          {
            value: 'yes',
            questions: [
              {
                id: 'implante_metalico_detalhes',
                text: 'Descreva o tipo e a localização do implante.',
                type: 'textarea',
                options: [],
              },
            ],
          },
        ],
      },
      {
        id: 'implante_coclear',
        text: 'Você possui implante coclear ou aparelho auditivo?',
        type: 'radio',
        options: [
          { id: 'implante_coclear_yes', label: 'Sim', value: 'yes' },
          { id: 'implante_coclear_no', label: 'Não', value: 'no' },
        ],
      },
      {
        id: 'neuroestimulador',
        text: 'Você possui neuroestimulador?',
        type: 'radio',
        options: [
          { id: 'neuroestimulador_yes', label: 'Sim', value: 'yes' },
          { id: 'neuroestimulador_no', label: 'Não', value: 'no' },
        ],
      },
      {
        id: 'piercing_tatuagem',
        text: 'Você possui piercing ou tatuagem?',
        type: 'radio',
        options: [
          { id: 'piercing_tatuagem_yes', label: 'Sim', value: 'yes' },
          { id: 'piercing_tatuagem_no', label: 'Não', value: 'no' },
        ],
        conditionalQuestions: [
          {
            value: 'yes',
            questions: [
              {
                id: 'piercing_tatuagem_detalhes',
                text: 'Onde se localiza o piercing ou tatuagem?',
                type: 'text',
                options: [],
              },
            ],
          },
        ],
      },
      {
        id: 'gravidez_ressonancia',
        text: 'Você está grávida?',
        type: 'radio',
        options: [
          { id: 'gravidez_yes', label: 'Sim', value: 'yes' },
          { id: 'gravidez_no', label: 'Não', value: 'no' },
        ],
      },
      {
        id: 'alergia_gadolinio',
        text: 'Você já teve alguma reação alérgica ao contraste gadolínio?',
        type: 'radio',
        options: [
          { id: 'alergia_gadolinio_yes', label: 'Sim', value: 'yes' },
          { id: 'alergia_gadolinio_no', label: 'Não', value: 'no' },
        ],
        conditionalQuestions: [
          {
            value: 'yes',
            questions: [
              {
                id: 'alergia_gadolinio_detalhes',
                text: 'Descreva a reação alérgica.',
                type: 'textarea',
                options: [],
              },
            ],
          },
        ],
      },
      {
        id: 'insuficiencia_renal_ressonancia',
        text: 'Você tem insuficiência renal?',
        type: 'radio',
        options: [
          { id: 'insuficiencia_renal_yes', label: 'Sim', value: 'yes' },
          { id: 'insuficiencia_renal_no', label: 'Não', value: 'no' },
        ],
      },
    ],
  },
];
