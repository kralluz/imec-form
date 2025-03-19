import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '@/components/Header';
import { PDFDataContext } from './context/PDFDataContext';

const { width } = Dimensions.get('window');

export interface ConsentPDFData {
  header?: {
    brand?: string;
    deviceType?: number;
    formatted?: string; // ex: "07 de março de 2025 às 17:11"
    isDevice?: boolean;
    manufacturer?: string;
    modelId?: string | null;
    modelName?: string;
    osName?: string;
    osVersion?: string;
    totalMemory?: number;
  };
  id?: string;
  nursingTechnician?: {
    label?: string;
    value?: string;
  };
  questionnaire?: {
    id?: string;
    title?: string;
  };
  radiologyTechnician?: {
    label?: string;
    value?: string;
  };
  responses?: Array<{
    answer?: string | string[];
    id?: string;
    question?: string;
  }>;
  signature?: string;
}

const FormScreens = () => {
  const router = useRouter();
  const { savedForms, deleteForm, generatePDFs } = useContext(PDFDataContext)!;
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );

  const getResponseValue = (
    form: ConsentPDFData,
    responseId: string
  ): string => {
    if (!form.responses) return 'N/A';
    const response = form.responses.find((r) => r.id === responseId);
    return response && typeof response.answer === 'string'
      ? response.answer
      : 'N/A';
  };

  const handleShare = async (form: any) => {
    try {
      const pdfUri = await generatePDFs(form);
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert(
          'Compartilhamento não disponível',
          'Este dispositivo não suporta compartilhamento de arquivos.'
        );
        return;
      }
      await Sharing.shareAsync(pdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartilhar PDF',
      });
    } catch (error) {
      console.error('Erro ao compartilhar formulário:', error);
      Alert.alert('Erro', 'Não foi possível compartilhar o formulário.');
    }
  };

  const handleDelete = (formId: string | undefined) => {
    if (!formId) return;
    Alert.alert(
      'Excluir formulário',
      'Deseja realmente excluir este formulário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteForm(formId);
            } catch (error) {
              console.error('Erro ao excluir formulário:', error);
              Alert.alert('Erro', 'Não foi possível excluir o formulário.');
            }
          },
        },
      ]
    );
  };

  // Ordena os formulários conforme order
  const sortedForms = useMemo(() => {
    if (!savedForms || savedForms.length === 0) return [];
    return order === 'desc' ? savedForms.slice().reverse() : savedForms;
  }, [savedForms, order]);

  // Agrupa os formulários por dia (parte da data de header.formatted antes de " às ")
  const { groups, groupKeys } = useMemo(() => {
    const groups: Record<string, ConsentPDFData[]> = {};
    const keys: string[] = [];
    sortedForms.forEach((form) => {
      const dateKey = form.header?.formatted
        ? form.header.formatted.split(' às ')[0]
        : 'N/A';
      if (!groups[dateKey]) {
        groups[dateKey] = [];
        keys.push(dateKey);
      }
      groups[dateKey].push(form);
    });
    return { groups, groupKeys: keys };
  }, [sortedForms]);

  // Inicializa todos os grupos como expandidos quando os groupKeys mudam
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    groupKeys.forEach((key) => {
      initial[key] = true;
    });
    setExpandedGroups(initial);
  }, [groupKeys]);

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Renderização dos itens em grid para um formulário
  const renderGridItem = (form: ConsentPDFData) => {
    const cardWidth = (width - 42) / 2;
    const patientName = getResponseValue(form, 'patientName');
    const examTitle = form.questionnaire?.title || 'N/A';
    const dateTime = form.header?.formatted || 'N/A';
    const nursingTech = form.nursingTechnician?.label || 'N/A';
    const radiologyTech = form.radiologyTechnician?.label || 'N/A';
    return (
      <View
        key={form.id}
        style={[
          styles.gridItem,
          {
            width: cardWidth,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          },
        ]}
      >
        <View>
          <Text style={styles.gridText}>
            <Text style={styles.gridLabel}>Paciente: </Text>
            {patientName}
          </Text>
          <Text style={styles.gridText}>
            <Text style={styles.gridLabel}>Exame: </Text>
            {examTitle}
          </Text>
          <Text style={styles.gridText}>
            <Text style={styles.gridLabel}>Data: </Text>
            {dateTime}
          </Text>
          <Text style={styles.gridText}>
            <Text style={styles.gridLabel}>Enf.: </Text>
            {nursingTech}
          </Text>
          <Text style={styles.gridText}>
            <Text style={styles.gridLabel}>Rad.: </Text>
            {radiologyTech}
          </Text>
        </View>
        <View style={styles.gridButtonContainer}>
          <TouchableOpacity
            onPress={() => handleShare(form)}
            style={styles.iconButton}
          >
            <MaterialIcons name="share" size={20} color="#555" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(form.id)}
            style={styles.iconButton}
          >
            <MaterialIcons name="delete" size={20} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderListItem = (form: ConsentPDFData) => {
    const patientName = getResponseValue(form, 'patientName');
    const examTitle = form.questionnaire?.title || 'N/A';
    const dateTime = form.header?.formatted || 'N/A';
    return (
      <View key={form.id} style={styles.listItem}>
        <Text style={styles.listDetail}>
          <Text style={styles.gridLabel}>Paciente: </Text>
          {patientName}
        </Text>
        <Text style={styles.listDetail}>
          <Text style={styles.gridLabel}>Exame: </Text>
          {examTitle}
        </Text>
        <Text style={styles.listDetail}>
          <Text style={styles.gridLabel}>Data: </Text>
          {dateTime}
        </Text>
        <Text style={styles.listDetail}>
          <Text style={styles.gridLabel}>Enf.: </Text>
          {form.nursingTechnician?.label || 'N/A'}
        </Text>
        <Text style={styles.listDetail}>
          <Text style={styles.gridLabel}>Rad.: </Text>
          {form.radiologyTechnician?.label || 'N/A'}
        </Text>
        <View style={styles.listButtonContainer}>
          <TouchableOpacity
            onPress={() => handleShare(form)}
            style={styles.actionButtonList}
          >
            <MaterialIcons name="share" size={20} style={styles.buttonIcon} />
            <Text style={styles.buttonLabel}>Compartilhar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(form.id)}
            style={styles.actionButtonList}
          >
            <MaterialIcons name="delete" size={20} style={styles.buttonIcon} />
            <Text style={styles.buttonLabel}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => router.push('/technicians')}
        >
          <MaterialIcons
            name="note-add"
            size={24}
            style={styles.newButtonIcon}
          />
          <Text style={styles.newButtonText}>Novo Formulário</Text>
        </TouchableOpacity>
        <View style={styles.actionBar}>
          {/* Botão de ordenação à esquerda */}
          <TouchableOpacity
            onPress={() => setOrder(order === 'desc' ? 'asc' : 'desc')}
            style={styles.toggleButton}
          >
            <MaterialCommunityIcons
              name={order === 'desc' ? 'sort-descending' : 'sort-ascending'}
              size={24}
              style={styles.toggleIcon}
            />
          </TouchableOpacity>
          <View style={styles.viewModeToggle}>
            <TouchableOpacity
              onPress={() => setViewMode('grid')}
              style={styles.toggleButton}
            >
              <MaterialIcons
                name="grid-view"
                size={24}
                style={[
                  styles.toggleIcon,
                  viewMode === 'grid' && styles.activeIcon,
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setViewMode('list')}
              style={styles.toggleButton}
            >
              <MaterialIcons
                name="list"
                size={24}
                style={[
                  styles.toggleIcon,
                  viewMode === 'list' && styles.activeIcon,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {groupKeys.length > 0 ? (
          groupKeys.map((key) => (
            <View key={key} style={styles.groupContainer}>
              <TouchableOpacity
                style={styles.groupHeader}
                onPress={() => toggleGroup(key)}
              >
                <Text style={styles.groupTitle}>Formulários do dia {key}</Text>
                <MaterialCommunityIcons
                  name={expandedGroups[key] ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color="#777"
                />
              </TouchableOpacity>
              {expandedGroups[key] &&
                (viewMode === 'grid' ? (
                  <View style={styles.gridContainer}>
                    {groups[key].map(renderGridItem)}
                  </View>
                ) : (
                  groups[key].map(renderListItem)
                ))}
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhum formulário salvo.</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default FormScreens;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(69, 152, 241)', // Cor mais chamativa (azul)
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  newButtonIcon: {
    marginRight: 8,
    color: '#fff', // Ícone em branco para contrastar com o fundo azul
  },
  newButtonText: {
    color: '#fff', // Texto em branco
    fontSize: 16,
    fontWeight: '600',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewModeToggle: {
    flexDirection: 'row',
  },
  toggleButton: {
    marginHorizontal: 4,
  },
  toggleIcon: {
    color: '#777',
  },
  activeIcon: {
    color: '#333',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  /* Agrupamento por dia */
  groupContainer: {
    marginBottom: 20,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  /* Estilização para a visualização em GRID */
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  gridText: {
    fontSize: 11,
    color: '#444',
    marginBottom: 2,
  },
  gridLabel: {
    fontWeight: 'bold',
  },
  gridButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
  iconButton: {
    backgroundColor: '#EFEFEF',
    padding: 6,
    borderRadius: 8,
  },
  /* Estilização para visualização em LISTA */
  listItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  listDetail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  listButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButtonList: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.48,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
  },
  buttonIcon: {
    marginRight: 6,
    color: '#555',
  },
  buttonLabel: {
    color: '#555',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#777',
  },
});
