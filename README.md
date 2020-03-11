# CAP Utilities 💡
[![NPM version](https://badge.fury.io/js/CAP.svg)](https://npmjs.org/package/CAP) [![Build Status](https://travis-ci.org/Elena%20M.%20Sarabia/CAP.svg?branch=master)](https://travis-ci.org/Elena%20M.%20Sarabia/CAP) [![Generic badge](https://img.shields.io/badge/CAP-Active-<COLOR>.svg)](https://shields.io/)

``CAP Utilities`` is part of the [CAP Generator](https://github.com/software-allies/cap-generator/tree/development) and was created to provider a collection of general and useful utilities for Schematics in Angular.

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
### removeContentFromFile

#### Remove content from specified file

##### _@param host_
##### _@param filePath_ Path of the file that's going to be deleted.

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

### appendToStartFile

#### Appends a fragment to the start file. 
##### _@param host_
##### _@param filePath_ Path of the file.
##### _@param fragment_ The maximum number of items to return.
##### _@return_ A tree with the updates.

#### Example: 
  ```
  ```
<br>

### appendHtmlElementToBody

#### Appends the given element HTML fragment to the `<body>` element of the specified HTML file.
##### _@param host_
##### _@param htmlFilePath_ 
##### _@param elementHtml_
##### _@param side_ 
##### _@return_  
 
#### Example: 
  ```
  ```
<br>

### addBodyClass

#### Adds a class to the body of the document.
##### _@param host_
##### _@param htmlFilePath_
##### _@param className_
##### _@return_ 
  
#### Example: 
  ```
  ```
<br>

### updateBodyOfIndexFile

#### 
##### _@param_ 
##### _@param_  
##### _@param_  
##### _@return_ 
 
#### Example: 
  ```
  ```
<br>

### updateIndexFile

#### 
##### _@param_ 
##### _@param_  
##### _@param_  
##### _@return_ 
 
#### Example: 
  ```
  ```
<br>

### addStyles

#### addBootstrapCSS
##### _@param host_
##### _@param stylePaths_
##### _@return_ 
 
#### Example: 
  ```
  ```
<br>

### addToNgModule

#### Add the a modules, components or services into the declaration module.
##### _@param host_
##### _@param options_
##### _@param elementsToImport_
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

### addRoutes

#### 
##### _@param host_
##### _@param routingPath_ 
##### _@param routePaths_
##### _@param srcImport _
##### _@return_ 
 
#### Example: 
  ```
  ```
<br>

### addExportToModule

#### Custom function to insert an export into NgModule. It also imports it.
##### _@param source_
##### _@param modulePath_ 
##### _@param classifiedName_ 
##### _@param importPath_ 
##### _@return_ 
 
#### Example: 
  ```
  ```
<br>

### addEntryComponentToModule

#### Custom function to insert an entryComponent into NgModule. It also imports it.
##### _@param source_
##### _@param modulePath_
##### _@param classifiedName_
##### _@param importPath_
##### _@return_ 
 
#### Example: 
  ```
  ```
<br>

### getAppModulePath

#### 
##### _@param host_
##### _@param mainPath_ 
##### _@return_ 
 
#### Example: 
  ```
  ```
<br>

### getAppName

#### 
##### _@param config_
##### _@return_ 
 
#### Example: 
  ```
  ```
<br>

### hasBootstrap

#### 
##### _@param_ 
##### _@param_  
##### _@param_  
##### _@return_ 
 
#### Example: 
  ```
  ```
<br>

### addPackageToPackageJson

#### 
##### _@param_ 
##### _@param_  
##### _@param_  
##### _@return_ 
 
#### Example: 
  ```
  ```
<br>

### getAppNameFromPackageJSON

#### 
##### _@param_ 
##### _@param_  
##### _@param_  
##### _@return_ 
 
#### Example: 
  ```
  ```
<br>

### addEnvironmentVar
#### Appends a key: value on a specific environment file.
##### _@param host_ Tree
##### _@param env_ The environment to be added (example: prod, staging...)
##### _@param appPath_ application path (/src...)
##### _@param key_ The key to be added
##### _@param value_ The value to be added
##### _@return void_ 
 
#### Example: 
  ```
  ```
<br>

### readIntoSourceFile

#### 
##### _@param_ 
##### _@param_  
##### _@param_  
##### _@return_ 
 
#### Example: 
  ```
  ```
<br>

### isAngularBrowserProject

#### 
##### _@param projectConfig_
##### _@param_  
##### _@param_  
##### _@return_ 
 
#### Example: 
  ```
  ```
<br>

### getAngularAppConfig

#### 
##### _@param config_
##### _@return_ 
 
#### Example: 
  ```
  ```
<br>

### updateIndexHeadFile

#### Appends the given element HTML fragment to the `<head>` element of the specified HTML file.
##### _@param hostP_
##### _@param path_
##### _@param arrayLinks_
##### _@return_ 
 
#### Example: 
  ```
  ```
<br>
