export class OpenApiSetting {

  /**
   * The http header name for the authorization token
   *
   * TODO Adjust the http header name to the requirement
   */
  static readonly HttpAuthHeader = 'x-blueskyfish-app-starter-token';

  /**
   * The Api key
   */
  static readonly ApiKey = 'ApiKey';

  /**
   * The api security settings
   */
  static readonly ApiSecurity: Record<string, string[]>[] = [
    {
      [OpenApiSetting.ApiKey]: []
    }
  ];
}
