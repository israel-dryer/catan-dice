import {Injectable, OnDestroy} from '@angular/core';
import {db} from "../shared/database";
import {createHistogram} from "../shared/utilities";
import {Player} from "../shared/types";
import {BehaviorSubject} from "rxjs";
import {liveQuery} from "dexie";

@Injectable({
  providedIn: 'root'
})
export class PlayerService implements OnDestroy {

  _activePlayer: Player | undefined;
  private activePlayerSub: any;
  readonly activePlayerChanged = new BehaviorSubject<Player|undefined>(undefined);

  constructor() {
    const activePlayer = localStorage.getItem('CatanDice.activePlayer');
    if (activePlayer) {
      this.setActivePlayer(JSON.parse(activePlayer));
    }
  }

  ngOnDestroy() {
    this.activePlayerSub?.unsubscribe();
  }

  async getPlayerCount() {
    const activePlayers = await this.getActivePlayers();
    return activePlayers.length;
  }

  async createPlayer(name: string) {
    const result = await db.players.add(
      {
        name,
        isUser: 0,
        isActive: 1,
        histogram: createHistogram(),
        lastPlayed: 0,
        gamesPlayed: 0,
        gamesWon: 0,
        secondsPlayed: 0,
        fastestWinSeconds: 0,
        longestWinsStreak: 0,
        robberRolls: 0,
        totalRolls: 0
      }
    );
    return result;
  }

  setActivePlayer = (player: Player) => {
    this._activePlayer = player;
    if (this._activePlayer) {
      localStorage.setItem('CatanDice.activePlayer', JSON.stringify(player));
      this.activePlayerSub?.unsubscribe();
      this.activePlayerSub = liveQuery(() => this.getPlayer(this._activePlayer!.id!))
        .subscribe(player => {
          this._activePlayer = player;
          this.activePlayerChanged.next(this._activePlayer!);
        });
    }
  }

  resetActivePlayer = () => {
    this._activePlayer = undefined;
  }

  getActivePlayer() {
    return this._activePlayer;
  }

  async updatePlayer(id: number, changes: Record<string, any>) {
    await db.players.update(id, changes);
  }

  async deactivatePlayer(id: number) {
    const result = await db.players.update(id, {isActive: 0});
    return result;
  }

  getPlayer(id: number) {
    return db.players.get(id);
  }

  getPlayers() {
    return db.players.toArray();
  }

  getActivePlayers() {
    return db.players.where({isActive: 1}).toArray();
  }

  getUserPlayer() {
    return db.players.where({isUser: 1, isActive: 1}).first();
  }

  async bookmarkPlayer(id?: number) {
    const players = await db.players.toArray();
    for (const player of players) {
      db.players.update(player.id!, {isUser: 0});
    }
    if (id) {
      db.players.update(id, {isUser: 1});
    }
  }

}
