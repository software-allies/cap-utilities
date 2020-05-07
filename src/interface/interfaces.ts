/**
 * 
  * @param name Component name example: 'HomeComponent'
  * @param path Component path example: app/footer/footer.component
  * @param type True or false in case that the element to add is not a Component
*/
export interface importElementsModule {
  /**
   * name of the element
  */
  name: string;
  /**
   * path of the element
  */
  path: string;
  /**
   * type of the element: 'component', 'module', 'service'
  */
  type: string;
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
  * @param env Name of your current application.
  * @param appPath Recives a of kind, or [] if none is found
  * @param key Path of the current project.
  * @param value Path of the App module.
*/
export interface EnvI {
  env: string;
  appPath: string;
  key: string;
  value: string;
};

/**
  * Option interface.
  * @param path Name of your current application.
  * @param pathMatch URL of your logo. 
  * @param component True or False to remove the content from the app.component.html.
*/
export interface routerPathI {
  path: string;
  pathMatch: string;
  component: any
}
