/**
 * The bootstrap options
 */
export type BootstrapOptions = {

  /**
   * **Required**: the app name
   */
  appName: string;

  /**
   * **Required**: Entry (root) application module class
   */
  appModule: any;

  /**
   * **Required** The default http ports
   */
  httpPort: number;

  /**
   * **Required**: The default hostname
   */
  httpHost: string;

  /**
   * The production stage (`true`) or the developer stage (`false`)
   */
  production: boolean;

  /**
   * The openapi setting
   */
  openApi: {
    /**
     * The title of the openapi document
     */
    title: string;

    /**
     * The description of the openapi document
     */
    description: string;

    /**
     * The version of the openapi document
     */
    version: string;
  },

  /**
   * **Optional** The logger settings
   */
  logger?: {
    /**
     * **Optional** The logger context
     */
    context?: string;
  }
}
