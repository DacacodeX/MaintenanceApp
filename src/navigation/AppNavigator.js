import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Preventive Maintenance Screens
import PreventiveMaintenanceScreen from '../screens/preventive/PreventiveMaintenanceScreen';
import PreventiveTaskDetailScreen from '../screens/preventive/PreventiveTaskDetailScreen';
import PreventiveDashboardScreen from '../screens/preventive/PreventiveDashboardScreen';

// Corrective Maintenance Screens
import CorrectiveMaintenanceScreen from '../screens/corrective/CorrectiveMaintenanceScreen';
import CorrectiveReportScreen from '../screens/corrective/CorrectiveReportScreen';
import CorrectiveDetailScreen from '../screens/corrective/CorrectiveDetailScreen';

// Inventory Screens
import InventoryScreen from '../screens/inventory/InventoryScreen';
import InventoryDetailScreen from '../screens/inventory/InventoryDetailScreen';
import InventoryStatsScreen from '../screens/inventory/InventoryStatsScreen';

// Notifications Screen
import NotificationsScreen from '../screens/notifications/NotificationsScreen';

const Tab = createBottomTabNavigator();
const PreventiveStack = createStackNavigator();
const CorrectiveStack = createStackNavigator();
const InventoryStack = createStackNavigator();
const NotificationsStack = createStackNavigator();

const PreventiveStackNavigator = () => (
  <PreventiveStack.Navigator>
    <PreventiveStack.Screen
      name="PreventiveList"
      component={PreventiveMaintenanceScreen}
      options={{ title: 'Mantenimiento Preventivo' }}
    />
    <PreventiveStack.Screen
      name="PreventiveTaskDetail"
      component={PreventiveTaskDetailScreen}
      options={({ route }) => ({
        title: route.params?.isNew ? 'Nueva Tarea' : 'Detalle de Tarea',
      })}
    />
    <PreventiveStack.Screen
      name="PreventiveDashboard"
      component={PreventiveDashboardScreen}
      options={{ title: 'Dashboard Preventivo' }}
    />
  </PreventiveStack.Navigator>
);

const CorrectiveStackNavigator = () => (
  <CorrectiveStack.Navigator>
    <CorrectiveStack.Screen
      name="CorrectiveList"
      component={CorrectiveMaintenanceScreen}
      options={{ title: 'Mantenimiento Correctivo' }}
    />
    <CorrectiveStack.Screen
      name="CorrectiveReport"
      component={CorrectiveReportScreen}
      options={{ title: 'Reportar Falla' }}
    />
    <CorrectiveStack.Screen
      name="CorrectiveDetail"
      component={CorrectiveDetailScreen}
      options={{ title: 'Detalle de Falla' }}
    />
  </CorrectiveStack.Navigator>
);

const InventoryStackNavigator = () => (
  <InventoryStack.Navigator>
    <InventoryStack.Screen
      name="InventoryList"
      component={InventoryScreen}
      options={{ title: 'Inventario' }}
    />
    <InventoryStack.Screen
      name="InventoryDetail"
      component={InventoryDetailScreen}
      options={({ route }) => ({
        title: route.params?.isNew ? 'Nuevo Item' : 'Detalle de Item',
      })}
    />
    <InventoryStack.Screen
      name="InventoryStats"
      component={InventoryStatsScreen}
      options={{ title: 'Estadísticas' }}
    />
  </InventoryStack.Navigator>
);

const NotificationsStackNavigator = () => (
  <NotificationsStack.Navigator>
    <NotificationsStack.Screen
      name="NotificationsList"
      component={NotificationsScreen}
      options={{ title: 'Notificaciones' }}
    />
  </NotificationsStack.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case 'Preventive':
                iconName = focused ? 'wrench-clock' : 'wrench-clock-outline';
                break;
              case 'Corrective':
                iconName = focused ? 'wrench' : 'wrench-outline';
                break;
              case 'Inventory':
                iconName = focused ? 'package-variant' : 'package-variant-closed';
                break;
              case 'Notifications':
                iconName = focused ? 'bell' : 'bell-outline';
                break;
              default:
                iconName = 'circle';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2196F3',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen
          name="Preventive"
          component={PreventiveStackNavigator}
          options={{
            title: 'Preventivo',
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Corrective"
          component={CorrectiveStackNavigator}
          options={{
            title: 'Correctivo',
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Inventory"
          component={InventoryStackNavigator}
          options={{
            title: 'Inventario',
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={NotificationsStackNavigator}
          options={{
            title: 'Notificaciones',
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;