import { getChildElementIndentation } from '@angular/cdk/schematics/utils/parse5-element';
import { DefaultTreeDocument, DefaultTreeElement, parse as parseHtml } from 'parse5';
import { strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicsException,
  Tree,
  UpdateRecorder,
} from '@angular-devkit/schematics';
import { InsertChange } from '@schematics/angular/utility/change';
import {
  buildRelativePath,
} from '@schematics/angular/utility/find-module';
import { appendHtmlElementToHead } from '@angular/cdk/schematics/utils/html-head-element';
import {
  addDeclarationToModule,
  addProviderToModule,
  addImportToModule
} from '../vendored-ast-utils';

import * as ts from 'typescript';
import { addStyle } from '../cap-utils/config';
import { getFileContent } from '@schematics/angular/utility/test';
// import { addPackageToPackageJson } from './cap-utils/package';

/**
 * Remove content from specified file..
 * @param host
 * @param filePath Path of the file that's going to be deleted.
 * @return True or false.
 */
export function removeContentFromFile(host: Tree, filePath: string) {
  const fileBuffer = host.read(filePath);
  if (!fileBuffer) {
    throw new SchematicsException(`Could not read file for path: ${filePath}.`);
  }
  host.overwrite(filePath, '');
  return true;
}

/**
 * Appends fragment to the specified file.
 * @param host
 * @param filePath
 * @param fragment The maximum number of items to return.
 * @return all nodes of kind, or [] if none is found
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
 * Appends fragment to the specified file.
 * @param host
 * @param filePath
 * @param fragment The maximum number of items to return.
 * @return all nodes of kind, or [] if none is found
 */
/** Appends the given element HTML fragment to the `<body>` element of the specified HTML file. */
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
export function getHtmlBodyTagElement(htmlContent: string): DefaultTreeElement | null {
  return getElementByTagName('body', htmlContent);
}

/**
 * Finds an element by its tag name.
 * @param host
 * @param filePath
 * @param fragment The maximum number of items to return.
 * @return all nodes of kind, or [] if none is found
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
export function updateBodyOfIndexFile(filePath: string, mainTag: Array<string>): Rule {
  return (tree: Tree) => {

    const toAddBegin =
      `
${mainTag[0]}`;

    const toAddFinal =
      `${mainTag[1]}`;

    const component = getFileContent(tree, filePath);
    tree.overwrite(filePath, component.replace(`<body>`, `<body>${toAddBegin}`));

    const componentAfter = getFileContent(tree, filePath);
    tree.overwrite(filePath, componentAfter.replace(`</body>`, `${toAddFinal}</body>`));
  }
}

/**
 * Appends fragment to the specified file.
 * @param host
 * @param filePath
 * @param fragment The maximum number of items to return.
 * @return all nodes of kind, or [] if none is found
 */
export function updateIndexFile(path: string, arrayLinks: Array<string>): Rule {
  return (host: Tree) => {
    /** Appends the given element HTML fragment to the `<head>` element of the specified HTML file. */
    arrayLinks.map((element: string) => {
      appendHtmlElementToHead(host, path, element);
    });

    return host;
  };
}

/**
 * Appends fragment to the specified file.
 * @param host
 * @param filePath
 * @param fragment The maximum number of items to return.
 * @return all nodes of kind, or [] if none is found
 */
export function removeContentFromAppComponentHtml(filePath: string): Rule {
  return (host: Tree) => {
    removeContentFromFile(host, filePath);
    return host;
  };
}

/**
* Appends fragment to the specified file.
* @param host
* @param filePath
* @param fragment The maximum number of items to return.
* @return all nodes of kind, or [] if none is found
*/
export function appendToAppComponentFile(filePath: string, options: any): Rule {
  return (host: Tree) => {

    if (options.removeAppComponentHtml) {
      const content =
        `<div id="main">
  <router-outlet></router-outlet>
</div>`;
      appendToStartFile(host, filePath, content);
    }

    const content = `<app-header></app-header>`;
    appendToStartFile(host, filePath, content);

    // Add footer to end of file
    const toAdd =
      `<app-footer></app-footer>`;

    const component = getFileContent(host, filePath);
    host.overwrite(filePath, `${component}${toAdd}`);

    return host;
  };
}

/**
* addBootstrapCSS.
* @param host
* @param filePath
* @param fragment The maximum number of items to return.
* @return all nodes of kind, or [] if none is found
*/
// 
function addExtraCSS(bootstrapPath: Array<string>): Rule {
  return (host: Tree) => {
    bootstrapPath.forEach(src => {
      addStyle(host, `${src}`);

    });
    return host;
  };
}

function appendToStylesFile(path: string, style: string): Rule {
  return (host: Tree) => {
    const content = `
  ${style}
`;
    appendToStartFile(host, path, content);
    return host;
  };
}

function readIntoSourceFile(host: Tree, filePath: string) {
  const text = host.read(filePath);
  if (text === null) {
    throw new SchematicsException(`File ${filePath} does not exist.`);
  }
  return ts.createSourceFile(filePath, text.toString('utf-8'), ts.ScriptTarget.Latest, true);
}

function addDeclarationToNgModule(options: any): Rule {
  return (host: Tree) => {

    const modulePath = options.module;
    // Import Header Component and declare
    let source = readIntoSourceFile(host, modulePath);
    const componentPath = `${options.path}/app/header/header.component`;
    const relativePath = buildRelativePath(modulePath, componentPath);
    const classifiedName = strings.classify(`HeaderComponent`);
    const declarationChanges: any = addDeclarationToModule(
      source,
      modulePath,
      classifiedName,
      relativePath);

    const declarationRecorder = host.beginUpdate(modulePath);
    for (const change of declarationChanges) {
      if (change instanceof InsertChange) {
        declarationRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(declarationRecorder);

    // Import and include on Imports the FooterComponent
    if (options) {
      // Need to refresh the AST because we overwrote the file in the host.
      let source = readIntoSourceFile(host, modulePath);
      const componentPath = `${options.path}/app/footer/footer.component`;
      const relativePath = buildRelativePath(modulePath, componentPath);
      const classifiedName = strings.classify(`FooterComponent`);
      const declarationChanges: any = addDeclarationToModule(
        source,
        modulePath,
        classifiedName,
        relativePath);

      const declarationRecorder = host.beginUpdate(modulePath);
      for (const change of declarationChanges) {
        if (change instanceof InsertChange) {
          declarationRecorder.insertLeft(change.pos, change.toAdd);
        }
      }
      host.commitUpdate(declarationRecorder);
    }

    // Import and include on Imports the HttpClientModule
    if (options) {
      // Need to refresh the AST because we overwrote the file in the host.
      source = readIntoSourceFile(host, modulePath);
      const servicePath = `@angular/common/http`;
      const relativePath = servicePath;
      const classifiedName = strings.classify(`HttpClientModule`);
      const providerRecorder = host.beginUpdate(modulePath);
      const providerChanges: any = addImportToModule(
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
    }

    // Import and include on Imports the HomeModule
    if (options) {
      // Need to refresh the AST because we overwrote the file in the host.
      source = readIntoSourceFile(host, modulePath);
      const componentPath = `${options.path}/app/home/home.module`;
      const relativePath = buildRelativePath(modulePath, componentPath);
      const classifiedName = strings.classify(`HomeModule`);
      const providerRecorder = host.beginUpdate(modulePath);
      const providerChanges: any = addImportToModule(
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
    }

    // Import and include on Providers the load script ScriptService
    if (options) {
      // Need to refresh the AST because we overwrote the file in the host.
      source = readIntoSourceFile(host, modulePath);
      const servicePath = `${options.path}/app/shared/services/load-scripts.service`;
      const relativePath = buildRelativePath(modulePath, servicePath);
      const classifiedName = strings.classify(`ScriptService`);
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
    }
    return host;
  };
}


export interface routerPathI {
  path: string;
  pathMatch: string;
  component: any
}


export function addHomeRoute(srcFile: string, routersPath: Array<routerPathI>, fileImport: string): Rule {
  return (host: Tree) => {

    const filePath = srcFile;

    // Add routes to routing
    let toAdd = ''
    routersPath.forEach(data => {
      toAdd = toAdd + `{
        path:'${data.path}', pathMatch: '${data.pathMatch}', component: ${data.component}}, `
    });
    console.log('toAdd: ', toAdd);
    // const toAdd = 
    //   `
    // { path: '', pathMatch: 'full', component: HomeComponent },
    // { path: 'home', pathMatch: 'full', component: HomeComponent },`;

    const component = getFileContent(host, filePath);
    host.overwrite(filePath, component.replace(`const routes: Routes = [`, `const routes: Routes = [${toAdd}`));

    // Add import to routing
    const content =
      `
${fileImport}`;
    appendToStartFile(host, filePath, content);
    return host;
  };
}
