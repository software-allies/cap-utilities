/**
  * Component interface.
  * @param componentName Component name example: 'HomeComponent'
  * @param componentPath Component path example: app/footer/footer.component
  * @param isAService True or false in case that the element to add is not a Component
*/
export interface componentsPathI {
  componentName: string;
  componentPath: string;
  isAService: boolean;
}