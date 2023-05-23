export interface Update {
  begin: number;
  end: number;
  content: string;
  data: Map<string, string[]>;
  from: string;
}

export class GlobalUpdates {
  static updates: Update[] = [];

  static get() {
    return GlobalUpdates.updates;
  }

  static add(update: Update) {
    GlobalUpdates.updates.push(update);
  }

  static reset() {
    GlobalUpdates.updates = [];
  }
}
