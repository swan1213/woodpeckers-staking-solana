import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

export const GLOBAL_AUTHORITY_SEED = "global-authority";

export const STAKING_PROGRAM_ID = new PublicKey(
  "2FecrHB7ZUfjDA4Y3ViPHvBEp6XC3Cgh7LzJBJDyYZZP"
);
export const BLAZE_TOKEN_MINT = new PublicKey(
  "CFt8zQNRUpK4Lxhgv64JgZ5giZ3VWXSceQr6yKh7VoFU"
);
export const BLAZE_TOKEN_DECIMAL = 1_000_000;
export const WOOD_TOKEN_MINT = new PublicKey(
  "6Tf26EZ2F8efATQpodGKYMNMZccCTL1VPYzcC4kPF6cC"
);
export const WOOD_TOKEN_DECIMAL = 1_000_000_000;

export const EPOCH = 100;
export const LOCKING_PERIOD = 60;
export const USER_POOL_SIZE = 5656; // 8 + 5648
export const USER_DUAL_POOL_SIZE = 32056; // 8 + 32048
export const USER_RANSACK_POOL_SIZE = 34456; // 8 + 32048

export interface GlobalPool {
  // 8 + 40
  superAdmin: PublicKey; // 32
  totalStakedCount: anchor.BN; // 8
  totalRewardDistributed: anchor.BN; // 8
}

export interface StakedData {
  mint: PublicKey; // 32
  stakedTime: anchor.BN; // 8
  lockTime: anchor.BN; // 8
  claimable: anchor.BN; // 8
}

export interface UserPool {
  // 8 + 5648
  owner: PublicKey; // 32
  stakedCount: anchor.BN; // 8
  accumulatedReward: anchor.BN; // 8
  staking: StakedData[]; // 56 * 100
}

export interface NestedData {
  nest: PublicKey; // 32
  woodpecker: PublicKey[]; // 32*8
  stakedTime: anchor.BN; // 8
  lockTime: anchor.BN; // 8
  claimable: anchor.BN; // 8
  emission: anchor.BN; // 8
}

export interface UserNestPool {
  // 8 + 32048
  owner: PublicKey; // 32
  stakedCount: anchor.BN; // 8
  accumulatedReward: anchor.BN; // 8
  staking: NestedData[]; // 320 * 100
}

export interface RansackedData {
  nest: PublicKey; // 32
  woodpecker: PublicKey[]; // 32*8
  stakedTime: anchor.BN; // 8
  lockTime: anchor.BN; // 8
  claimable: anchor.BN; // 8
  emission: anchor.BN; // 8
  style: anchor.BN; // 8
  rewardStyle: anchor.BN; // 8
  rewardAmount: anchor.BN; // 8
}

export interface UserRansackPool {
  // 8 + 34448
  owner: PublicKey; // 32
  stakedCount: anchor.BN; // 8
  accumulatedReward: anchor.BN; // 8
  staking: RansackedData[]; // 344 * 100
}
