
For generating key pairs from a password hash, we can use the following approach:

1. First generate a strong hash from the password using Argon2id (memory-hard hash function resistant to both GPU and ASIC attacks)

2. Use that hash as a seed for Ed25519 key generation (Edwards-curve Digital Signature Algorithm)

Here's a conceptual flow:

```ts
async function generateKeyPair(password) {
    // Generate strong hash using Argon2id
    const hashBuffer = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 65536,    // 64MB memory usage
        timeCost: 3,          // 3 iterations
        parallelism: 4,       // 4 threads
        hashLength: 32        // 32 bytes output
    });

    // Use hash as seed for Ed25519 key generation
    const keyPair = await crypto.generateKeyPairFromSeed(hashBuffer, 'ed25519');

    return {
        privateKey: keyPair.privateKey,
        publicKey: keyPair.publicKey
    };
}
```

Why these choices?

1. **Argon2id**:
   - Winner of the Password Hashing Competition
   - Resistant to both GPU and side-channel attacks
   - Configurable memory/CPU usage
   - Provides cryptographically secure output

2. **Ed25519**:
   - Fast and secure signature scheme
   - Small key sizes (32 bytes public key, 32 bytes private key)
   - Resistant to timing attacks
   - Widely supported in cryptographic libraries

## Usage

1. Client requests challenge:
```ts
const { challenge, expiresAt } = await fetch('/challenge').then(r => r.json())
```

2. Client signs challenge and logs in:
```ts
const privateKey = await deriveKeyFromPassword(password)
const signedChallenge = await sign(challenge, privateKey)

const loginResponse = await fetch('/login', {
    method: 'POST',
    body: JSON.stringify({
        email,
        signedChallenge
    })
})
```
