/**
  * 
  * @param name Component name. Example: 'HomeComponent'
  * @param path Component path. Example: app/footer/footer.component
  * @param type True or false in case that the element to add is not a Component
  * @param forRootValues Recives and array of object thats contain the name and value to add into the forRoot method.
*/
export interface importElementsModule {
  name: string;
  path: string;
  type: string;  
  forRootValues?: forRootValuesI
}


/**
  * Option interface.
  * @param projectName Name of your current application.
  * @param authService Recives a of kind, or [] if none is found
  * @param projectPath Path of the current project.
  * @param modulePath Path of the App module.
  * @param environments Save all the environments into an array.
*/
export interface OptionsI {
  project?: string;
  module?: any;
  path?: any;
};

/**
  * Env interface.
  * @param env The environment to be added (example: prod, staging...)
  * @param appPath application path (/src...)
  * @param key The key to be added
  * @param value The value to be added
*/
export interface EnvI {
  env: string;
  appPath: string;
  key: string;
  value: string;
};

/**
  * Imports for the ngModule interface.
  * @param path Name of your current application.
  * @param pathMatch URL of your logo. 
  * @param component True or False to remove the content from the app.component.html.
*/
export interface routerPathI {
  path: string;
  pathMatch: string;
  component: any
}

export interface forRootParamsI {
  name: string;
  value: string;
}
export interface forRootValuesI {
  configuration?: any;
  params: forRootParamsI[];
}

/**
  * Add a Module with the ForRoot method
  * @param path Name of your current application.
  * @param pathMatch URL of your logo. 
  * @param component True or False to remove the content from the app.component.html.
*/
export interface forRootI {
  name: string;
  path: string;
  forRootVakues: forRootValuesI;
}