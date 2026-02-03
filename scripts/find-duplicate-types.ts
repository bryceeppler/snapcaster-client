// scripts/find-duplicate-types.ts
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import * as ts from 'typescript';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const typeDefinitions = new Map<string, string[]>();

// Directories to ignore
const ignoredDirectories = [
  'node_modules',
  '.next',
  'dist',
  '.git',
  '.github',
  '.vscode'
];

function shouldIgnoreDirectory(dirPath: string): boolean {
  const dirName = path.basename(dirPath);
  return ignoredDirectories.includes(dirName);
}

function findTypeDefinitions(directory: string) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // Skip ignored directories
      if (shouldIgnoreDirectory(filePath)) {
        continue;
      }
      findTypeDefinitions(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const sourceFile = ts.createSourceFile(
        filePath,
        content,
        ts.ScriptTarget.Latest,
        true
      );

      sourceFile.forEachChild((node) => {
        if (
          ts.isInterfaceDeclaration(node) ||
          (ts.isTypeAliasDeclaration(node) && node.name)
        ) {
          const typeName = node.name.text;
          if (!typeDefinitions.has(typeName)) {
            typeDefinitions.set(typeName, []);
          }
          typeDefinitions.get(typeName)?.push(filePath);
        }
      });
    }
  }
}

findTypeDefinitions(projectRoot);

// // Print duplicate types
// console.log('Potential duplicate type definitions:');
// for (const [typeName, files] of typeDefinitions.entries()) {
//   if (files.length > 1) {
//     console.log(`Type "${typeName}" defined in ${files.length} files:`);
//     files.forEach((file) =>
//       console.log(`  - ${path.relative(projectRoot, file)}`)
//     );
//   }
// }
