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
import Button from '../Button';

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

type DynamicFormProps = {
  questions: Question[];
  onSubmit: (data: Record<string, any>) => void;
  defaultValues?: Record<string, any>;
};

// Componente auxiliar para renderizar cada pergunta
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
  // Cada instância usa o hook useWatch de forma consistente
  const answer = useWatch({ control, name: question.id });

  return (
    <View style={styles.questionContainer}>
      <Text style={styles.label}>{question.text}</Text>
      <Controller
        control={control}
        name={question.id}
        rules={{ required: 'Campo obrigatório' }}
        render={({ field: { onChange, value, onBlur } }) => {
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
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType={
                    question.type === 'number' ? 'numeric' : 'default'
                  }
                  multiline={question.type === 'textarea'}
                  numberOfLines={question.type === 'textarea' ? 4 : 1}
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
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

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
      <Button title="Enviar" onPress={handleSubmit(onSubmit)} />
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
    if (selectedValues.includes(optionValue)) {
      onSelect(selectedValues.filter((v) => v !== optionValue));
    } else {
      onSelect([...selectedValues, optionValue]);
    }
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
  radioOption: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
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
