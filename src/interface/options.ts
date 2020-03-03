/**
  * Option interface.
  * @param appName Name of your current application.
  * @param logoUrl URL of your logo. 
  * @param rvContentFromAppHTML True or False to remove the content from the app.component.html.
  * @param includeAuthLogin Option to include login/register into the menu.
  * @param installAuth nodes of kind, or [] if none is found
  * @param includeSFCore True or False to include the SalesForceoptions into the navbar (menu).
  * @param authService Recives a of kind, or [] if none is found
  * @param projectPath Path of the current project.
  * @param modulePath Path of the App module.
*/
export interface OptionsI {
  appName: string;
  logoUrl: string;
  rvContentFromAppHTML: boolean;
  includeAuthLogin: boolean;
  installAuth: boolean;
  includeSFCore: boolean;
  authService: string;
  projectPath?: string;
  modulePath?: any;
};
