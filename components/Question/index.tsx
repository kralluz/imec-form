import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Question as QuestionType } from '../../types';

interface QuestionProps {
  question: QuestionType;
  value: any;
  onChange: (value: any) => void; // onChange simplificado
  error?: string;
}

const Question: React.FC<QuestionProps> = ({
  question,
  value,
  onChange,
  error,
}) => {
  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <TextInput
            style={[localStyles.textInput, error && localStyles.inputError]}
            value={value} // Usa o valor controlado
            onChangeText={onChange} // onChange simplificado
            placeholder="Digite sua resposta"
          />
        );
      case 'textarea':
        return (
          <TextInput
            style={[localStyles.textareaInput, error && localStyles.inputError]}
            value={value}
            onChangeText={onChange}
            placeholder="Digite sua resposta"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        );
      case 'radio':
        return (
          <View style={localStyles.optionsContainer}>
            {question.options?.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={localStyles.radioOption}
                onPress={() => onChange(option.value)} // Passa o valor diretamente
              >
                <View style={localStyles.radioOuterCircle}>
                  {value === option.value && (
                    <View style={localStyles.radioInnerCircle} />
                  )}
                </View>
                <Text style={localStyles.optionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'checkbox': {
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <View style={localStyles.optionsContainer}>
            {question.options?.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <TouchableOpacity
                  key={option.id}
                  style={localStyles.checkboxOption}
                  onPress={() => {
                    const newValues = isSelected
                      ? selectedValues.filter((v: any) => v !== option.value)
                      : [...selectedValues, option.value];
                    onChange(newValues); // Passa os novos valores
                  }}
                >
                  <View style={localStyles.checkboxOuterSquare}>
                    {isSelected && (
                      <View style={localStyles.checkboxInnerSquare} />
                    )}
                  </View>
                  <Text style={localStyles.optionLabel}>{option.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      }
      default:
        return null;
    }
  };

  return (
    <View style={localStyles.container}>
      <Text style={localStyles.questionText}>{question.text}</Text>
      {renderInput()}
      {error && <Text style={localStyles.errorText}>{error}</Text>}
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textareaInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    height: 100,
  },
  inputError: {
    borderColor: 'red',
  },
  optionsContainer: {
    flexDirection: 'column',
    marginVertical: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioOuterCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioInnerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  optionLabel: {
    fontSize: 16,
    color: '#333',
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkboxOuterSquare: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxInnerSquare: {
    height: 12,
    width: 12,
    backgroundColor: '#007AFF',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
  },
});

export default Question;
