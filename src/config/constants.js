// API Configuration
export const API_URL = 'http://10.0.2.2:3000';

// App Theme Colors
export const COLORS = {
  primary: '#2196F3',
  secondary: '#757575',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
  background: '#f5f5f5',
  white: '#ffffff',
  black: '#000000',
  gray: {
    100: '#f8f9fa',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#6c757d',
    700: '#495057',
    800: '#343a40',
    900: '#212529',
  },
};

// Status Colors
export const STATUS_COLORS = {
  pending: '#FFC107',
  inProgress: '#2196F3',
  completed: '#4CAF50',
  cancelled: '#F44336',
};

// Priority Colors
export const PRIORITY_COLORS = {
  high: '#F44336',
  medium: '#FFC107',
  low: '#4CAF50',
};

// Stock Status Colors
export const STOCK_STATUS_COLORS = {
  inStock: '#4CAF50',
  lowStock: '#FFC107',
  outOfStock: '#F44336',
  ordered: '#2196F3',
};

// Maintenance Types
export const MAINTENANCE_TYPES = {
  preventive: 'preventive',
  corrective: 'corrective',
};

// Task Status Options
export const TASK_STATUS_OPTIONS = [
  { label: 'Pendiente', value: 'pending' },
  { label: 'En Progreso', value: 'inProgress' },
  { label: 'Completado', value: 'completed' },
  { label: 'Cancelado', value: 'cancelled' },
];

// Priority Options
export const PRIORITY_OPTIONS = [
  { label: 'Alta', value: 'high' },
  { label: 'Media', value: 'medium' },
  { label: 'Baja', value: 'low' },
];

// Stock Status Options
export const STOCK_STATUS_OPTIONS = [
  { label: 'En Stock', value: 'inStock' },
  { label: 'Stock Bajo', value: 'lowStock' },
  { label: 'Sin Stock', value: 'outOfStock' },
  { label: 'Ordenado', value: 'ordered' },
];

// Notification Types
export const NOTIFICATION_TYPES = {
  preventiveMaintenance: 'preventive_maintenance',
  correctiveMaintenance: 'corrective_maintenance',
  inventory: 'inventory',
  alert: 'alert',
};

// Date Format Options
export const DATE_FORMAT_OPTIONS = {
  full: {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
  short: {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  },
  time: {
    hour: '2-digit',
    minute: '2-digit',
  },
};

// Pagination
export const ITEMS_PER_PAGE = 20;

// Chart Configuration
export const CHART_CONFIG = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

// Animation Durations
export const ANIMATION_DURATION = 300; // milliseconds

// Local Storage Keys
export const STORAGE_KEYS = {
  authToken: '@auth_token',
  userPreferences: '@user_preferences',
  lastSync: '@last_sync',
};