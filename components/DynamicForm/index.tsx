import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../Button';
import { generateDynamicSchema } from '@/utils/dynamicSchema';

export type Question = {
  id: string;
  text: string;
  type: 'text' | 'number' | 'radio' | 'checkbox' | 'textarea';
  options?: { id: string; label: string; value: any }[];
  conditionalQuestions?: {
    value: any;
    questions: Question[];
  }[];
};

export type DynamicFormProps = {
  questions: Question[];
  onSubmit: (data: Record<string, any>) => void;
  defaultValues?: Record<string, any>;
};

/* Funções de formatação em tempo real */

// Formata o CPF para o padrão "000.000.000-00"
const formatCPF = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  let formatted = digits;
  if (digits.length > 3) {
    formatted = digits.slice(0, 3) + '.' + digits.slice(3);
  }
  if (digits.length > 6) {
    formatted = formatted.slice(0, 7) + '.' + formatted.slice(7);
  }
  if (digits.length > 9) {
    formatted = formatted.slice(0, 11) + '-' + formatted.slice(11);
  }
  console.log('[formatCPF]', value, '=>', formatted);
  return formatted;
};

// Formata a data para o padrão "DD/MM/YYYY"
const formatBirthDate = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  let formatted = '';
  if (digits.length <= 2) {
    formatted = digits;
  } else if (digits.length <= 4) {
    formatted = digits.slice(0, 2) + '/' + digits.slice(2);
  } else {
    formatted =
      digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
  }
  console.log('[formatBirthDate]', value, '=>', formatted);
  return formatted;
};

/**
 * Componente auxiliar para renderizar cada pergunta.
 */
type QuestionItemProps = {
  question: Question;
  control: any;
  errors: any;
};

const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  control,
  errors,
}) => {
  const answer = useWatch({ control, name: question.id });
  console.log(
    `[QuestionItem] ${question.id} renderizado. Resposta atual:`,
    answer
  );

  return (
    <View style={styles.questionContainer}>
      <Text style={styles.label}>{question.text}</Text>
      <Controller
        control={control}
        name={question.id}
        render={({ field: { onChange, value, onBlur } }) => {
          console.log(
            `[Controller] Renderizando campo: ${question.id} com valor:`,
            value
          );
          // Formatação dinâmica para CPF e data
          const handleChange = (text: string) => {
            if (question.id === 'cpf') {
              const formatted = formatCPF(text);
              console.log('[handleChange] CPF formatado:', formatted);
              onChange(formatted);
            } else if (question.id === 'birthDate') {
              const formatted = formatBirthDate(text);
              console.log('[handleChange] Data formatada:', formatted);
              onChange(formatted);
            } else {
              onChange(text);
            }
          };

          switch (question.type) {
            case 'textarea':
            case 'text':
            case 'number':
              return (
                <TextInput
                  style={[
                    styles.input,
                    question.type === 'textarea' && styles.textarea,
                    errors[question.id] && styles.errorInput,
                  ]}
                  value={value || ''} // Evita undefined
                  onChangeText={handleChange}
                  onBlur={onBlur}
                  keyboardType={
                    question.type === 'number' ? 'numeric' : 'default'
                  }
                  multiline={question.type === 'textarea'}
                  numberOfLines={question.type === 'textarea' ? 4 : 1}
                  maxLength={
                    question.id === 'cpf'
                      ? 14 // "000.000.000-00"
                      : question.id === 'birthDate'
                      ? 10 // "DD/MM/YYYY"
                      : undefined
                  }
                />
              );
            case 'radio':
              return (
                <RadioGroup
                  options={question.options || []}
                  value={value}
                  onSelect={onChange}
                />
              );
            case 'checkbox':
              return (
                <CheckboxGroup
                  options={question.options || []}
                  value={value}
                  onSelect={onChange}
                />
              );
            default:
              return <></>;
          }
        }}
      />
      {errors[question.id] && (
        <Text style={styles.errorText}>{errors[question.id]?.message}</Text>
      )}
      {question.conditionalQuestions?.map((cond) => {
        if (question.type === 'checkbox') {
          if (Array.isArray(answer) && answer.includes(cond.value)) {
            return cond.questions.map((subQ) => (
              <QuestionItem
                key={subQ.id}
                question={subQ}
                control={control}
                errors={errors}
              />
            ));
          }
        } else if (answer === cond.value) {
          return cond.questions.map((subQ) => (
            <QuestionItem
              key={subQ.id}
              question={subQ}
              control={control}
              errors={errors}
            />
          ));
        }
        return null;
      })}
    </View>
  );
};

const DynamicForm = ({
  questions,
  onSubmit,
  defaultValues = {},
}: DynamicFormProps) => {
  console.log(
    '[DynamicForm] Iniciando montagem do formulário. DefaultValues:',
    defaultValues
  );
  const completeSchema = generateDynamicSchema(questions);
  console.log('[DynamicForm] Esquema completo:', completeSchema);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(completeSchema),
    defaultValues,
  });

  const onSubmitHandler = (data: Record<string, any>) => {
    console.log('[DynamicForm] Dados submetidos:', data);
    onSubmit(data);
  };

  return (
    <View>
      {questions.map((q) => (
        <QuestionItem
          key={q.id}
          question={q}
          control={control}
          errors={errors}
        />
      ))}
      <Button title="Enviar" onPress={handleSubmit(onSubmitHandler)} />
    </View>
  );
};

const RadioGroup = ({
  options,
  value,
  onSelect,
}: {
  options: any[];
  value: any;
  onSelect: (val: any) => void;
}) => {
  return (
    <View style={styles.radioGroup}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={styles.radioOption}
          onPress={() => {
            console.log('[RadioGroup] Selecionado:', option.value);
            onSelect(option.value);
          }}
        >
          <View
            style={[
              styles.radioOuter,
              value === option.value && styles.radioSelectedOuter,
            ]}
          >
            {value === option.value && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.radioLabel}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const CheckboxGroup = ({
  options,
  value,
  onSelect,
}: {
  options: any[];
  value: any;
  onSelect: (val: any) => void;
}) => {
  const selectedValues = Array.isArray(value) ? value : [];
  const toggleSelection = (optionValue: any) => {
    let newSelection;
    if (selectedValues.includes(optionValue)) {
      newSelection = selectedValues.filter((v) => v !== optionValue);
    } else {
      newSelection = [...selectedValues, optionValue];
    }
    console.log('[CheckboxGroup] Novo valor:', newSelection);
    onSelect(newSelection);
  };
  return (
    <View style={styles.checkboxGroup}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={styles.checkboxOption}
          onPress={() => toggleSelection(option.value)}
        >
          <View
            style={[
              styles.checkboxBox,
              selectedValues.includes(option.value) && styles.checkboxSelected,
            ]}
          >
            {selectedValues.includes(option.value) && (
              <Text style={styles.checkboxTick}>✓</Text>
            )}
          </View>
          <Text style={styles.checkboxLabel}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  questionContainer: { marginVertical: 12 },
  label: { fontSize: 16, marginBottom: 8, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textarea: { height: 100, textAlignVertical: 'top' },
  errorInput: { borderColor: 'red' },
  errorText: { color: 'red', marginTop: 4 },
  radioGroup: { marginVertical: 8 },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioSelectedOuter: { borderColor: '#007AFF' },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  radioLabel: { fontSize: 16 },
  checkboxGroup: { marginVertical: 8 },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkboxBox: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxSelected: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  checkboxTick: { color: '#fff', fontSize: 16 },
  checkboxLabel: { fontSize: 16 },
});

export default DynamicForm;
