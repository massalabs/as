export interface Update {
  begin: number;
  end: number;
  content: string;
  data: Map<string, string[]>;
}
