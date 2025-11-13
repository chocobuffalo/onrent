import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.onrentx.app',
  appName: 'onrentx',
  webDir: 'public',
  server: {
    url: 'https://onrent-opal.vercel.app/', // 👈 tu dominio desplegado
    cleartext: false            // true solo si usas http:// en desarrollo
  }
};

export default config;
