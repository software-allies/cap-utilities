# CAP Utilities 💡
[![NPM version](https://badge.fury.io/js/cap-utilities.svg)](https://www.npmjs.com/package/cap-utilities)[![Generic badge](https://img.shields.io/badge/CAP-Active-<COLOR>. svg)](https://shields.io/)

` `CAP Utilities` ` is part of the [CAP Generator](https://github.com/software-allies/cap-generator/tree/development) and was created to provider a collection of general and useful utilities for Schematics in Angular. 

To learn more about Schematics we recomend you to see the [Schematic documentation](https://angular.io/guide/schematics). 

## How to install❓ 

To Install using npm, simply do:

``` 
npm install cap-utils
```

## How to Use❓

To import all the functions we recommend you the following import declaration: 

``` 
import * as astUtils from 'cap-utilities'
```

### Functions 📂 

* [addStylesToAngularJSON](#addStylesToAngularJSON)
* [addLinkStyleToHTMLHead](#addLinkStyleToHTMLHead)
* [addRoutes](#addRoutes)
* [addBodyClass](#appendHtmlElementToBody)
* [addEnvironmentVar](#addEnvironmentVar)
* [addExportToModule](#addExportToModule)
* [addEntryComponentToModule](#addEntryComponentToModule)
* [addPackageToPackageJson](#addPackageToPackageJson)
* [addToNgModule](#addToNgModule)
* [appendToStartFile](#appendToStartFile)
* [appendHtmlElementToBody](#appendHtmlElementToBody)
* [getAppName](#getAppName)
* [getAppModulePath](#getAppModulePath)
* [getAngularAppConfig](#getAngularAppConfig)
* [getAppNameFromPackageJSON](#getAppNameFromPackageJSON)
* [hasBootstrap](#hasBootstrap)
* [isAngularBrowserProject](#isAngularBrowserProject)
* [readIntoSourceFile](#readIntoSourceFile)
* [removeContentFromFile](#removeContentFromFile)
* [updateIndexFile](#updateIndexFile)
* [updateIndexHeadFile](#updateIndexHeadFile)
* [updateBodyOfIndexFile](#updateBodyOfIndexFile)
* [addIdToElement](#addIdToElement)

addIdToElement

## Disclaimer 🚧

This repository contains parts of code which is directly taken from [Angular Schematics package](https://github.com/angular/angular-cli/tree/master/packages/schematics/angular). 
All credits go to the respective developers! 

## **Importan**

## **We are still working on the documentation of the functions (methods). **

## Functions 📂

<br>

### addStylesToAngularJSON

#### Function to add styles into the angular. json. 

#### Example: 

| param       |      Description      |
|-------------|:---------------------:|
| host        |                       |
| stylePaths  |        array of strings               |

``` 
  cap_utils.addStylesToAngularJSON(
    host, [
      './src/assets/webslidemenu/dropdown-effects/fade-down.css',
      './src/assets/webslidemenu/webslidemenu.scss'])
```

<br>

### addLinkStyleToHTMLHead

#### Insert an html link on the head of and html file

#### Example: 

| param       |      Description      |
|-------------|:---------------------:|
| host        |                       |
| linkHTMLTags  |        array of strings               |
| path  |        string               |

``` 
  cap_utils.addLinkStyleToHTMLHead(host, [
      '<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=optional" rel="stylesheet" async defer>',
      '<link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i&display=optional" rel="stylesheet" async defer>',
      '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" async defer>'
    ], path)
```

<br>

### addRoutes

| param        |      Description      |
|--------------|:---------------------:|
| host         |                       |
| routingPath  |                       |
| routePaths   |                       |
| srcImport    |                       |

##### _@return_ 

#### Example: 

``` 
astUtils.addRoutes(host, filePath, [
  { path: '', pathMatch: 'full', component: 'HomeComponent' },
  { path: 'home', pathMatch: 'full', component: 'HomeComponent' }
], importUrl)
```

<br>

### addBodyClass

#### Adds a class to the body of the document. 

| param        |      Description      |
|--------------|:---------------------:|
| host         |                       |
| htmlFilePath |                       |
| className    |                       |
| srcImport    |                       |

##### _@return_ 

#### Example: 

``` 
```

<br>

### addEnvironmentVar

#### Appends a key: value on a specific environment file.

| param        |      Description      |
|--------------|:---------------------:|
| host         |         Tree          |
| routePaths   |    An array of objects that contains the environments data.       |

routePaths' interface 
| env          | The environment to be added (example: prod, staging...) |
| appPath      |application path (/src...)|
| key          |The key to be added|
| value          |The value to be added|

##### _@return void_ 

 

#### Example: 

``` 
cap_utils.addEnvironmentVar(host, [
      {
        env: '',
        appPath: options.path || '/src',
        key: 'apiUrl',
        value: 'http://localhost:4000/api/'
      },
      {
        env: 'prod',
        appPath: options.path || '/src',
        key: 'apiUrl',
        value: 'http://mydomain.com/api/'
      }
    ])
```

<br>

### addExportToModule

#### Custom function to insert an export into NgModule. It also imports it. 

| param        |      Description      |
|--------------|:---------------------:|
| source            |                       |
| modulePath        |                       |
| classifiedName    |                       |
| importPath    |                       |

##### _@return_ 

#### Example: 
  

``` 
```

<br>

### addEntryComponentToModule

#### Custom function to insert an entryComponent into NgModule. It also imports it.

| param        |      Description      |
|--------------|:---------------------:|
| source         |                       |
| modulePath |                       |
| classifiedName    |                       |
| importPath    |                       |

##### _@return_ 

#### Example: 

``` 
```

<br>

### addPackageToPackageJson

#### 

| param        |      Description      |
|--------------|:---------------------:|
|          |                       |

##### _@return_ 

 

#### Example: 

``` 
```

<br>

### addToNgModule

#### Add modules, components or services into the declaration module.

| param        |      Description      |
|--------------|:---------------------:|
| host         |                       |
| options |                       |
| elementsToImport    |                       |

##### _@return_ 

#### Example: 

``` 
  astUtils.addToNgModule(host, options, [{
      name: 'HeaderComponent',
      path: 'app/header/header.component',
      type: 'component'
    },
    {
      name: 'FooterComponent',
      path: 'app/footer/footer.component',
      type: 'component'
    },
    {
      name: 'HomeModule',
      path: 'app/home/home.module',
      type: 'module'
    }]);
```

<br>

### appendToStartFile

#### Appends a fragment to the start file. 

| param        |      Description      |
|--------------|:---------------------:|
| host         |                       |
| filePath |Path of the file. |
| fragment    |The maximum number of items to return. |
| srcImport    |                       |

##### _@return_ A tree with the updates. 

#### Example: 

``` 
  const mainDiv =
  `<div id="main">
    <router-outlet></router-outlet>
  </div>`;
  astUtils.appendToStartFile(host, filePath, mainDiv);
    
  const content = `<app-header></app-header>` ;
  astUtils.appendToStartFile(host, filePath, content);
```

<br>

### appendHtmlElementToBody

#### Appends the given element HTML fragment to the `<body>` element of the specified HTML file. 

| param        |      Description      |
|--------------|:---------------------:|
| host         |                       |
| htmlFilePath |                       |
| elementHtml    |                       |
| side    |                       |

##### _@return_  

#### Example: 

``` 
```

<br>

### getAppName

#### 

| param        |      Description      |
|--------------|:---------------------:|
| config         |                       |

##### _@return_ 

 

#### Example: 

``` 
```

<br>

### getAppModulePath

#### 

| param        |      Description      |
|--------------|:---------------------:|
| host         |                       |
| mainPath |                       |

##### _@return_ 

#### Example: 

``` 
```

<br>

### getAngularAppConfig

#### 

| param        |      Description      |
|--------------|:---------------------:|
| config         |                       |

##### _@return_ 

#### Example: 

``` 
```

<br>

### getAppNameFromPackageJSON

#### 

| param        |      Description      |
|--------------|:---------------------:|
|          |                       |

##### _@return_ 

#### Example: 

``` 
```

<br>

### hasBootstrap

#### 

| param        |      Description      |
|--------------|:---------------------:|
|              |                       |

##### _@return_ 

#### Example: 

``` 
```

<br>

### isAngularBrowserProject

#### 

| param        |      Description      |
|--------------|:---------------------:|
| projectConfig         |               |       

##### _@return_ 

 

#### Example: 

``` 
```

<br>

### readIntoSourceFile

#### 

| param        |      Description      |
|--------------|:---------------------:|
|              |                       |

##### _@return_ 

#### Example: 

``` 
```

<br>

### removeContentFromFile

#### Remove content from specified file

| param        |      Description      |
|--------------|:---------------------:|
| host         |                       |
| filePath |Path of the file that's going to be deleted. |

##### _@return_ The updated tree. 

#### Example:

``` 
function removeComponentHtml(filePath: string): Rule {
  return (hostd: Tree) => {
    astUtils.removeContentFromFile(host, filePath);
    return host;
  };
}
```

<br>

### updateIndexFile

#### 

| param        |      Description      |
|--------------|:---------------------:|
|              |                       |

##### _@return_ 

 

#### Example: 

``` 
```

<br>

### updateIndexHeadFile

#### Appends the given element HTML fragment to the `<head>` element of the specified HTML file.

|        param        |      Description      |
|---------------------|:---------------------:|
| hostP               |                       |
| path                |                       |
| arrayLinks          |                       |

##### _@return_ 

#### Example: 

``` 
```

<br>

### updateBodyOfIndexFile

#### 

| param        |      Description      |
|--------------|:---------------------:|
|              |                       |

##### _@return_ 

#### Example: 

``` 
```

<br>

### addIdToElement

#### Add a id to a element on a html file

| param         |      Description              |
|---------------|:-----------------------------:|
| host          |     Tree                      |
| htmlFilePath  |Html file path                 |
| idName        |Name of the id to be added     |
| tagName       |Html tag name to append the id |

#### Example: 

``` 
  function addIdAppToBody(htmlFilePath: string): Rule {
    return (host: Tree) => {
      addIdToElement(host, htmlFilePath, 'app', 'body');
    }
}*/
```

<br>
