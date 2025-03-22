import {inject, Injectable, OnDestroy, signal} from '@angular/core';
import {AlertController} from '@ionic/angular/standalone';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {initializeApp, FirebaseApp} from 'firebase/app';
import {Firestore, initializeFirestore, persistentLocalCache} from 'firebase/firestore';
import {
  getAuth,
  Auth,
  signInWithCredential,
  initializeAuth,
  indexedDBLocalPersistence,
  GoogleAuthProvider,
} from 'firebase/auth';
import {Capacitor} from '@capacitor/core';
import {FirebaseAuthentication, User} from '@capacitor-firebase/authentication';

const firebaseConfig = {
  apiKey: 'AIzaSyBza3fELKKd35bjznusXoFWGUZbCnebPKU',
  authDomain: 'settlers-depot.firebaseapp.com',
  projectId: 'settlers-depot',
  storageBucket: 'settlers-depot.appspot.com',
  messagingSenderId: '610977662015',
  appId: '1:610977662015:web:42b09bdfea67fb06aca48a',
  measurementId: 'G-3N1RN5ZXFY',
};

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private readonly auth: Auth;
  private readonly alertController = inject(AlertController);
  private readonly router = inject(Router);

  readonly app: FirebaseApp;
  readonly firestore: Firestore;

  readonly emailForSignIn = signal<string>('');
  readonly user = signal<User | null>(null);

  constructor() {
    this.emailForSignIn.set(localStorage.getItem('emailForSignIn') ?? '');

    this.app = initializeApp(firebaseConfig);
    this.firestore = initializeFirestore(this.app, {localCache: persistentLocalCache()});

    if (Capacitor.isNativePlatform()) {
      this.auth = initializeAuth(this.app, {persistence: indexedDBLocalPersistence});
    } else {
      this.auth = getAuth(this.app);
    }

    FirebaseAuthentication.addListener('authStateChange', (e) => {
      if (e.user) {
        this.user.set(e.user);
        console.log('authenticated', e);
      } else {
        // clear sd-uid when logging out
        localStorage.removeItem('sd-uid');
        localStorage.removeItem('sd-init');
      }
    }).then();
  }

  async ngOnDestroy() {
    await FirebaseAuthentication.removeAllListeners();
  }

  login = async (email: string, password: string) => {
    try {
      const result = await FirebaseAuthentication.signInWithEmailAndPassword({email, password});
      if (!result?.user?.emailVerified) {
        const alert = await this.alertController.create({
          message: 'Your account has not yet been verified. Please check your email for instructions.',
          buttons: ['Ok'],
        });
        await alert.present();
        return result;
      }
      await this.router.navigate(['/', 'home']);
    } catch (e: any) {
      const alert = await this.alertController.create({message: 'Invalid email or password', buttons: ['Ok']});
      await alert.present();
      return e;
    }
  };

  loginWithGoogle = async () => {
    try {
      const result = await FirebaseAuthentication.signInWithGoogle();
      // add credential if on android device
      if (Capacitor.isNativePlatform()) {
        const credential = GoogleAuthProvider.credential(result.credential?.idToken);
        if (credential) {
          await signInWithCredential(this.auth, credential);
        }
      }
      await this.router.navigate(['/', 'home']);
    } catch (e) {
      alert(e);
    }
  };

  logout = async () => {
    await FirebaseAuthentication.signOut();
    await this.router.navigate(['/', 'login']);
  };

  resetPassword = async (email: string) => {
    await FirebaseAuthentication.sendPasswordResetEmail({email});
    const alert = await this.alertController.create({
      message: 'Check your email for instructions on resetting your password',
      buttons: ['Ok'],
    });
    await alert.present();
  };

  canActivate = async () => {
    await this.auth.authStateReady();
    if (this.auth.currentUser) {
      return true;
    } else {
      this.router.navigate(['/', 'login']).then();
      return false;
    }
  };
}

export const appAuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(AuthService).canActivate();
};
