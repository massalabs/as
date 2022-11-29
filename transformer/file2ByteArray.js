/* eslint-disable max-len */
import {Replacer} from './index.js';
import * as fs from 'fs';

/**
 * File2ByteArray
 *
 * Replace the fileToByteArray call by a Static Array<u8> including the file 
 * assemblyscript code that use unittest functions.
 */
class File2ByteArray extends Replacer {
  /**
     * Filters all standard (library) files.
     *
     * @param {Source} src
     * @return {bool}
     */
  isToTransform(src) {
    return !src.isLibrary && !src.internalPath.startsWith(`~lib/`);
  }

  /**
   * Replaces the fileToByteArray Call
   *
   * 
   *
   * @param {Node} node
   * @return {Node}
   */
  visitCallExpression(node) {
    if (node.expression.text == 'fileToByteArray') {      

      const data = JSON.stringify(fs.readFileSync(node.args[0].value).toJSON().data);  
      const   result = `const bytes : StaticArray<u8> = ${data} `;
      // magic function define at parent level that will:
      // - remove the code used here from the initial file content
      // - create a new file with the generated tests
      this.addUpdate({
        begin: node.range.start,
        end: node.range.end + 2, // +2 to include the trailing semicolon and new line (;\n)
        content: result,
      });
    } 

    return super.visitCallExpression(node);
  }
}

export default File2ByteArray;
