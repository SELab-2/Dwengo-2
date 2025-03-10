import { ChallengeManager } from '../../src/application/challenge';
import * as crypto from 'crypto';

describe('ChallengeManager', () => {
  // Mock dependencies
  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000' as crypto.UUID,
    password_hash: '' // Will be set in beforeEach
  };

  let keyPair: crypto.KeyPairKeyObjectResult;
  let getUser: jest.Mock;
  let challengeManager: ChallengeManager;

  beforeEach(() => {
    // Generate a fresh Ed25519 key pair for each test
    keyPair = crypto.generateKeyPairSync('ed25519');

    // Export public key to PEM format as it would be stored in the DB
    mockUser.password_hash = keyPair.publicKey.export({
      type: 'spki',
      format: 'pem'
    }).toString();

    // Create mock getUser function
    getUser = jest.fn().mockImplementation((id) => {
      return id === mockUser.id ? mockUser : null;
    });

    // Create instance with mocked dependencies
    challengeManager = new ChallengeManager(getUser);
  });

  test('getChallenge returns challenge with expiration date', () => {
    const result = challengeManager.getChallenge();

    expect(result).toHaveProperty('challenge');
    expect(result).toHaveProperty('expiresAt');
    expect(typeof result.challenge).toBe('string');
    expect(result.challenge.length).toBeGreaterThan(0);
    expect(result.expiresAt instanceof Date).toBe(true);
    expect(result.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  test('getChallenge returns same challenge within time period', () => {
    const result1 = challengeManager.getChallenge();
    const result2 = challengeManager.getChallenge();

    expect(result1.challenge).toEqual(result2.challenge);
  });

  test('verifyChallenge returns true for valid signature', () => {
    // Get a challenge
    const { challenge } = challengeManager.getChallenge();

    // Sign the challenge with private key
    const signature = crypto.sign(
      null,
      Buffer.from(challenge),
      keyPair.privateKey
    );

    // Verify the signature
    const result = challengeManager.verifyChallenge(
      mockUser.id,
      signature.toString('base64')
    );

    expect(result).toBe(true);
  });

  test('verifyChallenge returns false for invalid signature', () => {
    // Get a challenge
    const { challenge } = challengeManager.getChallenge();

    // Create an invalid signature (signing wrong data)
    const signature = crypto.sign(
      null,
      Buffer.from(challenge + 'tampered'),
      keyPair.privateKey
    );

    // Verify the signature
    const result = challengeManager.verifyChallenge(
      mockUser.id,
      signature.toString('utf8')
    );

    expect(result).toBe(false);
  });

  test('verifyChallenge returns false for nonexistent user', () => {
    // Get a challenge
    const { challenge } = challengeManager.getChallenge();

    // Sign the challenge with private key
    const signature = crypto.sign(
      null,
      Buffer.from(challenge),
      keyPair.privateKey
    );

    // Verify with invalid user ID
    const result = challengeManager.verifyChallenge(
      '00000000-0000-0000-0000-000000000000' as crypto.UUID,
      signature.toString('utf8')
    );

    expect(result).toBe(false);
    expect(getUser).toHaveBeenCalledWith('00000000-0000-0000-0000-000000000000');
  });

  test('verifyChallenge handles errors gracefully', () => {
    // Force an error by providing malformed signature
    const result = challengeManager.verifyChallenge(
      mockUser.id,
      'not-a-valid-signature'
    );

    expect(result).toBe(false);
  });
});