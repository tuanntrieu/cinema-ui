import { Injectable } from '@angular/core';

interface PaginationState {
  page: number;
  rows: number;
  tabId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaginationStateService {
  private states: { [key: string]: PaginationState } = {};

  setPaginationState(key: string, state: Partial<PaginationState>): void {
    const currentState = this.states[key] ?? { page: 0, rows: 4 };
    this.states[key] = { ...currentState, ...state };
  }

  getPaginationState(key: string): PaginationState {
    return this.states[key] ?? { page: 0, rows: 4 };
  }

}
