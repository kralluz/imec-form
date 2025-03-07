// dynamicSchema.ts
import { Question } from '@/components/DynamicForm';
import { z } from 'zod';

const mapQuestionToSchema = (question: Question) => {
  let schema;
  switch (question.type) {
    case 'text':
    case 'textarea':
      schema = z.string().optional();
      break;
    case 'number':
      schema = z.string().optional();
      break;
    case 'radio':
      schema = z.string().optional();
      break;
    case 'checkbox':
      schema = z.array(z.string()).optional();
      break;
    default:
      schema = z.any().optional();
  }
  return schema;
};

export const generateDynamicSchema = (questions: Question[]) => {
  const shape: Record<string, any> = {};

  const addQuestionToShape = (q: Question) => {
    shape[q.id] = mapQuestionToSchema(q);
    if (q.conditionalQuestions) {
      q.conditionalQuestions.forEach((cond) => {
        cond.questions.forEach((subQ) => addQuestionToShape(subQ));
      });
    }
  };

  questions.forEach((q) => addQuestionToShape(q));

  return z.object(shape);
};
