import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.foodbot.customer',
  appName: 'Food Bot Customer',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
