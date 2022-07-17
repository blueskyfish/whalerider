export interface CryptoConfig {
  /**
   * The public key
   */
  readonly publicKey: string;

  /**
   * The private key
   */
  readonly privateKey: string;

  /**
   * The secret of the digest with **sha256**
   */
  readonly digestSecret: string;
}
