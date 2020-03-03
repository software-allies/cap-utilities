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
