import { isEmpty } from '@blueskyfish/grundel';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, createHash } from 'crypto';
import { ENCODING_HEX, ENCODING_UTF8 } from '../file';
import { CryptoConfig } from './crypto.config';
import { CRYPTO_HASH_ALGO } from './crypto.setting';

/**
 * The service encrypt and decrypt with private and public key values or create a hash signature
 */
@Injectable()
export class CryptoService implements OnApplicationBootstrap {
  private readonly ALGO = 'aes-256-cbc';

  private readonly logger: Logger = new Logger(CryptoService.name);

  private _publicKey!: Buffer;
  private _privateKey!: Buffer;
  private _digestSecret!: string;

  constructor(private configService: ConfigService) {}

  /**
   * Encrypt the given value with the private key and returns as `hex` string.
   *
   * @param {string} value the value
   * @returns {string} the `hex` string
   */
  encrypt(value: string): string {
    if (isEmpty(this._privateKey) || isEmpty(this._publicKey)) {
      this.logger.warn('Private Key not available');
      throw new Error('Crypto digest is not initialized');
    }
    // @ts-ignore
    const encryptMod = createCipheriv(
      this.ALGO,
      this._publicKey,
      this._privateKey
    );
    return (
      encryptMod.update(value, ENCODING_UTF8, ENCODING_HEX) +
      encryptMod.final(ENCODING_HEX)
    );
  }

  encryptJson<T>(data: T): string {
    const value = JSON.stringify(data);
    return this.encrypt(value);
  }

  /**
   * Decrypt the given `hex` value with the public key and returns the plain text.
   *
   * @param {string} value
   * @returns {string}
   */
  decrypt(value: string): string {
    if (isEmpty(this._privateKey) || isEmpty(this._publicKey)) {
      this.logger.warn('Public Key not available');
      throw new Error('Crypto digest is not initialized');
    }
    // @ts-ignore
    const decryptMod = createDecipheriv(
      this.ALGO,
      this._publicKey,
      this._privateKey
    );
    return (
      decryptMod.update(value, ENCODING_HEX, ENCODING_UTF8) +
      decryptMod.final(ENCODING_UTF8)
    );
  }

  /**
   * Decrypt the given `hex` value with the public key and parse string to an JSON object.
   *
   * @param {string} value the encrypted `hex` string,
   * @returns {*} the JSON entity or null
   */
  decryptJson<T>(value: string): T {
    try {
      const data = this.decrypt(value);
      return data ? JSON.parse(data) : null;
    } catch (e: any) {
      this.logger.error(`Decrypt to JSON is failed (${e.message})`, e.static);
      throw new Error('Crypto digest is not initialized');
    }
  }

  /**
   * Generates the hashed password with a given prefix and palin password.
   *
   * @param {string} prefix the prefix
   * @param {string} password the plain password
   * @returns {string} the hashed password
   */
  digest(prefix: string, password: string): string {
    if (isEmpty(prefix)) {
      this.logger.warn('digest requires parameter "prefix"');
      throw new Error('Crypto digest is not initialized');
    }
    if (isEmpty(password)) {
      this.logger.warn('digest requires parameter "password"');
      throw new Error('Crypto digest is not initialized');
    }

    if (!this._digestSecret) {
      this.logger.warn('digest requires config "digestSecret"');
      throw new Error('Crypto digest is not initialized');
    }

    const value = `${this._digestSecret}${prefix}${password}`;

    return createHash(CRYPTO_HASH_ALGO).update(value).digest(ENCODING_HEX);
  }

  /**
   * Verify the password hash with the plain password
   *
   * @param {string} passwordHash the hashed password
   * @param {string} prefix the prefix of the password hash
   * @param {string} password the plain password
   * @returns {boolean} `true` means the password is equals
   * @throws RequiredError if one of the parameters is invalid
   */
  verify(passwordHash: string, prefix: string, password: string): boolean {
    const hashedPassword = this.digest(prefix, password);
    return passwordHash === hashedPassword;
  }

  async onApplicationBootstrap(): Promise<any> {
    await this.initialKeys();
  }

  private async initialKeys(): Promise<void> {
    this.logger.log('initial keys');

    const config = this.configService.get<CryptoConfig>('crypto', {
      privateKey: '',
      publicKey: '',
      digestSecret: '',
    });

    if (
      isEmpty(config.privateKey) ||
      isEmpty(config.publicKey) ||
      isEmpty(config.digestSecret)
    ) {
      this.logger.error(`Crypto config incomplete ...`);
      return;
    }

    try {
      this._publicKey = Buffer.from(config.publicKey, ENCODING_UTF8).slice(0, 32);
      this._privateKey = Buffer.from(config.privateKey, ENCODING_UTF8).slice(0, 16);
      this._digestSecret = config.digestSecret;
      this.logger.log('finish of initial keys');
    } catch (e: any) {
      this.logger.error(`error is occurred: ${e.message}`, e.stack);
    }
  }
}
