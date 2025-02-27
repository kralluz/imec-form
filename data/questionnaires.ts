import { Questionnaire } from '../types';

export const questionnaires: Questionnaire[] = [
  {
    id: 'tomografia',
    title: 'Tomografia',
    icon: 'scan',
    questions: [
      {
        id: 'q1',
        text: 'Você já realizou algum exame de tomografia anteriormente?',
        type: 'radio',
        options: [
          { id: 'q1_yes', label: 'Sim', value: 'yes' },
          { id: 'q1_no', label: 'Não', value: 'no' }
        ],
        conditionalQuestions: [
          {
            value: 'yes',
            questions: [
              {
                id: 'q1_details',
                text: 'Por favor, forneça detalhes sobre o exame anterior:',
                type: 'textarea',
                options: []
              }
            ]
          }
        ]
      },
      {
        id: 'q2',
        text: 'Você possui alergia a algum medicamento ou contraste?',
        type: 'radio',
        options: [
          { id: 'q2_yes', label: 'Sim', value: 'yes' },
          { id: 'q2_no', label: 'Não', value: 'no' }
        ],
        conditionalQuestions: [
          {
            value: 'yes',
            questions: [
              {
                id: 'q2_details',
                text: 'Quais alergias você possui?',
                type: 'textarea',
                options: []
              }
            ]
          }
        ]
      },
      {
        id: 'q3',
        text: 'Você está grávida ou há possibilidade de estar?',
        type: 'radio',
        options: [
          { id: 'q3_yes', label: 'Sim', value: 'yes' },
          { id: 'q3_no', label: 'Não', value: 'no' },
          { id: 'q3_na', label: 'Não se aplica', value: 'na' }
        ]
      },
      {
        id: 'q4',
        text: 'Você possui alguma doença crônica?',
        type: 'checkbox',
        options: [
          { id: 'q4_diabetes', label: 'Diabetes', value: 'diabetes' },
          { id: 'q4_hipertensao', label: 'Hipertensão', value: 'hipertensao' },
          { id: 'q4_asma', label: 'Asma', value: 'asma' },
          { id: 'q4_outras', label: 'Outras', value: 'outras' }
        ],
        conditionalQuestions: [
          {
            value: 'outras',
            questions: [
              {
                id: 'q4_details',
                text: 'Especifique outras doenças:',
                type: 'textarea',
                options: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'mamografia',
    title: 'Mamografia',
    icon: 'stethoscope',
    questions: [
      {
        id: 'q1',
        text: 'Você já realizou mamografia anteriormente?',
        type: 'radio',
        options: [
          { id: 'q1_yes', label: 'Sim', value: 'yes' },
          { id: 'q1_no', label: 'Não', value: 'no' }
        ],
        conditionalQuestions: [
          {
            value: 'yes',
            questions: [
              {
                id: 'q1_details',
                text: 'Quando foi sua última mamografia?',
                type: 'text',
                options: []
              }
            ]
          }
        ]
      },
      {
        id: 'q2',
        text: 'Você tem histórico familiar de câncer de mama?',
        type: 'radio',
        options: [
          { id: 'q2_yes', label: 'Sim', value: 'yes' },
          { id: 'q2_no', label: 'Não', value: 'no' }
        ],
        conditionalQuestions: [
          {
            value: 'yes',
            questions: [
              {
                id: 'q2_details',
                text: 'Qual o grau de parentesco?',
                type: 'text',
                options: []
              }
            ]
          }
        ]
      },
      {
        id: 'q3',
        text: 'Você está amamentando atualmente?',
        type: 'radio',
        options: [
          { id: 'q3_yes', label: 'Sim', value: 'yes' },
          { id: 'q3_no', label: 'Não', value: 'no' }
        ]
      },
      {
        id: 'q4',
        text: 'Você já realizou alguma cirurgia nas mamas?',
        type: 'radio',
        options: [
          { id: 'q4_yes', label: 'Sim', value: 'yes' },
          { id: 'q4_no', label: 'Não', value: 'no' }
        ],
        conditionalQuestions: [
          {
            value: 'yes',
            questions: [
              {
                id: 'q4_details',
                text: 'Qual tipo de cirurgia e quando foi realizada?',
                type: 'textarea',
                options: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ressonancia',
    title: 'Ressonância Magnética',
    icon: 'activity',
    questions: [
      {
        id: 'q1',
        text: 'Você possui algum implante metálico, marca-passo ou prótese?',
        type: 'radio',
        options: [
          { id: 'q1_yes', label: 'Sim', value: 'yes' },
          { id: 'q1_no', label: 'Não', value: 'no' }
        ],
        conditionalQuestions: [
          {
            value: 'yes',
            questions: [
              {
                id: 'q1_details',
                text: 'Especifique qual tipo de implante:',
                type: 'textarea',
                options: []
              }
            ]
          }
        ]
      },
      {
        id: 'q2',
        text: 'Você sofre de claustrofobia?',
        type: 'radio',
        options: [
          { id: 'q2_yes', label: 'Sim', value: 'yes' },
          { id: 'q2_no', label: 'Não', value: 'no' }
        ]
      },
      {
        id: 'q3',
        text: 'Você possui alergia a algum medicamento ou contraste?',
        type: 'radio',
        options: [
          { id: 'q3_yes', label: 'Sim', value: 'yes' },
          { id: 'q3_no', label: 'Não', value: 'no' }
        ],
        conditionalQuestions: [
          {
            value: 'yes',
            questions: [
              {
                id: 'q3_details',
                text: 'Quais alergias você possui?',
                type: 'textarea',
                options: []
              }
            ]
          }
        ]
      },
      {
        id: 'q4',
        text: 'Você está grávida ou há possibilidade de estar?',
        type: 'radio',
        options: [
          { id: 'q4_yes', label: 'Sim', value: 'yes' },
          { id: 'q4_no', label: 'Não', value: 'no' },
          { id: 'q4_na', label: 'Não se aplica', value: 'na' }
        ]
      }
    ]
  },
  {
    id: 'coronarias',
    title: 'Tomografia das Coronárias',
    icon: 'heart',
    questions: [
      {
        id: 'q1',
        text: 'Você possui histórico de problemas cardíacos?',
        type: 'radio',
        options: [
          { id: 'q1_yes', label: 'Sim', value: 'yes' },
          { id: 'q1_no', label: 'Não', value: 'no' }
        ],
        conditionalQuestions: [
          {
            value: 'yes',
            questions: [
              {
                id: 'q1_details',
                text: 'Descreva seu histórico cardíaco:',
                type: 'textarea',
                options: []
              }
            ]
          }
        ]
      },
      {
        id: 'q2',
        text: 'Você já realizou algum cateterismo ou angioplastia?',
        type: 'radio',
        options: [
          { id: 'q2_yes', label: 'Sim', value: 'yes' },
          { id: 'q2_no', label: 'Não', value: 'no' }
        ],
        conditionalQuestions: [
          {
            value: 'yes',
            questions: [
              {
                id: 'q2_details',
                text: 'Quando foi realizado e qual foi o resultado?',
                type: 'textarea',
                options: []
              }
            ]
          }
        ]
      },
      {
        id: 'q3',
        text: 'Você possui alergia a algum medicamento ou contraste?',
        type: 'radio',
        options: [
          { id: 'q3_yes', label: 'Sim', value: 'yes' },
          { id: 'q3_no', label: 'Não', value: 'no' }
        ],
        conditionalQuestions: [
          {
            value: 'yes',
            questions: [
              {
                id: 'q3_details',
                text: 'Quais alergias você possui?',
                type: 'textarea',
                options: []
              }
            ]
          }
        ]
      },
      {
        id: 'q4',
        text: 'Você toma algum medicamento para controle de frequência cardíaca?',
        type: 'radio',
        options: [
          { id: 'q4_yes', label: 'Sim', value: 'yes' },
          { id: 'q4_no', label: 'Não', value: 'no' }
        ],
        conditionalQuestions: [
          {
            value: 'yes',
            questions: [
              {
                id: 'q4_details',
                text: 'Quais medicamentos você utiliza?',
                type: 'textarea',
                options: []
              }
            ]
          }
        ]
      }
    ]
  }
];