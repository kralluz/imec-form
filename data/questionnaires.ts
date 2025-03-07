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
        type: 'number',
        options: [],
      },
      {
        id: 'birthDate',
        text: 'Data de Nascimento:',
        type: 'number',
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
];
