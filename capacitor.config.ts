import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.arzmadeit.blatt',
  appName: 'Blatt',
  webDir: 'dist',
  server: {
    url: 'https://blatt.lovable.app',
    cleartext: false
  }
};

export default config;
