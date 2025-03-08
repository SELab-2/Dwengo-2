import { randomBytes, createPublicKey, UUID } from 'crypto';
import * as crypto from 'crypto';
import { User } from '../core/entities/user';

const TIME_PERIOD_SECONDS = 60*10; // 10 minutes

export class ChallengeManager {
  private currentPeriod: number | null = null;
  private currentToken: string | null = null;
  private getUser: (id: UUID) => User;

  constructor(getUser: (id: UUID) => User) {
    this.getUser = getUser;
  }

  private getCurrentPeriod(): number {
    const secondsSinceEpoch = Math.floor(Date.now() / 1000);
    return Math.floor(secondsSinceEpoch / TIME_PERIOD_SECONDS);
  }

  private generateToken(): string {
    return randomBytes(16).toString('hex');
  }

  public getChallenge(): { challenge: string, expiresAt: Date } {
    const period = this.getCurrentPeriod();
    if (this.currentPeriod !== period || !this.currentToken) {
      this.currentPeriod = period;
      this.currentToken = this.generateToken();
    }

    const expiresAt = new Date((period + 1) * TIME_PERIOD_SECONDS * 1000);
    return { challenge: this.currentToken, expiresAt };
  }

  public verifyChallenge(userId: UUID, signedChallenge: string): boolean {
    try {
      const user = this.getUser(userId);
      if (!user || !user.password_hash) return false;

      const challenge = this.getChallenge().challenge;
      const publicKey = createPublicKey(
        {key: user.password_hash, format: 'pem', type: 'spki'}
      );

      // Convert signedChallenge from base64 string to Buffer
      return crypto.verify(
        null,
        Buffer.from(challenge),
        publicKey,
        Buffer.from(signedChallenge, 'base64')
      );
    } catch (error) {
      console.error('Challenge verification failed:', error);
      return false;
    }
  }
}
