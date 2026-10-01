import { AidTransaction } from '../types';

/**
 * Computes SHA-256 hash using the standard Web Crypto API.
 * Falls back to a deterministic JS hash implementation if crypto.subtle is unavailable in sandbox environments.
 */
export async function computeSha256(data: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgUint8 = new TextEncoder().encode(data);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      console.warn('Crypto subtle failed, using JS hash fallback', e);
    }
  }

  // Pure JavaScript SHA-256 fallback for maximum environment compatibility
  return jsSha256Fallback(data);
}

/**
 * Helper to hash an aid transaction payload incorporating the previous block hash
 */
export async function computeTransactionHash(
  tx: Omit<AidTransaction, 'currentHash'>
): Promise<string> {
  const payload = [
    tx.id,
    tx.reliefId,
    tx.organizationId,
    tx.workerId,
    tx.aidType,
    tx.quantity,
    tx.date,
    tx.location,
    tx.previousHash
  ].join('|');

  return computeSha256(payload);
}

/**
 * Verifies the integrity of an entire array of sequential transactions (hash chain).
 */
export async function verifyHashChain(transactions: AidTransaction[]): Promise<{
  isValid: boolean;
  tamperedIndex?: number;
  totalVerified: number;
  message: string;
}> {
  if (!transactions || transactions.length === 0) {
    return { isValid: true, totalVerified: 0, message: 'Ledger is empty.' };
  }

  let expectedPrevHash = '0000000000000000000000000000000000000000000000000000000000000000';

  for (let i = 0; i < transactions.length; i++) {
    const tx = transactions[i];

    // Check link to previous hash
    if (tx.previousHash !== expectedPrevHash) {
      return {
        isValid: false,
        tamperedIndex: i,
        totalVerified: i,
        message: `Broken chain link at index ${i} (ID: ${tx.id}). Previous hash mismatch.`
      };
    }

    // Recompute current hash
    const recalculatedHash = await computeTransactionHash(tx);
    if (recalculatedHash !== tx.currentHash) {
      return {
        isValid: false,
        tamperedIndex: i,
        totalVerified: i,
        message: `Tampered transaction data detected at index ${i} (ID: ${tx.id}). Hash verification failed.`
      };
    }

    expectedPrevHash = tx.currentHash;
  }

  return {
    isValid: true,
    totalVerified: transactions.length,
    message: `✓ Ledger integrity verified across all ${transactions.length} sequential transactions.`
  };
}

/**
 * Lightweight fallback SHA-256 implementation
 */
function jsSha256Fallback(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i: number, j: number;
  const result: string[] = [];

  const words: number[] = [];
  const asciiLength = ascii[lengthProperty] * 8;

  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  let asciiBitLength = asciiLength;
  let blocks: number[] = [];

  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << ((3 - (i % 4)) * 8);
  }

  words[ascii[lengthProperty] >> 2] |= 0x80 << ((3 - (ascii[lengthProperty] % 4)) * 8);
  words[(((ascii[lengthProperty] + 8) >> 6) << 4) + 15] = asciiBitLength;

  for (i = 0; i < words[lengthProperty]; i += 16) {
    const w = words.slice(i, i + 16);
    const oldHash = hash.slice(0);

    for (j = 0; j < 64; j++) {
      let w15 = w[j - 15], w2 = w[j - 2];

      if (j < 16) {
        // w[j] already initialized
      } else {
        const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
        const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
      }

      const s1 = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const temp1 = hash[7] + s1 + ch + k[j] + (w[j] || 0);
      const s0 = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const temp2 = s0 + maj;

      hash[7] = hash[6];
      hash[6] = hash[5];
      hash[5] = hash[4];
      hash[4] = (hash[3] + temp1) | 0;
      hash[3] = hash[2];
      hash[2] = hash[1];
      hash[1] = hash[0];
      hash[0] = (temp1 + temp2) | 0;
    }

    for (j = 0; j < 8; j++) {
      hash[j] = (hash[j] + oldHash[j]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result.push((b < 16 ? '0' : '') + b.toString(16));
    }
  }

  return result.join('');
}
