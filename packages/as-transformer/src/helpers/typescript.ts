import { EnumDeclaration, Project, SourceFile } from 'ts-morph';

export function getDependencies(file: string): string[] {
  const project = new Project();
  project.addSourceFileAtPath(file);

  const dependencies = new Set<string>();

  getAllDependencies(project.getSourceFiles(), dependencies);

  const subpath = file[0] == '.' ? file.substring(1) : file;

  return Array.from(dependencies).filter((d) => d.indexOf(subpath) < 0);
}

function getAllDependencies(
  sourceFiles: SourceFile[],
  dependencies: Set<string>,
): void {
  for (const sourceFile of sourceFiles) {
    // Load dependencies from import declarations
    const importDeclarations = sourceFile.getImportDeclarations();
    const importedSources = importDeclarations
      .map((imp) => imp.getModuleSpecifierSourceFile())
      .filter((src) => src != undefined) as SourceFile[];

    // Load dependencies from exported declarations
    const exportedDeclarationsArray = Array.from(
      sourceFile.getExportedDeclarations().values(),
    ).flat() as Array<EnumDeclaration | undefined>;

    const exportedSourceFiles = exportedDeclarationsArray
      .filter(
        (exportedDeclaration) =>
          exportedDeclaration &&
          typeof exportedDeclaration.getSourceFile === 'function',
      )
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .map((exportedDeclaration) => exportedDeclaration!.getSourceFile());

    const sources = [...importedSources, ...exportedSourceFiles];

    for (const source of sources) {
      const importedFilePath = source.getFilePath();
      if (!dependencies.has(importedFilePath)) {
        dependencies.add(importedFilePath);
        getAllDependencies([source], dependencies);
      }
    }
  }
}
