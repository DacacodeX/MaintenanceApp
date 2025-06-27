import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_URL } from '../../config/constants';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_URL}/api/notifications`);
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`${API_URL}/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });
      
      setNotifications(notifications.map(notification =>
        notification._id === notificationId
          ? { ...notification, status: 'read' }
          : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'preventive_maintenance':
        return { name: 'wrench-clock', color: '#2196F3' };
      case 'corrective_maintenance':
        return { name: 'wrench', color: '#F44336' };
      case 'inventory':
        return { name: 'package-variant', color: '#4CAF50' };
      case 'alert':
        return { name: 'alert', color: '#FFC107' };
      default:
        return { name: 'bell', color: '#757575' };
    }
  };

  const getNotificationPriorityStyle = (priority) => {
    switch (priority) {
      case 'high':
        return styles.highPriority;
      case 'medium':
        return styles.mediumPriority;
      case 'low':
        return styles.lowPriority;
      default:
        return {};
    }
  };

  const formatDate = (date) => {
    const options = {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(date).toLocaleDateString('es-ES', options);
  };

  const renderNotificationItem = ({ item }) => {
    const icon = getNotificationIcon(item.type);
    const priorityStyle = getNotificationPriorityStyle(item.priority);

    return (
      <TouchableOpacity
        style={[styles.notificationItem, item.status === 'unread' && styles.unreadItem]}
        onPress={() => markAsRead(item._id)}
      >
        <View style={[styles.iconContainer, { backgroundColor: icon.color + '20' }]}>
          <Icon name={icon.name} size={24} color={icon.color} />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
          </View>

          <Text style={styles.message} numberOfLines={2}>
            {item.message}
          </Text>

          {item.actionRequired && (
            <View style={styles.actionContainer}>
              <Icon name="arrow-right" size={16} color="#2196F3" />
              <Text style={styles.actionText}>{item.actionType}</Text>
            </View>
          )}

          <View style={styles.footer}>
            <View style={[styles.priorityBadge, priorityStyle]}>
              <Text style={styles.priorityText}>
                {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
              </Text>
            </View>

            {item.status === 'unread' && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>Sin leer</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#2196F3']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="bell-off" size={48} color="#757575" />
            <Text style={styles.emptyText}>No hay notificaciones</Text>
          </View>
        }
      />
    </View>
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
  notificationItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  unreadItem: {
    backgroundColor: '#f8f9fa',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    color: '#757575',
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#2196F3',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  highPriority: {
    backgroundColor: '#ffebee',
  },
  mediumPriority: {
    backgroundColor: '#fff3e0',
  },
  lowPriority: {
    backgroundColor: '#e8f5e9',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unreadText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    marginTop: 16,
  },
});

export default NotificationsScreen;