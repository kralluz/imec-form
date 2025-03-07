// baseSchema.ts
import { z } from 'zod';

export const baseSchema = z.object({
  // Schema para validação com Zod:
  patientName: z
    .string()
    .nonempty('Nome é obrigatório')
    .transform((val) => val.trim().substring(0, 40)),
  cpf: z.preprocess(
    (arg) => {
      if (typeof arg === 'string') {
        return arg.replace(/\D/g, '');
      }
      return arg;
    },
    z
      .string()
      .length(11, 'CPF deve conter 11 dígitos')
      .transform((val) =>
        val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
      )
  ),
  birthDate: z.preprocess(
    (arg) => {
      if (typeof arg === 'string') {
        return arg.replace(/\D/g, '');
      }
      return arg;
    },
    z
      .string()
      .length(8, 'Data deve conter 8 dígitos (DDMMYYYY)')
      .transform((val) => {
        const day = val.slice(0, 2);
        const month = val.slice(2, 4);
        const year = val.slice(4);
        return `${day}/${month}/${year}`;
      })
  ),
});
