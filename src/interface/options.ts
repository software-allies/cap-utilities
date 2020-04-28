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
