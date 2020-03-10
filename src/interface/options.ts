/**
  * Option interface.
  * @param projectName Name of your current application.
  * @param logoUrl URL of your logo. 
  * @param rvContentFromHTML True or False to remove the content from the app.component.html.
  * @param includeAuthLogin Option to include login/register into the menu.
  * @param installAuth nodes of kind, or [] if none is found
  * @param includeSFCore True or False to include the SalesForceoptions into the navbar (menu).
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
