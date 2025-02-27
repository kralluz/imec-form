import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from './styles';
import { Question as QuestionType } from '../../types';

interface QuestionProps {
  question: QuestionType;
  value: any;
  onChange: (id: string, value: any) => void;
}

const Question: React.FC<QuestionProps> = ({ question, value, onChange }) => {
  const [showConditional, setShowConditional] = useState<string | null>(null);

  const handleChange = (newValue: any) => {
    onChange(question.id, newValue);
    
    // Check if we need to show conditional questions
    if (question.conditionalQuestions) {
      const conditionalQuestion = question.conditionalQuestions.find(
        cq => cq.value === newValue
      );
      
      if (conditionalQuestion) {
        setShowConditional(newValue);
      } else {
        setShowConditional(null);
      }
    }
  };

  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <TextInput
            style={styles.textInput}
            value={value || ''}
            onChangeText={handleChange}
            placeholder="Digite sua resposta"
          />
        );
      
      case 'textarea':
        return (
          <TextInput
            style={styles.textareaInput}
            value={value || ''}
            onChangeText={handleChange}
            placeholder="Digite sua resposta"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        );
      
      case 'radio':
        return (
          <View style={styles.optionsContainer}>
            {question.options?.map(option => (
              <TouchableOpacity
                key={option.id}
                style={styles.radioOption}
                onPress={() => handleChange(option.value)}
              >
                <View style={styles.radioOuterCircle}>
                  {value === option.value && <View style={styles.radioInnerCircle} />}
                </View>
                <Text style={styles.optionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      
      case 'checkbox':
        const selectedValues = Array.isArray(value) ? value : [];
        
        return (
          <View style={styles.optionsContainer}>
            {question.options?.map(option => {
              const isSelected = selectedValues.includes(option.value);
              
              return (
                <TouchableOpacity
                  key={option.id}
                  style={styles.checkboxOption}
                  onPress={() => {
                    const newValues = isSelected
                      ? selectedValues.filter(v => v !== option.value)
                      : [...selectedValues, option.value];
                    
                    handleChange(newValues);
                    
                    // Check for conditional questions
                    if (question.conditionalQuestions) {
                      if (newValues.includes(option.value)) {
                        setShowConditional(option.value);
                      } else {
                        setShowConditional(null);
                      }
                    }
                  }}
                >
                  <View style={styles.checkboxOuterSquare}>
                    {isSelected && <View style={styles.checkboxInnerSquare} />}
                  </View>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      
      default:
        return null;
    }
  };

  const renderConditionalQuestions = () => {
    if (!showConditional || !question.conditionalQuestions) return null;
    
    const conditionalQuestion = question.conditionalQuestions.find(
      cq => cq.value === showConditional
    );
    
    if (!conditionalQuestion) return null;
    
    return (
      <View style={styles.conditionalContainer}>
        {conditionalQuestion.questions.map(q => (
          <Question
            key={q.id}
            question={q}
            value={value?.[q.id] || ''}
            onChange={(id, val) => {
              const updatedValue = { ...value, [id]: val };
              onChange(question.id, updatedValue);
            }}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question.text}</Text>
      {renderInput()}
      {renderConditionalQuestions()}
    </View>
  );
};

export default Question;