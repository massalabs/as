'use strict';
import { TransformVisitor } from 'visitor-as';
import { Parser, Source, SourceKind } from 'assemblyscript/dist/assemblyscript.js';



/**
 * Replace a source file and parse it again after modification.
 *
 * You should extend this class as a normal Transformer.
 */
class Replacer extends TransformVisitor {
  updates;

  /**
     * Save the new content to replace the current one with.
     * @param {update} update
     * @param {integer} update.begin replacement offset
     * @param {integer} update.end replacement end
     * @param {string} update.content replacement value
     */
  addUpdate(update) {
    this.updates.push(update);
  }

  /**
   * Function returning if a source is to be processed or nor.
   *
   * @param {Source} _
   * @return {boolean} true if the source is to be visited.
   */
  isToTransform(_) {
    return false;
  }

  /**
   * Use AS compilation hook.
   * @param {Parser} parser
   */
  afterParse(parser) {
    const newParser = new Parser(parser.diagnostics);

    // filters files that we should visit
    const files = parser.sources.filter(this.isToTransform);

    // Visits and potentially updates each file
    files.forEach((source) => {
      this.updates = [];

      super.visit(source);

      // Nothing to update, bye!
      if (this.updates.length == 0) return;

      // Removes from logs in parser
      parser.donelog.delete(source.internalPath);
      parser.seenlog.delete(source.internalPath);

      // Removes from programs sources
      parser.sources = parser.sources.filter(
        (_source) => _source !== source
      );
      this.program.sources = this.program.sources.filter(
        (_source) => _source !== source
      );

      // Let's transform the file
      let newContent = source.text;

      // we need to do it bottom up to avoid index conflicts
      for (let index = this.updates.length - 1; index >= 0; index--) {
        newContent = newContent.slice(0, this.updates[index].begin) + this.updates[index].content + newContent.slice(this.updates[index].end);
      }

      console.log('after', newContent);

      // Parses file and any new imports added to the source
      newParser.parseFile(
        newContent,
        source.normalizedPath,
        source.range.source.sourceKind == SourceKind.USER_ENTRY,
      );

      const newSource = newParser.sources.pop();

      if (newSource === undefined) throw new Error('Source is undefined after effective transform.');

      this.program.sources.push(newSource);
      parser.donelog.add(source.internalPath);
      parser.seenlog.add(source.internalPath);
      parser.sources.push(newSource);
    });
  }
}

export { Replacer };