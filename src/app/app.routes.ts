import {Routes} from '@angular/router';
import {authGuard} from './shared/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tabs/home',
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'game-detail',
    canActivate: [authGuard],
    loadComponent: () => import('./game/game-detail/game-detail.page').then(m => m.GameDetailPage)
  },
  {
    path: 'tabs',
    canActivate: [authGuard],
    loadComponent: () => import('./root-tabs/root-tabs.component').then((m => m.RootTabsComponent)),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'app-settings',
        loadComponent: () => import('./settings/app-settings/app-settings.page').then(m => m.AppSettingsPage)
      },
      {
        path: 'players',
        loadComponent: () => import('./player/player-list/player-list.page').then(m => m.PlayerListPage)
      },
      {
        path: 'my-stats',
        loadComponent: () => import('./player/user-detail/user-detail.page').then(m => m.UserDetailPage)
      },
    ]
  },
  {
    path: 'playground',
    canActivate: [authGuard],
    children: [
      {
        path: '', loadComponent: () => import('./play/playground/playground.page').then(m => m.PlaygroundPage),
      },
      {
        path: 'setup',
        loadComponent: () => import('./play/setup/setup.page').then(m => m.SetupPage)
      },
      {
        path: 'detail',
        loadComponent: () => import('./play/play-detail/play-detail.page').then(m => m.PlayDetailPage)
      },
    ]
  },
  {
    path: 'player-detail',
    canActivate: [authGuard],
    loadComponent: () => import('./player/player-detail/player-detail.page').then(m => m.PlayerDetailPage)
  }
];
