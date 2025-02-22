import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'net.appforia.settlersdice',
  appName: 'Settlers Dice',
  webDir: 'www',
  backgroundColor: '#285021',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      backgroundColor: '#285021',
      splashFullScreen: false,
      splashImmersive: false,
    }
  }
};

export default config;
