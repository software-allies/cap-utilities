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
