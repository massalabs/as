export interface Update {
  begin: number;
  end: number;
  content: string;
  data: Map<string, string[]>;
  transformerSource: string;
}

/**
 * This class is used to store transform information to later used them on sources
 * after transformations in the 'afterParse' hook.
 */
export class TransformUpdates {
  private static Updates: Update[] = [];

  static resetUpdates() {
    TransformUpdates.Updates = [];
  }

  static getUpdates(): Update[] {
    return TransformUpdates.Updates;
  }

  static addUpdate(update: Update) {
    TransformUpdates.Updates.push(update);
  }
}
