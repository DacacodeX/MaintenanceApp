import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, View } from 'react-native';
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

// Custom header component with logo
const CustomHeader = () => (
  <View style={{ alignItems: 'center', paddingTop: 25, paddingBottom: 15, backgroundColor: 'white' }}>
    <Image
      source={require('./logo.jpeg')}
      style={{ height: 40, resizeMode: 'contain' }}
    />
  </View>
);

const PreventiveStackNavigator = () => (
  <PreventiveStack.Navigator
    screenOptions={{
      header: () => <CustomHeader />
    }}
  >
    <PreventiveStack.Screen
      name="PreventiveList"
      component={PreventiveMaintenanceScreen}
    />
    <PreventiveStack.Screen
      name="PreventiveTaskDetail"
      component={PreventiveTaskDetailScreen}
    />
    <PreventiveStack.Screen
      name="PreventiveDashboard"
      component={PreventiveDashboardScreen}
    />
  </PreventiveStack.Navigator>
);

const CorrectiveStackNavigator = () => (
  <CorrectiveStack.Navigator
    screenOptions={{
      header: () => <CustomHeader />
    }}
  >
    <CorrectiveStack.Screen
      name="CorrectiveList"
      component={CorrectiveMaintenanceScreen}
    />
    <CorrectiveStack.Screen
      name="CorrectiveReport"
      component={CorrectiveReportScreen}
    />
    <CorrectiveStack.Screen
      name="CorrectiveDetail"
      component={CorrectiveDetailScreen}
    />
  </CorrectiveStack.Navigator>
);

const InventoryStackNavigator = () => (
  <InventoryStack.Navigator
    screenOptions={{
      header: () => <CustomHeader />
    }}
  >
    <InventoryStack.Screen
      name="InventoryList"
      component={InventoryScreen}
    />
    <InventoryStack.Screen
      name="InventoryDetail"
      component={InventoryDetailScreen}
    />
    <InventoryStack.Screen
      name="InventoryStats"
      component={InventoryStatsScreen}
    />
  </InventoryStack.Navigator>
);

const NotificationsStackNavigator = () => (
  <NotificationsStack.Navigator
    screenOptions={{
      header: () => <CustomHeader />
    }}
  >
    <NotificationsStack.Screen
      name="NotificationsList"
      component={NotificationsScreen}
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