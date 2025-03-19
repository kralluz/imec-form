// components/DynamicForm.tsx
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
import { MaterialIcons } from '@expo/vector-icons';

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
  return formatted;
};

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
  return formatted;
};

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

  return (
    <View style={styles.questionContainer}>
      <Text style={styles.label}>{question.text}</Text>
      <Controller
        control={control}
        name={question.id}
        render={({ field: { onChange, value, onBlur } }) => {
          const handleChange = (text: string) => {
            if (question.id === 'cpf') {
              onChange(formatCPF(text));
            } else if (question.id === 'birthDate') {
              onChange(formatBirthDate(text));
            } else {
              onChange(text);
            }
          };

          switch (question.type) {
            case 'textarea':
            case 'text':
            case 'number':
              return (
                <View>
                  <TextInput
                    style={[
                      styles.input,
                      question.type === 'textarea' && styles.textarea,
                      errors[question.id] && styles.errorInput,
                    ]}
                    value={value || ''}
                    onChangeText={handleChange}
                    onBlur={onBlur}
                    keyboardType={
                      question.id === 'cpf' ||
                      question.id === 'birthDate' ||
                      question.type === 'number'
                        ? 'numeric'
                        : 'default'
                    }
                    multiline={question.type === 'textarea'}
                    numberOfLines={question.type === 'textarea' ? 4 : 1}
                    maxLength={
                      question.id === 'cpf'
                        ? 14
                        : question.id === 'birthDate'
                        ? 10
                        : undefined
                    }
                    placeholderTextColor="#999"
                  />
                  {errors[question.id] && (
                    <View style={styles.errorContainer}>
                      <MaterialIcons
                        name="error-outline"
                        size={16}
                        color="red"
                      />
                      <Text style={styles.errorText}>
                        {errors[question.id]?.message}
                      </Text>
                    </View>
                  )}
                </View>
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
  // Gere o schema dinâmico com todos os campos marcados como obrigatórios.
  const completeSchema = generateDynamicSchema(questions);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(completeSchema),
    defaultValues,
    // Alteramos para o modo 'all' para validar desde o início e em todas as mudanças
    mode: 'all',
  });

  const onSubmitHandler = (data: Record<string, any>) => {
    onSubmit(data);
  };

  return (
    <View style={styles.formContainer}>
      {questions.map((q) => (
        <QuestionItem key={q.id} question={q} control={control} errors={errors} />
      ))}
      <Button
        title="Enviar"
        onPress={handleSubmit(onSubmitHandler)}
        disabled={!isValid}
      />
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
          style={[
            styles.radioOption,
            value === option.value && styles.radioOptionSelected,
          ]}
          onPress={() => onSelect(option.value)}
        >
          <View
            style={[
              styles.radioOuter,
              value === option.value && styles.radioSelectedOuter,
            ]}
          >
            {value === option.value && <View style={styles.radioInner} />}
          </View>
          <Text
            style={[
              styles.radioLabel,
              value === option.value && styles.radioLabelSelected,
            ]}
          >
            {option.label}
          </Text>
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
    onSelect(newSelection);
  };
  return (
    <View style={styles.checkboxGroup}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.checkboxOption,
            selectedValues.includes(option.value) && styles.checkboxOptionSelected,
          ]}
          onPress={() => toggleSelection(option.value)}
        >
          <View
            style={[
              styles.checkboxBox,
              selectedValues.includes(option.value) && styles.checkboxSelected,
            ]}
          >
            {selectedValues.includes(option.value) && (
              <MaterialIcons name="check" size={18} color="white" />
            )}
          </View>
          <Text
            style={[
              styles.checkboxLabel,
              selectedValues.includes(option.value) && styles.checkboxLabelSelected,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 16,
  },
  questionContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textarea: {
    height: 120,
    textAlignVertical: 'top',
  },
  errorInput: {
    borderColor: '#e74c3c',
    backgroundColor: '#fce8e6',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  errorText: {
    color: '#e74c3c',
    marginLeft: 4,
    fontSize: 13,
  },
  radioGroup: {
    marginVertical: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  radioOptionSelected: {
    backgroundColor: '#e6f7ff',
  },
  radioOuter: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioSelectedOuter: {
    borderColor: '#2980b9',
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#2980b9',
  },
  radioLabel: {
    fontSize: 16,
    color: '#555',
  },
  radioLabelSelected: {
    fontWeight: 'bold',
    color: '#2980b9',
  },
  checkboxGroup: {
    marginVertical: 10,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  checkboxOptionSelected: {
    backgroundColor: '#e6f7ff',
  },
  checkboxBox: {
    height: 22,
    width: 22,
    borderWidth: 2,
    borderColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderRadius: 6,
  },
  checkboxSelected: {
    backgroundColor: '#2980b9',
    borderColor: '#2980b9',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#555',
  },
  checkboxLabelSelected: {
    fontWeight: 'bold',
    color: '#2980b9',
  },
});

export default DynamicForm;
