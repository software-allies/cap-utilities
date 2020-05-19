import * as ts from 'typescript';
import { strings } from '@angular-devkit/core';
import { dirname } from 'path';
import { normalize } from '@angular-devkit/core';
import { getFileContent } from '@schematics/angular/utility/test';
import { buildRelativePath } from '@schematics/angular/utility/find-module';
import { appendHtmlElementToHead } from '@angular/cdk/schematics/utils/html-head-element';
import { getChildElementIndentation } from '@angular/cdk/schematics/utils/parse5-element';
import { InsertChange, Change, NoopChange } from '@schematics/angular/utility/change';
import { Rule, SchematicsException, Tree, UpdateRecorder } from '@angular-devkit/schematics';
import { DefaultTreeDocument, DefaultTreeElement, parse as parseHtml } from 'parse5';

//Importing interfaces
import { OptionsI, EnvI, routerPathI } from './interface/interfaces';
import { importElementsModule } from './interface/interfaces';

const CONFIG_PATH = 'angular.json';

let source;
let elementPath;
let relativePath;
let classifiedName;
let declarationChanges;
let declarationRecorder;


/**
 * Remove content from specified file.
 * @param host
 * @param filePath Path of the file that's going to be deleted.
 * @return The updated tree.
*/
export function removeContentFromFile(host: Tree, filePath: string) {
  const fileBuffer = host.read(filePath);
  if (!fileBuffer) {
    throw new SchematicsException(`Could not read file for path: ${filePath}.`);
  }
  host.overwrite(filePath, '');
  return host;
}

/**
 * Appends a fragment to the start file.
 * @param host
 * @param filePath
 * @param fragment The maximum number of items to return.
 * @return A tree with the updates
*/
export function appendToStartFile(host: Tree, filePath: string, fragment: string) {
  const fileBuffer = host.read(filePath);
  if (!fileBuffer) {
    throw new SchematicsException(`Could not read file for path: ${filePath}.`);
  }
  const content = fileBuffer.toString();
  if (content.includes(fragment)) {
    return;
  }
  const insertion = `${' '.repeat(0)}${fragment}`;
  let recordedChange: UpdateRecorder;
  recordedChange = host
    .beginUpdate(filePath)
    .insertRight(0, `${insertion}\n`);
  host.commitUpdate(recordedChange);
}

/**
 * Appends the given element HTML fragment to the `<body>` element of the specified HTML file.
 * @param host
 * @param filePath
 * @param fragment The maximum number of items to return.
 * @return all nodes of kind, or [] if none is found
 */
export function appendHtmlElementToBody(host: Tree, htmlFilePath: string, elementHtml: string, side: string = 'right') {
  const htmlFileBuffer = host.read(htmlFilePath);

  if (!htmlFileBuffer) {
    throw new SchematicsException(`Could not read file for path: ${htmlFilePath}`);
  }

  const htmlContent = htmlFileBuffer.toString();

  if (htmlContent.includes(elementHtml)) {
    return;
  }

  const bodyTag = getHtmlBodyTagElement(htmlContent);

  if (!bodyTag) {
    throw Error(`Could not find '<body>' element in HTML file: ${htmlFileBuffer}`);
  }

  // We always have access to the source code location here because the `getHtmlBodyTagElement`
  // function explicitly has the `sourceCodeLocationInfo` option enabled.

  if (bodyTag.sourceCodeLocation!.endTag) {
    const endTagOffset = bodyTag.sourceCodeLocation!.endTag.startOffset;
    const startTagOffset = bodyTag.sourceCodeLocation!.startTag.endOffset;
    const indentationOffset = getChildElementIndentation(bodyTag);
    const insertion = `${' '.repeat(indentationOffset)}${elementHtml}`;

    let recordedChange: UpdateRecorder;

    if (side === 'left') {
      recordedChange = host
        .beginUpdate(htmlFilePath)
        .insertLeft(startTagOffset, `${insertion}\n`);
      host.commitUpdate(recordedChange);
    } else if (side === 'right') {
      recordedChange = host
        .beginUpdate(htmlFilePath)
        .insertRight(endTagOffset, `${insertion}\n`);
      host.commitUpdate(recordedChange);
    }
  }

}

/**
 * Adds a class to the body of the document..
 * @param host
 * @param filePath
 * @param fragment The maximum number of items to return.
 * @return all nodes of kind, or [] if none is found
*/
export function addBodyClass(host: Tree, htmlFilePath: string, className: string): void {
  const htmlFileBuffer = host.read(htmlFilePath);

  if (!htmlFileBuffer) {
    throw new SchematicsException(`Could not read file for path: ${htmlFilePath}`);
  }

  const htmlContent = htmlFileBuffer.toString();
  const body = getElementByTagName('body', htmlContent);

  if (!body) {
    throw Error(`Could not find <body> element in HTML file: ${htmlFileBuffer}`);
  }

  const classAttribute = body.attrs.find(attribute => attribute.name === 'class');

  if (classAttribute) {
    const hasClass = classAttribute.value.split(' ').map(part => part.trim()).includes(className);

    if (!hasClass) {
      const classAttributeLocation = body.sourceCodeLocation!.attrs.class;
      const recordedChange = host
        .beginUpdate(htmlFilePath)
        .insertRight(classAttributeLocation.endOffset - 1, ` ${className}`);
      host.commitUpdate(recordedChange);
    }
  } else {
    const recordedChange = host
      .beginUpdate(htmlFilePath)
      .insertRight(body.sourceCodeLocation!.startTag.endOffset - 1, ` class="${className}"`);
    host.commitUpdate(recordedChange);
  }
}

/**
 * Parses the given HTML file and returns the body element if available.
 * @param host
 * @param filePath
 * @param fragment The maximum number of items to return.
 * @return all nodes of kind, or [] if none is found
*/
function getHtmlBodyTagElement(htmlContent: string): DefaultTreeElement | null {
  return getElementByTagName('body', htmlContent);
}

/**
 * Finds an element by its tag name.
 * @param host
 * @param filePath Path of the file that's going to verify.
 * @param fragment The maximum number of items to return.
 * @return The function returns either a node or a null in case that it wasn't found it
*/
function getElementByTagName(tagName: string, htmlContent: string): DefaultTreeElement | null {
  const document = parseHtml(htmlContent, { sourceCodeLocationInfo: true }) as DefaultTreeDocument;
  const nodeQueue = [...document.childNodes];

  while (nodeQueue.length) {
    const node = nodeQueue.shift() as DefaultTreeElement;

    if (node.nodeName.toLowerCase() === tagName) {
      return node;
    } else if (node.childNodes) {
      nodeQueue.push(...node.childNodes);
    }
  }
  return null;
}

/**
 * Appends fragment to the specified file.
 * @param host
 * @param filePath
 * @param fragment The maximum number of items to return.
 * @return all nodes of kind, or [] if none is found
*/

export function updateIndexHeadFile(hostP: Tree, path: string, arrayLinks: string[]): Rule {
  return (host: Tree = hostP) => {
    /** Appends the given element HTML fragment to the `<head>` element of the specified HTML file. */
    arrayLinks.map((element: string) => {
      appendHtmlElementToHead(host, path, element);
    });

    return host;
  };
}

/**
* Function to add styles into the angular.json.
* @param host
* @param stylePaths array of strings
* @return all nodes of kind, or [] if none is found
*/
export function addStylesToAngularJSON(host: Tree, stylePaths: any[]) {
  if (stylePaths.length > 0) {
    return stylePaths.map(src => {
      addStyle(host, `${src}`);
    });
  }
}

/**
  * Appends fragment to the specified file.
  * @param host
  * @param options
  * @return all nodes of kind, or [] if none is found
*/
export function readIntoSourceFile(host: Tree, filePath: string) {
  const text = host.read(filePath);
  if (text === null) {
    throw new SchematicsException(`File ${filePath} does not exist.`);
  }
  return ts.createSourceFile(filePath, text.toString('utf-8'), ts.ScriptTarget.Latest, true);
}


function resetValuesImports() {
  declarationChanges = null;
  declarationRecorder = null;
  elementPath = null;
  relativePath = null;
  classifiedName = null;
  declarationChanges = null;
  declarationRecorder = null;
}
/**
  * Add the a modules, components or services into the declaration module
  * @param options 
  * @param elementsToImport @interface importElementsModule
  * @return a updated host
*/
export function addToNgModule(host: Tree, options: OptionsI, elementsToImport: importElementsModule[]) {

  const modulePath = options.module;
  // Import Header Component and declare

  elementsToImport.forEach(element => {

    switch (element.type.toUpperCase()) {
      case 'COMPONENT':
        source = source = readIntoSourceFile(host, modulePath);
        resetValuesImports();

        elementPath = `${options.path}/${element.path}`;
        relativePath = buildRelativePath(modulePath, elementPath);
        classifiedName = strings.classify(`${element.name}`);
        declarationChanges = addDeclarationToModule(
          source,
          modulePath,
          classifiedName,
          relativePath);

        declarationRecorder = host.beginUpdate(modulePath);
        console.log('modulePath: ', modulePath);
        for (const change of declarationChanges) {
          if (change instanceof InsertChange) {
            declarationRecorder.insertLeft(change.pos, change.toAdd);
          }
        }
        host.commitUpdate(declarationRecorder);
        break;
      case 'MODULE' || 'DIRECTIVE':
        source = source = readIntoSourceFile(host, modulePath);
        resetValuesImports();

        if (element.path.charAt(0) === '@') {
          relativePath = element.path;
        } else {
          elementPath = `${options.path}/${element.path}`;
          relativePath = buildRelativePath(modulePath, elementPath);
        }
        classifiedName = strings.classify(`${element.name}`);
        declarationChanges = addImportToModule(
          source,
          modulePath,
          classifiedName,
          relativePath);

        declarationRecorder = host.beginUpdate(modulePath);
        for (const change of declarationChanges) {
          if (change instanceof InsertChange) {
            declarationRecorder.insertLeft(change.pos, change.toAdd);
          }
        }
        host.commitUpdate(declarationRecorder);

        break;

      default:
        source = source = readIntoSourceFile(host, modulePath);
        resetValuesImports();
        // Need to refresh the AST because we overwrote the file in the host.
        relativePath = `./${element.path}`;
        classifiedName = strings.classify(element.name);
        const providerRecorder = host.beginUpdate(modulePath);
        const providerChanges: any = addProviderToModule(
          source,
          modulePath,
          classifiedName,
          relativePath);

        for (const change of providerChanges) {
          if (change instanceof InsertChange) {
            providerRecorder.insertLeft(change.pos, change.toAdd);
          }
        }
        host.commitUpdate(providerRecorder);
        break;
    }

  });

}

/**
  * Appends fragment to the specified file.
  * @param host
  * @param options
  * @return a updated file all nodes of kind, or [] if none is found
*/
export function addRoutes(host: Tree, routingPath: string, routePaths: routerPathI[], srcImport: string): Rule {
  return (hostP: Tree = host) => {


    // Add routes to routing
    let toAdd = ''
    routePaths.forEach(data => {
      toAdd = toAdd + `{
        path:'${data.path}', pathMatch: '${data.pathMatch}', component: ${data.component}}, `
    });

    const component = getFileContent(hostP, routingPath);
    hostP.overwrite(routingPath, component.replace(`const routes: Routes = [`, `const routes: Routes = [${toAdd}`));

    // Add import to routing
    const content =
      `
${srcImport}`;

    appendToStartFile(hostP, routingPath, content);
    return hostP;
  };
}

/**
 * Add Import `import { symbolName } from fileName` if the import doesn't exit 
 * already. Assumes fileToEdit can be resolved and accessed.
 * @param fileToEdit (file we want to add import to)
 * @param symbolName (item to import)
 * @param fileName (path to the file)
 * @param isDefault (if true, import follows style for importing default exports)
 * @return Change
 */
function insertImport(source: ts.SourceFile, fileToEdit: string, symbolName: string,
  fileName: string, isDefault = false): Change {
  const rootNode = source;
  const allImports = findNodes(rootNode, ts.SyntaxKind.ImportDeclaration);

  // get nodes that map to import statements from the file fileName
  const relevantImports = allImports.filter(node => {
    // StringLiteral of the ImportDeclaration is the import file (fileName in this case).
    const importFiles = node.getChildren()
      .filter(child => child.kind === ts.SyntaxKind.StringLiteral)
      .map(n => (n as ts.StringLiteral).text);

    return importFiles.filter(file => file === fileName).length === 1;
  });

  if (relevantImports.length > 0) {
    let importsAsterisk = false;
    // imports from import file
    const imports: ts.Node[] = [];
    relevantImports.forEach(n => {
      Array.prototype.push.apply(imports, findNodes(n, ts.SyntaxKind.Identifier));
      if (findNodes(n, ts.SyntaxKind.AsteriskToken).length > 0) {
        importsAsterisk = true;
      }
    });

    // if imports * from fileName, don't add symbolName
    if (importsAsterisk) {
      return new NoopChange();
    }

    const importTextNodes = imports.filter(n => (n as ts.Identifier).text === symbolName);

    // insert import if it's not there
    if (importTextNodes.length === 0) {
      const fallbackPos =
        findNodes(relevantImports[0], ts.SyntaxKind.CloseBraceToken)[0].getStart() ||
        findNodes(relevantImports[0], ts.SyntaxKind.FromKeyword)[0].getStart();

      return insertAfterLastOccurrence(imports, `, ${symbolName}`, fileToEdit, fallbackPos);
    }

    return new NoopChange();
  }

  // no such import declaration exists
  const useStrict = findNodes(rootNode, ts.SyntaxKind.StringLiteral)
    .filter((n: ts.StringLiteral) => n.text === 'use strict');
  let fallbackPos = 0;
  if (useStrict.length > 0) {
    fallbackPos = useStrict[0].end;
  }
  const open = isDefault ? '' : '{ ';
  const close = isDefault ? '' : ' }';
  // if there are no imports or 'use strict' statement, insert import at beginning of file
  const insertAtBeginning = allImports.length === 0 && useStrict.length === 0;
  const separator = insertAtBeginning ? '' : ';\n';
  const toInsert = `${separator}import ${open}${symbolName}${close}` +
    ` from '${fileName}'${insertAtBeginning ? ';\n' : ''}`;

  return insertAfterLastOccurrence(
    allImports,
    toInsert,
    fileToEdit,
    fallbackPos,
    ts.SyntaxKind.StringLiteral,
  );
}

/**
 * Find all nodes from the AST in the subtree of node of SyntaxKind kind.
 * @param node
 * @param kind
 * @param max The maximum number of items to return.
 * @param recursive Continue looking for nodes of kind recursive until end
 * the last child even when node of kind has been found.
 * @return all nodes of kind, or [] if none is found
 */
function findNodes(node: ts.Node, kind: ts.SyntaxKind, max = Infinity, recursive = false): ts.Node[] {
  if (!node || max == 0) {
    return [];
  }

  const arr: ts.Node[] = [];
  if (node.kind === kind) {
    arr.push(node);
    max--;
  }
  if (max > 0 && (recursive || node.kind !== kind)) {
    for (const child of node.getChildren()) {
      findNodes(child, kind, max).forEach(node => {
        if (max > 0) {
          arr.push(node);
        }
        max--;
      });

      if (max <= 0) {
        break;
      }
    }
  }

  return arr;
}

/**
 * Get all the nodes from a source.
 * @param sourceFile The source file object.
 * @returns {Observable<ts.Node>} An observable of all the nodes in the source.
 */
function getSourceNodes(sourceFile: ts.SourceFile): ts.Node[] {
  const nodes: ts.Node[] = [sourceFile];
  const result: ts.Node[] = [];

  while (nodes.length > 0) {
    const node = nodes.shift();

    if (node) {
      result.push(node);
      if (node.getChildCount(sourceFile) >= 0) {
        nodes.unshift(...node.getChildren());
      }
    }
  }

  return result;
}

function findNode(node: ts.Node, kind: ts.SyntaxKind, text: string): ts.Node | null {
  if (node.kind === kind && node.getText() === text) {
    // throw new Error(node.getText());
    return node;
  }

  let foundNode: ts.Node | null = null;
  ts.forEachChild(node, childNode => {
    foundNode = foundNode || findNode(childNode, kind, text);
  });

  return foundNode;
}

/**
 * Helper for sorting nodes.
 * @return function to sort nodes in increasing order of position in sourceFile
 */
function nodesByPosition(first: ts.Node, second: ts.Node): number {
  return first.getStart() - second.getStart();
}

/**
 * Insert `toInsert` after the last occurence of `ts.SyntaxKind[nodes[i].kind]`
 * or after the last of occurence of `syntaxKind` if the last occurence is a sub child
 * of ts.SyntaxKind[nodes[i].kind] and save the changes in file.
 *
 * @param nodes insert after the last occurence of nodes
 * @param toInsert string to insert
 * @param file file to insert changes into
 * @param fallbackPos position to insert if toInsert happens to be the first occurence
 * @param syntaxKind the ts.SyntaxKind of the subchildren to insert after
 * @return Change instance
 * @throw Error if toInsert is first occurence but fall back is not set
 */
function insertAfterLastOccurrence(nodes: ts.Node[],
  toInsert: string,
  file: string,
  fallbackPos: number,
  syntaxKind?: ts.SyntaxKind): Change {
  let lastItem: ts.Node | undefined;
  for (const node of nodes) {
    if (!lastItem || lastItem.getStart() < node.getStart()) {
      lastItem = node;
    }
  }
  if (syntaxKind && lastItem) {
    lastItem = findNodes(lastItem, syntaxKind).sort(nodesByPosition).pop();
  }
  if (!lastItem && fallbackPos == undefined) {
    throw new Error(`tried to insert ${toInsert} as first occurence with no fallback position`);
  }
  const lastItemPosition: number = lastItem ? lastItem.getEnd() : fallbackPos;

  return new InsertChange(file, lastItemPosition, toInsert);
}

function _angularImportsFromNode(node: ts.ImportDeclaration,
  _sourceFile: ts.SourceFile): { [name: string]: string } {
  const ms = node.moduleSpecifier;
  let modulePath: string;
  switch (ms.kind) {
    case ts.SyntaxKind.StringLiteral:
      modulePath = (ms as ts.StringLiteral).text;
      break;
    default:
      return {};
  }

  if (!modulePath.startsWith('@angular/')) {
    return {};
  }

  if (node.importClause) {
    if (node.importClause.name) {
      // This is of the form `import Name from 'path'`. Ignore.
      return {};
    } else if (node.importClause.namedBindings) {
      const nb = node.importClause.namedBindings;
      if (nb.kind == ts.SyntaxKind.NamespaceImport) {
        // This is of the form `import * as name from 'path'`. Return `name.`.
        return {
          [(nb as ts.NamespaceImport).name.text + '.']: modulePath,
        };
      } else {
        // This is of the form `import {a,b,c} from 'path'`
        const namedImports = nb as ts.NamedImports;

        return namedImports.elements
          .map((is: ts.ImportSpecifier) => is.propertyName ? is.propertyName.text : is.name.text)
          .reduce((acc: { [name: string]: string }, curr: string) => {
            acc[curr] = modulePath;

            return acc;
          }, {});
      }
    }

    return {};
  } else {
    // This is of the form `import 'path';`. Nothing to do.
    return {};
  }
}

function getDecoratorMetadata(source: ts.SourceFile, identifier: string,
  module: string): ts.Node[] {
  const angularImports: { [name: string]: string }
    = findNodes(source, ts.SyntaxKind.ImportDeclaration)
      .map((node: ts.ImportDeclaration) => _angularImportsFromNode(node, source))
      .reduce((acc: { [name: string]: string }, current: { [name: string]: string }) => {
        for (const key of Object.keys(current)) {
          acc[key] = current[key];
        }

        return acc;
      }, {});

  return getSourceNodes(source)
    .filter(node => {
      return node.kind == ts.SyntaxKind.Decorator
        && (node as ts.Decorator).expression.kind == ts.SyntaxKind.CallExpression;
    })
    .map(node => (node as ts.Decorator).expression as ts.CallExpression)
    .filter(expr => {
      if (expr.expression.kind == ts.SyntaxKind.Identifier) {
        const id = expr.expression as ts.Identifier;

        return id.text == identifier && angularImports[id.text] === module;
      } else if (expr.expression.kind == ts.SyntaxKind.PropertyAccessExpression) {
        // This covers foo.NgModule when importing * as foo.
        const paExpr = expr.expression as ts.PropertyAccessExpression;
        // If the left expression is not an identifier, just give up at that point.
        if (paExpr.expression.kind !== ts.SyntaxKind.Identifier) {
          return false;
        }

        const id = paExpr.name.text;
        const moduleId = (paExpr.expression as ts.Identifier).text;

        return id === identifier && (angularImports[moduleId + '.'] === module);
      }

      return false;
    })
    .filter(expr => expr.arguments[0]
      && expr.arguments[0].kind == ts.SyntaxKind.ObjectLiteralExpression)
    .map(expr => expr.arguments[0] as ts.ObjectLiteralExpression);
}

function getMetadataField(
  node: ts.ObjectLiteralExpression,
  metadataField: string,
): ts.ObjectLiteralElement[] {
  return node.properties
    .filter(prop => ts.isPropertyAssignment(prop))
    // Filter out every fields that's not "metadataField". Also handles string literals
    // (but not expressions).
    .filter(({ name }: ts.PropertyAssignment) => {
      return (ts.isIdentifier(name) || ts.isStringLiteral(name))
        && name.getText() === metadataField;
    });
}

function addSymbolToNgModuleMetadata(
  source: ts.SourceFile,
  ngModulePath: string,
  metadataField: string,
  symbolName: string,
  importPath: string | null = null,
): Change[] {
  const nodes = getDecoratorMetadata(source, 'NgModule', '@angular/core');
  let node: any = nodes[0];  // tslint:disable-line:no-any

  // Find the decorator declaration.
  if (!node) {
    return [];
  }

  // Get all the children property assignment of object literals.
  const matchingProperties = getMetadataField(
    node as ts.ObjectLiteralExpression,
    metadataField,
  );

  // Get the last node of the array literal.
  if (!matchingProperties) {
    return [];
  }
  if (matchingProperties.length == 0) {
    // We haven't found the field in the metadata declaration. Insert a new field.
    const expr = node as ts.ObjectLiteralExpression;
    let position: number;
    let toInsert: string;
    if (expr.properties.length == 0) {
      position = expr.getEnd() - 1;
      toInsert = `  ${metadataField}: [${symbolName}]\n`;
    } else {
      node = expr.properties[expr.properties.length - 1];
      position = node.getEnd();
      // Get the indentation of the last element, if any.
      const text = node.getFullText(source);
      const matches = text.match(/^\r?\n\s*/);
      if (matches && matches.length > 0) {
        toInsert = `,${matches[0]}${metadataField}: [${symbolName}]`;
      } else {
        toInsert = `, ${metadataField}: [${symbolName}]`;
      }
    }
    if (importPath !== null) {
      return [
        new InsertChange(ngModulePath, position, toInsert),
        insertImport(source, ngModulePath, symbolName.replace(/\..*$/, ''), importPath),
      ];
    } else {
      return [new InsertChange(ngModulePath, position, toInsert)];
    }
  }
  const assignment = matchingProperties[0] as ts.PropertyAssignment;

  // If it's not an array, nothing we can do really.
  if (assignment.initializer.kind !== ts.SyntaxKind.ArrayLiteralExpression) {
    return [];
  }

  const arrLiteral = assignment.initializer as ts.ArrayLiteralExpression;
  if (arrLiteral.elements.length == 0) {
    // Forward the property.
    node = arrLiteral;
  } else {
    node = arrLiteral.elements;
  }

  if (!node) {
    // tslint:disable-next-line: no-console
    console.error('No app module found. Please add your new class to your component.');

    return [];
  }

  if (Array.isArray(node)) {
    const nodeArray = node as {} as Array<ts.Node>;
    const symbolsArray = nodeArray.map(node => node.getText());
    if (symbolsArray.includes(symbolName)) {
      return [];
    }

    node = node[node.length - 1];
  }

  let toInsert: string;
  let position = node.getEnd();
  if (node.kind == ts.SyntaxKind.ObjectLiteralExpression) {
    // We haven't found the field in the metadata declaration. Insert a new
    // field.
    const expr = node as ts.ObjectLiteralExpression;
    if (expr.properties.length == 0) {
      position = expr.getEnd() - 1;
      toInsert = `  ${symbolName}\n`;
    } else {
      // Get the indentation of the last element, if any.
      const text = node.getFullText(source);
      if (text.match(/^\r?\r?\n/)) {
        toInsert = `,${text.match(/^\r?\n\s*/)[0]}${symbolName}`;
      } else {
        toInsert = `, ${symbolName}`;
      }
    }
  } else if (node.kind == ts.SyntaxKind.ArrayLiteralExpression) {
    // We found the field but it's empty. Insert it just before the `]`.
    position--;
    toInsert = `${symbolName}`;
  } else {
    // Get the indentation of the last element, if any.
    const text = node.getFullText(source);
    if (text.match(/^\r?\n/)) {
      toInsert = `,${text.match(/^\r?\n(\r?)\s*/)[0]}${symbolName}`;
    } else {
      toInsert = `, ${symbolName}`;
    }
  }
  if (importPath !== null) {
    return [
      new InsertChange(ngModulePath, position, toInsert),
      insertImport(source, ngModulePath, symbolName.replace(/\..*$/, ''), importPath),
    ];
  }

  return [new InsertChange(ngModulePath, position, toInsert)];
}

/**
 * Custom function to insert a declaration (component, pipe, directive)
 * into NgModule declarations. It also imports the component.
 */
function addDeclarationToModule(source: ts.SourceFile,
  modulePath: string, classifiedName: string,
  importPath: string): Change[] {
  return addSymbolToNgModuleMetadata(
    source, modulePath, 'declarations', classifiedName, importPath);
}

/**
 * Custom function to insert an NgModule into NgModule imports. It also imports the module.
 */
function addImportToModule(source: ts.SourceFile,
  modulePath: string, classifiedName: string,
  importPath: string): Change[] {

  return addSymbolToNgModuleMetadata(source, modulePath, 'imports', classifiedName, importPath);
}

/**
 * Custom function to insert an export into NgModule. It also imports it.
 */
export function addExportToModule(source: ts.SourceFile,
  modulePath: string, classifiedName: string,
  importPath: string): Change[] {
  return addSymbolToNgModuleMetadata(source, modulePath, 'exports', classifiedName, importPath);
}

/**
 * Custom function to insert an entryComponent into NgModule. It also imports it.
 * @deprecated - Since version 9.0.0 with Ivy, entryComponents is no longer necessary.
 */
export function addEntryComponentToModule(source: ts.SourceFile,
  modulePath: string, classifiedName: string,
  importPath: string): Change[] {
  return addSymbolToNgModuleMetadata(
    source, modulePath,
    'entryComponents', classifiedName, importPath,
  );
}

/**
 * Custom function to insert an entryComponent into NgModule. It also imports it.
 * @deprecated - Since version 9.0.0 with Ivy, entryComponents is no longer necessary.
 */
function addProviderToModule(source: ts.SourceFile,
  modulePath: string, classifiedName: string,
  importPath: string): Change[] {
  return addSymbolToNgModuleMetadata(
    source, modulePath,
    'providers', classifiedName, importPath,
  );
}

function findBootstrapModuleCall(host: Tree, mainPath: string): ts.CallExpression | null {
  const mainBuffer = host.read(mainPath);
  if (!mainBuffer) {
    throw new SchematicsException(`Main file (${mainPath}) not found`);
  }
  const mainText = mainBuffer.toString('utf-8');
  const source = ts.createSourceFile(mainPath, mainText, ts.ScriptTarget.Latest, true);

  const allNodes = getSourceNodes(source);

  let bootstrapCall: ts.CallExpression | null = null;

  for (const node of allNodes) {

    let bootstrapCallNode: ts.Node | null = null;
    bootstrapCallNode = findNode(node, ts.SyntaxKind.Identifier, 'bootstrapModule');

    // Walk up the parent until CallExpression is found.
    while (bootstrapCallNode && bootstrapCallNode.parent
      && bootstrapCallNode.parent.kind !== ts.SyntaxKind.CallExpression) {

      bootstrapCallNode = bootstrapCallNode.parent;
    }

    if (bootstrapCallNode !== null &&
      bootstrapCallNode.parent !== undefined &&
      bootstrapCallNode.parent.kind === ts.SyntaxKind.CallExpression) {
      bootstrapCall = bootstrapCallNode.parent as ts.CallExpression;
      break;
    }
  }

  return bootstrapCall;
}

function findBootstrapModulePath(host: Tree, mainPath: string): string {
  const bootstrapCall = findBootstrapModuleCall(host, mainPath);
  if (!bootstrapCall) {
    throw new SchematicsException('Bootstrap call not found');
  }

  const bootstrapModule = bootstrapCall.arguments[0];

  const mainBuffer = host.read(mainPath);
  if (!mainBuffer) {
    throw new SchematicsException(`Client app main file (${mainPath}) not found`);
  }
  const mainText = mainBuffer.toString('utf-8');
  const source = ts.createSourceFile(mainPath, mainText, ts.ScriptTarget.Latest, true);
  const allNodes = getSourceNodes(source);

  const bootstrapModuleRelativePath = allNodes
    .filter(node => node.kind === ts.SyntaxKind.ImportDeclaration)
    .filter(imp => {
      return findNode(imp, ts.SyntaxKind.Identifier, bootstrapModule.getText());
    })
    .map((imp: ts.ImportDeclaration) => {
      const modulePathStringLiteral = imp.moduleSpecifier as ts.StringLiteral;

      return modulePathStringLiteral.text;
    })[0];

  return bootstrapModuleRelativePath;
}

export function getAppModulePath(host: Tree, mainPath: string): string {
  const moduleRelativePath = findBootstrapModulePath(host, mainPath);
  const mainDir = dirname(mainPath);
  const modulePath = normalize(`/${mainDir}/${moduleRelativePath}.ts`);

  return modulePath;
}

function readConfig(host: Tree) {
  const sourceText = host.read(CONFIG_PATH)!.toString('utf-8');
  return JSON.parse(sourceText);
}

function writeConfig(host: Tree, config: JSON) {
  host.overwrite(CONFIG_PATH, JSON.stringify(config, null, 2));
}

export function getAppName(config: any): string {
  const projects = config.projects;
  const projectNames = Object.keys(projects);
  for (let projectName of projectNames) {
    const projectConfig = projects[projectName];
    if (isAngularBrowserProject(projectConfig)) {
      return 'projectName.toString()';
    }
  }
  return '';
}

export function isAngularBrowserProject(projectConfig: any) {
  if (projectConfig.projectType === 'application') {
    const buildConfig = projectConfig.architect.build;
    return buildConfig.builder === '@angular-devkit/build-angular:browser';
  }
  return false;
}

export function getAngularAppConfig(config: any): any | null {
  const projects = config.projects;
  const projectNames = Object.keys(projects);
  for (let projectName of projectNames) {
    const projectConfig = projects[projectName];
    if (isAngularBrowserProject(projectConfig)) {
      return projectConfig;
    }
  }
  return null;
}

/**
 * Insert an html link on the head of and html file
 *
 * @param host host.
 * @param linkHTMLTags Recibes an array of strings.
 * @param path String
 */
export function addLinkStyleToHTMLHead(host: Tree, linkHTMLTags: string[], path: any) {
  if(linkHTMLTags.length > 0){
    linkHTMLTags.map((linkTag: string) => {
      appendHtmlElementToHead(host, path, linkTag);
    })
  }
}

function addStyle(host: Tree, stylePath: string) {
  const config = readConfig(host);
  const appConfig = getAngularAppConfig(config);
  if (appConfig) {
    appConfig.architect.build.options.styles.push({
      input: stylePath
    });
    console.log('appConfig: ', appConfig);
    writeConfig(host, config);
  } else {
    console.log("Can't find an app.");
  }
}

export function hasBootstrap(host: Tree): boolean {
  const config = readConfig(host);
  const appConfig = getAngularAppConfig(config);
  let _hasBootstrap = false;
  if (appConfig) {
    const styles = appConfig.architect.build.options.styles;
    if (styles) {
      for (let style in styles) {
        if (styles[style].input && typeof (styles[style].input) === "string") {
          if (styles[style].input.includes('bootstrap.css')) {
            console.log("Bootstrap is already used.");
            _hasBootstrap = true;
          }
        } else if (styles[style] && typeof (styles[style]) === "string") {
          if (styles[style].includes('bootstrap.css')) {
            console.log("Bootstrap is already used.");
            _hasBootstrap = true;
          }
        }
      }
    }
    return _hasBootstrap;
  } else {
    console.log("This is not a Angular application.");
    return false;
  }
}

/**
 * Adds a package to the package.json
 */
export function addPackageToPackageJson(host: Tree, type: string, pkg: string, version: string) {
  if (host.exists('package.json')) {
    const sourceText = host.read('package.json')!.toString('utf-8');
    const json = JSON.parse(sourceText);
    if (!json[type]) {
      json[type] = {};
    }
    if (!json[type][pkg]) {
      json[type][pkg] = version;
    }
    host.overwrite('package.json', JSON.stringify(json, null, 2));
  }
  return host;
}

export function getAppNameFromPackageJSON(host: Tree): string {
  const sourceText = host.read('package.json')!.toString('utf-8');
  const json = JSON.parse(sourceText);
  return json.name;
}

/**
 * Appends a key: value on a specific environment file 
 * @param host Tree
  *@param routePaths An array of the environments routes
 * @param env The environment to be added (example: prod, staging...)
 * @param appPath application path (/src...)
 * @param key The key to be added
 * @param value The value to be added
 * @return void
*/
export function addEnvironmentVar(host: Tree, routePaths: EnvI[]): void {
  overwriteEnvironmets(host, routePaths);

}

function writeEnvironmets(host: Tree, environment: any) {
  const environmentFilePath = `${environment.appPath}/environments/environment${(environment.env) ? '.' + environment.env : ''}.ts`;
  const sourceFile = getFileContent(host, environmentFilePath);
  const keyValue = `
  ${environment.key}: '${environment.value}',`;
  host.overwrite(environmentFilePath, sourceFile.replace('export const environment = {', `export const environment = {${keyValue}`));
}

function overwriteEnvironmets(host: Tree, routePaths: EnvI[]) {
  if (routePaths.length > 0) {
    if (routePaths.length === 1) {
      writeEnvironmets(host, routePaths[0]);
    } else {
      routePaths.forEach((environment: any) => {
        writeEnvironmets(host, environment);
      })
    }
  }
}

/**
 * Add a id to a element on a html file
 * @param host Tree
 * @param htmlFilePath Html file path
 * @param idName Name of the id to be added
 * @param tagName Html tag name to append the id
 * @return void
*/
export function addIdToElement(host: Tree, htmlFilePath: string, idName: string, tagName: string): void {
  const htmlFileBuffer = host.read(htmlFilePath);
  if (!htmlFileBuffer) {
    throw new SchematicsException(`Could not read file for path: ${htmlFilePath}`);
  }
  const htmlContent = htmlFileBuffer.toString();
  const _element = getElementByTagName(tagName, htmlContent);
  if (!_element) {
    throw Error(`Could not find ${tagName} element in HTML file: ${htmlFileBuffer}`);
  }
  const attribute = _element.attrs.find(attribute => attribute.name === 'id');
  if (attribute) {
    const hasAttr = attribute.value.split(' ').map(part => part.trim()).includes(idName);
    if (!hasAttr) {
      const attributeLocation = _element.sourceCodeLocation!.attrs.id;
      const recordedChange = host
        .beginUpdate(htmlFilePath)
        .insertRight(attributeLocation.endOffset - 1, ` ${idName}`);
      host.commitUpdate(recordedChange);
    }
  } else {
    const recordedChange = host
      .beginUpdate(htmlFilePath)
      .insertRight(_element.sourceCodeLocation!.startTag.endOffset - 1, ` id="${idName}"`);
    host.commitUpdate(recordedChange);
  }
}