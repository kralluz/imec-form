  export const questionnaires: any = [
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
            { id: 'q1_no', label: 'Não', value: 'no' },
          ],
          conditionalQuestions: [
            {
              value: 'yes',
              questions: [
                {
                  id: 'q1_details',
                  text: 'Por favor, forneça detalhes sobre o exame anterior:',
                  type: 'textarea',
                  options: [],
                },
              ],
            },
          ],
        },
        {
          id: 'q2',
          text: 'Você possui alergia a algum medicamento ou contraste?',
          type: 'radio',
          options: [
            { id: 'q2_yes', label: 'Sim', value: 'yes' },
            { id: 'q2_no', label: 'Não', value: 'no' },
          ],
          conditionalQuestions: [
            {
              value: 'yes',
              questions: [
                {
                  id: 'q2_details',
                  text: 'Quais alergias você possui?',
                  type: 'textarea',
                  options: [],
                },
              ],
            },
          ],
        },
        {
          id: 'q3',
          text: 'Você está grávida ou há possibilidade de estar?',
          type: 'radio',
          options: [
            { id: 'q3_yes', label: 'Sim', value: 'yes' },
            { id: 'q3_no', label: 'Não', value: 'no' },
            { id: 'q3_na', label: 'Não se aplica', value: 'na' },
          ],
        },
        {
          id: 'q4',
          text: 'Você possui alguma doença crônica?',
          type: 'checkbox',
          options: [
            { id: 'q4_diabetes', label: 'Diabetes', value: 'diabetes' },
            { id: 'q4_hipertensao', label: 'Hipertensão', value: 'hipertensao' },
            { id: 'q4_asma', label: 'Asma', value: 'asma' },
            { id: 'q4_outras', label: 'Outras', value: 'outras' },
          ],
          conditionalQuestions: [
            {
              value: 'outras',
              questions: [
                {
                  id: 'q4_details',
                  text: 'Especifique outras doenças:',
                  type: 'textarea',
                  options: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ];
