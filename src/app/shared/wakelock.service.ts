import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WakeLockService {

  private wakeLock: WakeLockSentinel | null = null;
  private isSupported = false;

  constructor() {
    this.isSupported = typeof navigator !== 'undefined' && 'wakeLock' in navigator;
  }

  async acquire(): Promise<boolean> {
    if (!this.isSupported) {
      return false;
    }

    try {
      this.wakeLock = await navigator.wakeLock.request('screen');
      this.wakeLock.addEventListener('release', () => {
        this.wakeLock = null;
      });
      return true;
    } catch (e) {
      console.warn('Wake lock request failed:', e);
      return false;
    }
  }

  async release(): Promise<void> {
    if (this.wakeLock) {
      try {
        await this.wakeLock.release();
        this.wakeLock = null;
      } catch (e) {
        console.warn('Wake lock release failed:', e);
      }
    }
  }

  isActive(): boolean {
    return this.wakeLock !== null;
  }

  checkSupported(): boolean {
    return this.isSupported;
  }
}
