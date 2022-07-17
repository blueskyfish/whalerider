import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TestingLogger } from '@nestjs/testing/services/testing-logger.service';
import { CryptoService } from './crypto.service';

const configuration = () => ({
  crypto: {
    privateKeyFile: './test-private.pem',
    publicKeyFile: './test-public.pem',
    digestSecret: 'ABC',
  },
});

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          isGlobal: true,
          load: [configuration],
        }),
      ],
      providers: [TestingLogger, CryptoService],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should encrypt and decrypt "Hello World!"', () => {
    const msg = 'Hello World!';
    const enc = service.encrypt(msg);
    const value = service.decrypt(enc);

    expect(value).toBe(value);
  });

  it('should digest an password with salt', () => {
    const passwordHash = service.digest('ABCDEFG..XYZ', 'MorningStar1234%');

    expect(passwordHash).not.toBeNull();
    expect(passwordHash.length).toBe(64);

    expect(
      service.verify(passwordHash, 'ABCDEFG..XYZ', 'MorningStar1234%')
    ).toBeTruthy();

    // console.log('> Hash Password =>', passwordHash);
  });
});
