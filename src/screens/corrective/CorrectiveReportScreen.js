import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import { API_URL } from '../../config/constants';

const CorrectiveReportScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState({
    equipment: '',
    component: '',
    failureDescription: '',
    priority: 'medium',
    technician: '',
    notes: ''
  });

  const handleSubmit = async () => {
    if (!report.equipment || !report.component || !report.failureDescription) {
      Alert.alert('Error', 'Por favor complete todos los campos requeridos');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/corrective`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...report,
          status: 'reported',
          startDate: new Date(),
        }),
      });

      if (!response.ok) throw new Error('Error al enviar reporte');

      Alert.alert(
        'Éxito',
        'Falla reportada exitosamente',
        [{ text: 'OK', onPress: () => navigation.navigate('CorrectiveList', { isNew: true }) }]
      );
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('Error', 'No se pudo enviar el reporte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Equipo *</Text>
          <TextInput
            style={styles.input}
            value={report.equipment}
            onChangeText={(text) => setReport({ ...report, equipment: text })}
            placeholder="Nombre o código del equipo"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Componente *</Text>
          <TextInput
            style={styles.input}
            value={report.component}
            onChangeText={(text) => setReport({ ...report, component: text })}
            placeholder="Componente afectado"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción de la falla *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={report.failureDescription}
            onChangeText={(text) => setReport({ ...report, failureDescription: text })}
            placeholder="Describa detalladamente la falla"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prioridad</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={report.priority}
              onValueChange={(value) => setReport({ ...report, priority: value })}
              style={styles.picker}
            >
              <Picker.Item label="Crítica" value="critical" />
              <Picker.Item label="Alta" value="high" />
              <Picker.Item label="Media" value="medium" />
              <Picker.Item label="Baja" value="low" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Técnico asignado</Text>
          <TextInput
            style={styles.input}
            value={report.technician}
            onChangeText={(text) => setReport({ ...report, technician: text })}
            placeholder="Nombre del técnico (opcional)"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notas adicionales</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={report.notes}
            onChangeText={(text) => setReport({ ...report, notes: text })}
            placeholder="Información adicional relevante"
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="send" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Enviar Reporte</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default CorrectiveReportScreen;