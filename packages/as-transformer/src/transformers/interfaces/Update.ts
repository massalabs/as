// import Debug from 'debug';

export enum UpdateType {
  FunctionDeclaration,
  FunctionCall,
  Argument,
  Other,
}
export class Update {
  private contentType: UpdateType;
  private content: string;
  private data: Map<string, string[]>;
  private from: string;

  constructor(
    contentType: UpdateType,
    content: string,
    data: Map<string, string[]>,
    from: string,
  ) {
    // Debug.log(
    //   'New Update:\n\tcontentType:',
    //   contentType,
    //   '\n\tcontent:',
    //   content,
    //   '\n\tdata:',
    //   data,
    //   '\n\tfrom:',
    //   from,
    // );
    this.contentType = contentType;
    this.content = content;
    this.data = data;
    this.from = from;
  }

  getContentType(): UpdateType {
    return this.contentType;
  }

  getContent(): string {
    return this.content;
  }

  getData(): Map<string, string[]> {
    return this.data;
  }

  getFrom(): string {
    return this.from;
  }
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
