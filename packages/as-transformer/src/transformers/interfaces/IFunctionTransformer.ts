import {
  FunctionDeclaration,
  Source,
} from 'assemblyscript/dist/assemblyscript.js';
import { MassaFunctionNode } from '../../helpers/node';

/**
 * An interface to implement a function declaration node transformer.
 */
export interface IFunctionTransformer {
  /**
   * This function is the validator to call the {@link transform} method of the transformer.
   *
   * @remarks
   * You can choose to always return true if you want your transformer to operate on any functions.
   * Keep in mind that a good way to transform specific functions is by using custom decorators.
   *
   * @see {@link MassaExport.isMatching} for an example of decorator matching transformer.
   *
   * @param node - The function declaration AST Node.
   *
   * @returns true if the transformer has to operate on the given declaration
   */
  isMatching(node: MassaFunctionNode): bool;

  /**
   * The function that operates a transformation on a {@link FunctionDeclaration}.
   *
   * @param node - The function declaration AST Node.
   *
   * @returns The transformed function declaration node.
   */
  transform(node: MassaFunctionNode): FunctionDeclaration;

  /**
   * This function is used to add additional source to compilation if needed by transformations.
   *
   * @remarks
   * This function will be called after parsing and transformations.
   *
   * @see {@link TransformUpdates} to pass information from transformation to this function.
   *
   * @param parser - The code parser used at parse time before compilation.
   * @param source - The source code of the parsed and transformed file.
   */
  getAdditionalSources(source: Source): string[];

  /**
   * This function is used to further manually update the parsed source to compilation.
   *
   * @remarks
   * This function will be called after parsing and transformations.
   *
   * @see {@link TransformUpdates} to pass information from transformation to this function.
   *
   * @param parser - The code parser used at parse time before compilation.
   * @param source - The source code of the parsed and transformed file.
   */
  updateSource(source: Source): string | undefined;
}
