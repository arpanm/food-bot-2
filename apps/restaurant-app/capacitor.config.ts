import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.foodbot.restaurant',
  appName: 'Food Bot Restaurant',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
