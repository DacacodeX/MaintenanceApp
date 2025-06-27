import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_URL } from '../../config/constants';

const CorrectiveMaintenanceScreen = ({ navigation }) => {
  const [maintenances, setMaintenances] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMaintenances = async () => {
    try {
      const response = await fetch(`${API_URL}/api/corrective`);
      const data = await response.json();
      setMaintenances(data);
    } catch (error) {
      console.error('Error fetching maintenances:', error);
      Alert.alert('Error', 'No se pudieron cargar los mantenimientos');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMaintenances();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchMaintenances();
  }, []);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'reported':
        return '#FF9800';
      case 'diagnosed':
        return '#2196F3';
      case 'in-repair':
        return '#9C27B0';
      case 'completed':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  };

  const renderMaintenance = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CorrectiveDetail', { maintenanceId: item._id })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.equipmentContainer}>
          <Icon name="wrench" size={20} color="#666" />
          <Text style={styles.equipmentText}>{item.equipment}</Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
          <Text style={styles.priorityText}>{item.priority}</Text>
        </View>
      </View>

      <View style={styles.componentContainer}>
        <Text style={styles.componentLabel}>Componente:</Text>
        <Text style={styles.componentText}>{item.component}</Text>
      </View>

      <Text style={styles.failureText} numberOfLines={2}>
        {item.failureDescription}
      </Text>

      <View style={styles.cardFooter}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>

        <Text style={styles.dateText}>
          {new Date(item.startDate).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={maintenances}
        renderItem={renderMaintenance}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CorrectiveReport')}
      >
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  statsButtonText: {
    marginLeft: 4,
    color: '#2196F3',
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  equipmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  equipmentText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  componentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  componentLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  componentText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  failureText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#2196F3',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default CorrectiveMaintenanceScreen;