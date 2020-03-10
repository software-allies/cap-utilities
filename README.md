# CAP Utilities 💡
[![NPM version](https://badge.fury.io/js/CAP.svg)](https://npmjs.org/package/CAP) [![Build Status](https://travis-ci.org/Elena%20M.%20Sarabia/CAP.svg?branch=master)](https://travis-ci.org/Elena%20M.%20Sarabia/CAP) [![Generic badge](https://img.shields.io/badge/CAP-Active-<COLOR>.svg)](https://shields.io/)

``CAP Utilities`` is part of the [CAP Generator](https://github.com/software-allies/cap-generator/tree/development) and was created to provider a collection of general and useful utilities for Schematics in Angular.

To learn more about Schematics we recomend you to see the [Schematic documentation](https://angular.io/guide/schematics).


## How to install 🔍❓ 
To Install using npm, simply do:

```
npm install cap-utils
```

## How to Use 🔍❓
To import all the functions we recommend you the following import declaration: 

```
import * as astUtils from 'cap-utilities'
```

### Functions 📂 

* [removeContentFromFile](#removeContentFromFile)
* [appendToStartFile](#appendToStartFile)
* [appendHtmlElementToBody](#appendHtmlElementToBody)
* [addBodyClass](#appendHtmlElementToBody)
* [updateBodyOfIndexFile](#updateBodyOfIndexFile)
* [updateIndexFile](#updateIndexFile)
* [addStyles](#addStyles)
* [addToNgModule](#addToNgModule)
* [addRoutes](#addRoutes)
* [addExportToModule](#addExportToModule)
* [addEntryComponentToModule](#addEntryComponentToModule)
* [getAppModulePath](#getAppModulePath)
* [getAppName](#getAppName)
* [hasBootstrap](#hasBootstrap)
* [addPackageToPackageJson](#addPackageToPackageJson)
* [getAppNameFromPackageJSON](#getAppNameFromPackageJSON)
* [addEnvironmentVar](#addEnvironmentVar)
* [readIntoSourceFile](#readIntoSourceFile)
* [isAngularBrowserProject](#isAngularBrowserProject)
* [getAngularAppConfig](#getAngularAppConfig)
* [updateIndexHeadFile](#updateIndexHeadFile)

## Disclaimer 🚧
This repository contains parts of code which is directly taken from [Angular Schematics package](https://github.com/angular/angular-cli/tree/master/packages/schematics/angular).
All credits go to the respective developers! 

## Functions 📂
### ``removeContentFromFile``

#### Remove content from specified file

##### ``@param host``
##### ``@param filePath`` Path of the file that's going to be deleted.

##### ``@return`` The updated tree.

 
#### Example: 
```
function removeComponentHtml(filePath: string): Rule {
  return (host: Tree) => {
    astUtils.removeContentFromFile(host, filePath);
    return host;
  };
}
```

### ``appendToStartFile``

#### Appends a fragment to the start file. 
##### ``@param host``
##### ``@param filePath`` Path of the file.
##### ``@param fragment`` The maximum number of items to return.
##### ``@return`` A tree with the updates.

#### Example: 
  ```
  ```

### ``appendHtmlElementToBody``

#### Appends the given element HTML fragment to the `<body>` element of the specified HTML file.
##### ``@param host``
##### ``@param htmlFilePath`` 
##### ``@param elementHtml``
##### ``@param side`` 
##### ``@return `` 
 
#### Example: 
  ```
  ```

### ``addBodyClass``

#### Adds a class to the body of the document.
##### ``@param host``
##### ``@param htmlFilePath`` 
##### ``@param className`` 
##### ``@return`` 
  
#### Example: 
  ```
  ```

### ``updateBodyOfIndexFile``

#### 
##### ``@param ``
##### ``@param `` 
##### ``@param `` 
##### ``@return`` 
 
#### Example: 
  ```
  ```

### ``updateIndexFile``

#### 
##### ``@param ``
##### ``@param `` 
##### ``@param `` 
##### ``@return`` 
 
#### Example: 
  ```
  ```

### ``addStyles``

#### addBootstrapCSS
##### ``@param host``
##### ``@param stylePaths`` 
##### ``@return`` 
 
#### Example: 
  ```
  ```

### ``addToNgModule``

#### Add the a modules, components or services into the declaration module.
##### ``@param host``
##### ``@param options`` 
##### ``@param elementsToImport`` 
##### ``@return`` 

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

### ``addRoutes``

#### 
##### ``@param host``
##### ``@param routingPath`` 
##### ``@param routePaths``
##### ``@param srcImport`` 
##### ``@return`` 
 
#### Example: 
  ```
  ```

### ``addExportToModule``

#### Custom function to insert an export into NgModule. It also imports it.
##### ``@param source``
##### ``@param modulePath`` 
##### ``@param classifiedName`` 
##### ``@param importPath`` 
##### ``@return`` 
 
#### Example: 
  ```
  ```

### ``addEntryComponentToModule``

#### Custom function to insert an entryComponent into NgModule. It also imports it.
##### ``@param source``
##### ``@param modulePath`` 
##### ``@param classifiedName`` 
##### ``@param importPath`` 
##### ``@return`` 
 
#### Example: 
  ```
  ```

### ``getAppModulePath``

#### 
##### ``@param host``
##### ``@param mainPath`` 
##### ``@return`` 
 
#### Example: 
  ```
  ```

### ``getAppName``

#### 
##### ``@param config``
##### ``@return`` 
 
#### Example: 
  ```
  ```

### ``hasBootstrap``

#### 
##### ``@param ``
##### ``@param `` 
##### ``@param `` 
##### ``@return`` 
 
#### Example: 
  ```
  ```

### ``addPackageToPackageJson``

#### 
##### ``@param ``
##### ``@param `` 
##### ``@param `` 
##### ``@return`` 
 
#### Example: 
  ```
  ```

### ``getAppNameFromPackageJSON``

#### 
##### ``@param ``
##### ``@param `` 
##### ``@param `` 
##### ``@return`` 
 
#### Example: 
  ```
  ```

### ``addEnvironmentVar``
#### Appends a key: value on a specific environment file.
##### ``@param host`` Tree
##### ``@param env`` The environment to be added (example: prod, staging...)
##### ``@param appPath`` application path (/src...)
##### ``@param key`` The key to be added
##### ``@param value`` The value to be added
##### ``@return void`` 
 
#### Example: 
  ```
  ```

### ``readIntoSourceFile``

#### 
##### ``@param ``
##### ``@param `` 
##### ``@param `` 
##### ``@return`` 
 
#### Example: 
  ```
  ```

### ``isAngularBrowserProject``

#### 
##### ``@param projectConfig``
##### ``@param `` 
##### ``@param `` 
##### ``@return`` 
 
#### Example: 
  ```
  ```

### ``getAngularAppConfig``

#### 
##### ``@param config``
##### ``@return`` 
 
#### Example: 
  ```
  ```

### ``updateIndexHeadFile``

#### Appends the given element HTML fragment to the `<head>` element of the specified HTML file.
##### ``@param hostP``
##### ``@param path`` 
##### ``@param arrayLinks`` 
##### ``@return`` 
 
#### Example: 
  ```
  ```