import { UIAppStore } from '@/libs/redux/uistore';

declare global {
  interface Window {
    store?: UIAppStore;
    triggerAutoLogout?: () => void;
  }
}

export {};