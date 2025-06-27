import React, { useState, useEffect } from 'react';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import { API_URL } from '../../config/constants';

const PreventiveTaskDetailScreen = ({ route, navigation }) => {
  const { taskId, isNew } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [task, setTask] = useState({
    equipment: '',
    taskDescription: '',
    frequency: '',
    frequencyUnit: 'hours',
    nextMaintenance: new Date(),
    status: 'pending',
    assignedTo: '',
    notes: ''
  });

  useEffect(() => {
    if (!isNew && taskId) {
      fetchTaskDetails();
    } else {
      setLoading(false);
    }
  }, [taskId]);

  const fetchTaskDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/api/preventive/${taskId}`);
      const data = await response.json();
      setTask({
        ...data,
        nextMaintenance: new Date(data.nextMaintenance)
      });
    } catch (error) {
      console.error('Error fetching task details:', error);
      Alert.alert('Error', 'No se pudo cargar los detalles de la tarea');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!task.equipment || !task.taskDescription) {
      Alert.alert('Error', 'Por favor complete los campos requeridos');
      return;
    }

    setSaving(true);
    try {
      const url = isNew 
        ? `${API_URL}/api/preventive`
        : `${API_URL}/api/preventive/${taskId}`;
      
      const method = isNew ? 'POST' : 'PATCH';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) throw new Error('Error al guardar');

      Alert.alert(
        'Éxito',
        isNew ? 'Tarea creada exitosamente' : 'Tarea actualizada exitosamente',
        [{ text: 'OK', onPress: () => navigation.navigate('PreventiveList', { refresh: true }) }]
      );
    } catch (error) {
      console.error('Error saving task:', error);
      Alert.alert('Error', 'No se pudo guardar la tarea');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Equipo *</Text>
          <TextInput
            style={styles.input}
            value={task.equipment}
            onChangeText={(text) => setTask({ ...task, equipment: text })}
            placeholder="Ingrese el nombre del equipo"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción de la tarea *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={task.taskDescription}
            onChangeText={(text) => setTask({ ...task, taskDescription: text })}
            placeholder="Describa la tarea de mantenimiento"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Frecuencia</Text>
            <TextInput
              style={styles.input}
              value={task.frequency.toString()}
              onChangeText={(text) => setTask({ ...task, frequency: text })}
              keyboardType="numeric"
              placeholder="Ingrese la frecuencia"
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Unidad</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={task.frequencyUnit}
                onValueChange={(value) => setTask({ ...task, frequencyUnit: value })}
                style={styles.picker}
              >
                <Picker.Item label="Horas" value="hours" />
                <Picker.Item label="Kilómetros" value="kilometers" />
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Próximo mantenimiento</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Icon name="calendar" size={20} color="#666" />
            <Text style={styles.dateButtonText}>
              {task.nextMaintenance.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={task.nextMaintenance}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setTask({ ...task, nextMaintenance: selectedDate });
                }
              }}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Estado</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={task.status}
              onValueChange={(value) => setTask({ ...task, status: value })}
              style={styles.picker}
            >
              <Picker.Item label="Pendiente" value="pending" />
              <Picker.Item label="En progreso" value="in-progress" />
              <Picker.Item label="Completado" value="completed" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Asignado a</Text>
          <TextInput
            style={styles.input}
            value={task.assignedTo}
            onChangeText={(text) => setTask({ ...task, assignedTo: text })}
            placeholder="Nombre del responsable"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notas adicionales</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={task.notes}
            onChangeText={(text) => setTask({ ...task, notes: text })}
            placeholder="Agregue notas o comentarios adicionales"
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="content-save" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Guardar</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  row: {
    flexDirection: 'row',
    marginBottom: 16,
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
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default PreventiveTaskDetailScreen;