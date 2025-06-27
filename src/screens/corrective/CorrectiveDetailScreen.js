import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import { API_URL } from '../../config/constants';

const CorrectiveDetailScreen = ({ route, navigation }) => {
  const { maintenanceId } = route.params;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [maintenance, setMaintenance] = useState(null);
  const [newAction, setNewAction] = useState('');

  const fetchMaintenanceDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/api/corrective/${maintenanceId}`);
      const data = await response.json();
      setMaintenance(data);
    } catch (error) {
      console.error('Error fetching maintenance details:', error);
      Alert.alert('Error', 'No se pudieron cargar los detalles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceDetails();
  }, [maintenanceId]);

  const handleStatusChange = async (newStatus) => {
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/corrective/${maintenanceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          ...(newStatus === 'completed' && { completionDate: new Date() })
        }),
      });

      if (!response.ok) throw new Error('Error al actualizar estado');

      setMaintenance({ ...maintenance, status: newStatus });
      Alert.alert('Éxito', 'Estado actualizado correctamente');
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado');
    } finally {
      setSaving(false);
    }
  };

  const addCorrectiveAction = async () => {
    if (!newAction.trim()) {
      Alert.alert('Error', 'Por favor ingrese una acción correctiva');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/corrective/${maintenanceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correctiveActions: [
            ...maintenance.correctiveActions,
            {
              action: newAction,
              date: new Date(),
              performedBy: maintenance.technician
            }
          ]
        }),
      });

      if (!response.ok) throw new Error('Error al agregar acción');

      const updatedMaintenance = await response.json();
      setMaintenance(updatedMaintenance);
      setNewAction('');
      Alert.alert('Éxito', 'Acción correctiva agregada');
    } catch (error) {
      console.error('Error adding corrective action:', error);
      Alert.alert('Error', 'No se pudo agregar la acción correctiva');
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
      <View style={styles.header}>
        <View style={styles.equipmentInfo}>
          <Text style={styles.equipmentText}>{String(maintenance.equipment || '')}</Text>
          <Text style={styles.componentText}>{String(maintenance.component || '')}</Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(maintenance.priority) }]}>
          <Text style={styles.priorityText}>{String(maintenance.priority || '')}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descripción de la Falla</Text>
        <Text style={styles.descriptionText}>{maintenance.failureDescription}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estado</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={maintenance.status}
            onValueChange={handleStatusChange}
            enabled={!saving}
            style={styles.picker}
          >
            <Picker.Item label="Reportado" value="reported" />
            <Picker.Item label="Diagnosticado" value="diagnosed" />
            <Picker.Item label="En reparación" value="in-repair" />
            <Picker.Item label="Completado" value="completed" />
          </Picker>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones Correctivas</Text>
        {maintenance.correctiveActions.map((action, index) => (
          <View key={index} style={styles.actionCard}>
            <Text style={styles.actionText}>{action.action}</Text>
            <View style={styles.actionFooter}>
              <Text style={styles.actionDate}>
                {new Date(action.date).toLocaleDateString()}
              </Text>
              <Text style={styles.actionPerformer}>
                {action.performedBy}
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.addActionContainer}>
          <TextInput
            style={styles.actionInput}
            value={newAction}
            onChangeText={setNewAction}
            placeholder="Nueva acción correctiva"
            multiline
          />
          <TouchableOpacity
            style={[styles.addButton, saving && styles.addButtonDisabled]}
            onPress={addCorrectiveAction}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={{ color: 'white' }}>+</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {maintenance.diagnosis && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diagnóstico</Text>
          <Text style={styles.diagnosisText}>{maintenance.diagnosis || ''}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Adicional</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Técnico:</Text>
            <Text style={styles.infoValue}>{maintenance.technician || 'No asignado'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Fecha de inicio:</Text>
            <Text style={styles.infoValue}>
              {new Date(maintenance.startDate).toLocaleDateString()}
            </Text>
          </View>
          {maintenance.completionDate && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Fecha de finalización:</Text>
              <Text style={styles.infoValue}>
                {new Date(maintenance.completionDate || '').toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'critical':
      return '#F44336';
    case 'high':
      return '#FF9800';
    case 'medium':
      return '#FFC107';
    case 'low':
      return '#4CAF50';
    default:
      return '#9E9E9E';
  }
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
  header: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  equipmentInfo: {
    flex: 1,
  },
  equipmentText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  componentText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  actionCard: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  actionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionDate: {
    fontSize: 12,
    color: '#666',
  },
  actionPerformer: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  addActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  actionInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#2196F3',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.7,
  },
  diagnosisText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});

export default CorrectiveDetailScreen;