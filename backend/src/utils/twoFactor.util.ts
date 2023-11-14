import * as speakeasy from 'speakeasy';

export async function TwoFactorGenerator(): Promise<string> {
  const secret: speakeasy.GeneratedSecret = speakeasy.generateSecret({ length: 20 });
  return Promise.resolve(secret.base32);
}
