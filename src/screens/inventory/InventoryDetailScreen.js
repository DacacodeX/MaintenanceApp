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
import { API_URL } from '../../config/constants';

const InventoryDetailScreen = ({ route, navigation }) => {
  const { itemId, isNew } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [item, setItem] = useState({
    partNumber: '',
    name: '',
    description: '',
    category: '',
    manufacturer: '',
    currentStock: 0,
    minimumStock: 0,
    reorderPoint: 0,
    unitPrice: 0,
    location: {
      warehouse: '',
      shelf: '',
      bin: ''
    },
    supplier: {
      name: '',
      contact: '',
      leadTime: 0
    }
  });

  useEffect(() => {
    if (!isNew && itemId) {
      fetchItemDetails();
    } else {
      setLoading(false);
    }
  }, [itemId]);

  const fetchItemDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/api/inventory/${itemId}`);
      const data = await response.json();
      setItem(data);
    } catch (error) {
      console.error('Error fetching item details:', error);
      Alert.alert('Error', 'No se pudieron cargar los detalles del item');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!item.partNumber || !item.name || !item.category) {
      Alert.alert('Error', 'Por favor complete los campos requeridos');
      return;
    }

    setSaving(true);
    try {
      const url = isNew 
        ? `${API_URL}/api/inventory`
        : `${API_URL}/api/inventory/${itemId}`;
      
      const method = isNew ? 'POST' : 'PATCH';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) throw new Error('Error al guardar');

      Alert.alert(
        'Éxito',
        isNew ? 'Item creado exitosamente' : 'Item actualizado exitosamente',
        [{ text: 'OK', onPress: () => navigation.navigate('InventoryList', { refresh: true })  }]
      );
    } catch (error) {
      console.error('Error saving item:', error);
      Alert.alert('Error', 'No se pudo guardar el item');
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Básica</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Número de Parte *</Text>
            <TextInput
              style={styles.input}
              value={item.partNumber}
              onChangeText={(text) => setItem({ ...item, partNumber: text })}
              placeholder="Ingrese el número de parte"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={styles.input}
              value={item.name}
              onChangeText={(text) => setItem({ ...item, name: text })}
              placeholder="Ingrese el nombre del repuesto"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={item.description}
              onChangeText={(text) => setItem({ ...item, description: text })}
              placeholder="Descripción detallada del repuesto"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoría *</Text>
            <TextInput
              style={styles.input}
              value={item.category}
              onChangeText={(text) => setItem({ ...item, category: text })}
              placeholder="Categoría del repuesto"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fabricante</Text>
            <TextInput
              style={styles.input}
              value={item.manufacturer}
              onChangeText={(text) => setItem({ ...item, manufacturer: text })}
              placeholder="Nombre del fabricante"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Control de Stock</Text>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Stock Actual</Text>
              <TextInput
                style={styles.input}
                value={item.currentStock.toString()}
                onChangeText={(text) => setItem({ ...item, currentStock: parseInt(text) || 0 })}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Stock Mínimo</Text>
              <TextInput
                style={styles.input}
                value={item.minimumStock.toString()}
                onChangeText={(text) => setItem({ ...item, minimumStock: parseInt(text) || 0 })}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Punto de Reorden</Text>
              <TextInput
                style={styles.input}
                value={item.reorderPoint.toString()}
                onChangeText={(text) => setItem({ ...item, reorderPoint: parseInt(text) || 0 })}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Precio Unitario</Text>
              <TextInput
                style={styles.input}
                value={item.unitPrice.toString()}
                onChangeText={(text) => setItem({ ...item, unitPrice: parseFloat(text) || 0 })}
                keyboardType="decimal-pad"
                placeholder="0.00"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ubicación</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Almacén</Text>
            <TextInput
              style={styles.input}
              value={item.location.warehouse}
              onChangeText={(text) => setItem({
                ...item,
                location: { ...item.location, warehouse: text }
              })}
              placeholder="Nombre o código del almacén"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Estante</Text>
              <TextInput
                style={styles.input}
                value={item.location.shelf}
                onChangeText={(text) => setItem({
                  ...item,
                  location: { ...item.location, shelf: text }
                })}
                placeholder="Número de estante"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Ubicación</Text>
              <TextInput
                style={styles.input}
                value={item.location.bin}
                onChangeText={(text) => setItem({
                  ...item,
                  location: { ...item.location, bin: text }
                })}
                placeholder="Ubicación específica"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Proveedor</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre del Proveedor</Text>
            <TextInput
              style={styles.input}
              value={item.supplier.name}
              onChangeText={(text) => setItem({
                ...item,
                supplier: { ...item.supplier, name: text }
              })}
              placeholder="Nombre del proveedor"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contacto</Text>
            <TextInput
              style={styles.input}
              value={item.supplier.contact}
              onChangeText={(text) => setItem({
                ...item,
                supplier: { ...item.supplier, contact: text }
              })}
              placeholder="Información de contacto"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tiempo de Entrega (días)</Text>
            <TextInput
              style={styles.input}
              value={item.supplier.leadTime.toString()}
              onChangeText={(text) => setItem({
                ...item,
                supplier: { ...item.supplier, leadTime: parseInt(text) || 0 }
              })}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>
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
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f8f8',
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

export default InventoryDetailScreen;