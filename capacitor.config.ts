import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.1611156aef0444539ec63614710539dd',
  appName: 'blatt',
  webDir: 'dist',
  server: {
    url: 'https://1611156a-ef04-4453-9ec6-3614710539dd.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    backgroundColor: '#0d1117',
  },
  android: {
    backgroundColor: '#0d1117',
  },
};

export default config;
