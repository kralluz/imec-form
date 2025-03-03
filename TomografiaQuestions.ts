// TomografiaQuestions.tsx
import { z } from 'zod';

export type QuestionType = {
  id: string;
  text: string;
  type: 'text' | 'textarea' | 'radio';
  options?: { id: string; label: string; value: string }[];
  dependsOn?: { questionId: string; value: string }; // Para perguntas condicionais
};

export const tomografiaQuestions: QuestionType[] = [
  {
    id: 'pacienteNome',
    text: 'PACIENTE NOME',
    type: 'text',
  },
  {
    id: 'motivo',
    text: 'Por que motivo seu médico solicitou o exame de tomografia computadorizada?',
    type: 'textarea',
  },
  {
    id: 'cirurgia',
    text: 'Fez alguma cirurgia?',
    type: 'radio',
    options: [
      { id: 'sim', label: 'Sim', value: 'sim' },
      { id: 'nao', label: 'Não', value: 'nao' },
    ],
  },
  {
    id: 'cirurgiaTempo',
    text: 'Há quanto tempo?',
    type: 'text',
    dependsOn: { questionId: 'cirurgia', value: 'sim' },
  },
  {
    id: 'cirurgiaQual',
    text: 'Qual cirurgia?',
    type: 'text',
    dependsOn: { questionId: 'cirurgia', value: 'sim' },
  },
  {
    id: 'tratamento',
    text: 'Já realizou radioterapia, quimioterapia ou similar?',
    type: 'radio',
    options: [
      { id: 'sim', label: 'Sim', value: 'sim' },
      { id: 'nao', label: 'Não', value: 'nao' },
    ],
  },
  {
    id: 'tratamentoSessoes',
    text: 'Quantas sessões?',
    type: 'text',
    dependsOn: { questionId: 'tratamento', value: 'sim' },
  },
  {
    id: 'medicamento',
    text: 'Faz uso de algum medicamento de uso contínuo?',
    type: 'radio',
    options: [
      { id: 'sim', label: 'Sim', value: 'sim' },
      { id: 'nao', label: 'Não', value: 'nao' },
    ],
  },
  {
    id: 'alergia',
    text: 'Tem algum outro tipo de alergia?',
    type: 'radio',
    options: [
      { id: 'sim', label: 'Sim', value: 'sim' },
      { id: 'nao', label: 'Não', value: 'nao' },
    ],
  },
  {
    id: 'gravidez',
    text: 'Suspeita de gravidez?',
    type: 'radio',
    options: [
      { id: 'sim', label: 'Sim', value: 'sim' },
      { id: 'nao', label: 'Não', value: 'nao' },
    ],
  },
  {
    id: 'comorbidades',
    text: 'Tem diabetes, hipertensão, doenças renais, asma, bronquite?',
    type: 'radio',
    options: [
      { id: 'nao', label: 'Não', value: 'nao' },
      { id: 'sim', label: 'Sim', value: 'sim' },
    ],
  },
  {
    id: 'fumante',
    text: 'É fumante?',
    type: 'radio',
    options: [
      { id: 'sim', label: 'Sim', value: 'sim' },
      { id: 'nao', label: 'Não', value: 'nao' },
    ],
  },
  {
    id: 'fumanteTempo',
    text: 'Há quanto tempo?',
    type: 'text',
    dependsOn: { questionId: 'fumante', value: 'sim' },
  },
];

export const formSchema = z
  .object({
    pacienteNome: z.string().min(1, { message: 'Obrig.' }),
    motivo: z.string().min(1, { message: 'Obrig.' }),
    cirurgia: z.enum(['sim', 'nao']).or(z.literal('')).optional(), // Correção aqui
    cirurgiaTempo: z.string().optional(),
    cirurgiaQual: z.string().optional(),
    tratamento: z.enum(['sim', 'nao']).or(z.literal('')).optional(), // Correção aqui
    tratamentoSessoes: z.string().optional(),
    medicamento: z.enum(['sim', 'nao']).or(z.literal('')).optional(), // Correção aqui
    alergia: z.enum(['sim', 'nao']).or(z.literal('')).optional(), // Correção aqui
    gravidez: z.enum(['sim', 'nao']).or(z.literal('')).optional(), // Correção aqui
    comorbidades: z.enum(['sim', 'nao']).or(z.literal('')).optional(), // Correção aqui
    fumante: z.enum(['sim', 'nao']).or(z.literal('')).optional(), // Correção aqui
    fumanteTempo: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const enumFields = [
      'cirurgia',
      'tratamento',
      'medicamento',
      'alergia',
      'gravidez',
      'comorbidades',
      'fumante',
    ];
    enumFields.forEach((field) => {
      if ((data as any)[field] === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Obrig.',
          path: [field],
        });
      }
    });
    if (data.cirurgia === 'sim') {
      if (!data.cirurgiaTempo || data.cirurgiaTempo.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Obrig.',
          path: ['cirurgiaTempo'],
        });
      }
      if (!data.cirurgiaQual || data.cirurgiaQual.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Obrig.',
          path: ['cirurgiaQual'],
        });
      }
    }
    if (data.tratamento === 'sim') {
      if (!data.tratamentoSessoes || data.tratamentoSessoes.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Obrig.',
          path: ['tratamentoSessoes'],
        });
      }
    }
    if (data.fumante === 'sim') {
      if (!data.fumanteTempo || data.fumanteTempo.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Obrig.',
          path: ['fumanteTempo'],
        });
      }
    }
  });

export type FormData = z.infer<typeof formSchema>;
