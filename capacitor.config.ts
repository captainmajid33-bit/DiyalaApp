import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.diyala.app',
  appName: 'DiyalaApp',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;