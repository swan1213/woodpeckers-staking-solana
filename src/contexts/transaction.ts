import { Edition } from "@metaplex-foundation/mpl-token-metadata";
import * as anchor from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { IDL as StakingIDL } from "./staking";
import {
  PublicKey,
  Connection,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from "@solana/web3.js";

import {
  STAKING_PROGRAM_ID,
  GLOBAL_AUTHORITY_SEED,
  GlobalPool,
  BLAZE_TOKEN_MINT,
  USER_POOL_SIZE,
  BLAZE_TOKEN_DECIMAL,
  UserPool,
  USER_DUAL_POOL_SIZE,
  UserNestPool,
  UserRansackPool,
  RansackedData,
  WOOD_TOKEN_MINT,
  USER_RANSACK_POOL_SIZE,
} from "./type";

import {
  getAssociatedTokenAccount,
  getATokenAccountsNeedCreate,
  getNFTTokenAccount,
  getOwnerOfNFT,
  getMetadata,
  METAPLEX,
  isExistAccount,
  solConnection,
  filterError,
} from "./utils";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { successAlert } from "../components/toastGroup";

export const initUserPool = async (wallet: WalletContextState) => {
  if (wallet.publicKey === null) {
    return;
  }
  const cloneWindow: any = window;
  const userAddress = wallet.publicKey;
  const provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    StakingIDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );
  try {
    const tx = await createInitUserPoolTx(userAddress, program, solConnection);
    const { blockhash } = await provider.connection.getLatestBlockhash(
      "confirmed"
    );
    tx.feePayer = wallet.publicKey as PublicKey;
    tx.recentBlockhash = blockhash;
    if (wallet.signTransaction !== undefined) {
      const signedTx = await wallet.signTransaction(tx);

      const txId = await provider.connection.sendRawTransaction(
        signedTx.serialize(),
        { skipPreflight: true, maxRetries: 3, preflightCommitment: "confirmed" }
      );
      await solConnection.confirmTransaction(txId, "confirmed");
    }
  } catch (error) {
    console.log("Init user pull error: ", error);
  }
};

export const initUserDualPool = async (wallet: WalletContextState) => {
  if (wallet.publicKey === null) return;

  const cloneWindow: any = window;
  const userAddress = wallet.publicKey;
  const provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    StakingIDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );
  try {
    const tx = await createInitUserDualPoolTx(
      userAddress,
      program,
      solConnection
    );

    const { blockhash } = await provider.connection.getLatestBlockhash(
      "confirmed"
    );
    tx.feePayer = wallet.publicKey as PublicKey;
    tx.recentBlockhash = blockhash;
    if (wallet.signTransaction !== undefined) {
      const signedTx = await wallet.signTransaction(tx);

      const txId = await provider.connection.sendRawTransaction(
        signedTx.serialize(),
        { skipPreflight: true, maxRetries: 3, preflightCommitment: "confirmed" }
      );
      await solConnection.confirmTransaction(txId, "confirmed");
    }
  } catch (error) {
    console.log("Init dual user pull error: ", error);
  }
};

export const initUserRansackPool = async (wallet: WalletContextState) => {
  if (wallet.publicKey === null) return;

  const cloneWindow: any = window;
  const userAddress = wallet.publicKey;
  const provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    StakingIDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );
  try {
    const tx = await createInitUserRansackPoolTx(
      userAddress,
      program,
      solConnection
    );

    const { blockhash } = await provider.connection.getLatestBlockhash(
      "confirmed"
    );
    tx.feePayer = wallet.publicKey as PublicKey;
    tx.recentBlockhash = blockhash;
    if (wallet.signTransaction !== undefined) {
      const signedTx = await wallet.signTransaction(tx);

      const txId = await provider.connection.sendRawTransaction(
        signedTx.serialize(),
        {
          skipPreflight: true,
          maxRetries: 3,
          preflightCommitment: "confirmed",
        }
      );
      await solConnection.confirmTransaction(txId, "confirmed");
    }
  } catch (error) {
    console.log("Init dual user pull error: ", error);
  }
};

export const stakeNFT = async (
  wallet: WalletContextState,
  nfts: {
    mint: PublicKey;
  }[],
  lockTime: number,
  setLoading: Function,
  updatePage: Function
) => {
  if (wallet.publicKey === null) return;
  const cloneWindow: any = window;
  const userAddress = wallet.publicKey;
  const provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    StakingIDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );

  try {
    setLoading(true);
    let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
      userAddress,
      "user-pool",
      STAKING_PROGRAM_ID
    );

    let poolAccount = await solConnection.getAccountInfo(userPoolKey);
    if (poolAccount === null || poolAccount.data === null) {
      await initUserPool(wallet);
    }
    let transactions: Transaction[] = [];
    for (let i = 0; i < nfts.length; i++) {
      const tx = await createStakeNftTx(
        nfts[i].mint,
        userAddress,
        program,
        solConnection,
        lockTime
      );
      if (tx) transactions.push(tx);
    }

    if (transactions.length !== 0) {
      let { blockhash } = await provider.connection.getLatestBlockhash(
        "confirmed"
      );
      transactions.forEach((transaction) => {
        transaction.feePayer = wallet.publicKey as PublicKey;
        transaction.recentBlockhash = blockhash;
      });
      if (wallet.signAllTransactions !== undefined) {
        const signedTransactions = await wallet.signAllTransactions(
          transactions
        );

        let signatures = await Promise.all(
          signedTransactions.map((transaction) =>
            provider.connection.sendRawTransaction(transaction.serialize(), {
              skipPreflight: true,
              maxRetries: 3,
              preflightCommitment: "confirmed",
            })
          )
        );
        await Promise.all(
          signatures.map((signature) =>
            provider.connection.confirmTransaction(signature, "finalized")
          )
        );
        setLoading(false);
        successAlert("Transaction is confirmed!");
        updatePage();
      }
    } else {
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
    filterError(error);
    console.log(error);
  }
};

export const nestToPool = async (
  wallet: WalletContextState,
  nestMint: PublicKey,
  woodPecker: {
    mint: PublicKey;
  }[],
  lockTime: number,
  tier: number,
  setLoading: Function,
  updatePage: Function
) => {
  if (wallet.publicKey === null) return;
  const cloneWindow: any = window;
  const userAddress = wallet.publicKey;
  const provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    StakingIDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );
  try {
    let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
      userAddress,
      "user-nest-pool",
      STAKING_PROGRAM_ID
    );

    setLoading(true);
    let poolAccount = await solConnection.getAccountInfo(userPoolKey);
    if (poolAccount === null || poolAccount.data === null) {
      await initUserDualPool(wallet);
    }
    const tx = await createNestToPoolTx(
      nestMint,
      woodPecker,
      userAddress,
      program,
      solConnection,
      lockTime,
      tier
    );
    const { blockhash } = await provider.connection.getLatestBlockhash(
      "confirmed"
    );
    tx.feePayer = wallet.publicKey as PublicKey;
    tx.recentBlockhash = blockhash;
    if (wallet.signTransaction !== undefined) {
      const signedTx = await wallet.signTransaction(tx);

      const txId = await provider.connection.sendRawTransaction(
        signedTx.serialize(),
        { skipPreflight: true, maxRetries: 3, preflightCommitment: "confirmed" }
      );
      await solConnection.confirmTransaction(txId, "confirmed");
    }
    successAlert("Transaction was confirmed!");
    setLoading(false);
    updatePage();
  } catch (error) {
    filterError(error);
    setLoading(false);
    console.log(error);
  }
};

export const ransackToPool = async (
  wallet: WalletContextState,
  nestMint: PublicKey,
  woodPecker: {
    mint: PublicKey;
  }[],
  style: number,
  lockTime: number,
  tier: number,
  setLoading: Function,
  updatePage: Function
) => {
  if (wallet.publicKey === null) return;
  const cloneWindow: any = window;
  const userAddress = wallet.publicKey;
  const provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    StakingIDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );
  try {
    setLoading(true);
    let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
      userAddress,
      "user-ransack-pool-1",
      STAKING_PROGRAM_ID
    );

    let poolAccount = await solConnection.getAccountInfo(userPoolKey);
    if (poolAccount === null || poolAccount.data === null) {
      await initUserRansackPool(wallet);
    }

    const tx = await createRansackToPoolTx(
      nestMint,
      woodPecker,
      style,
      userAddress,
      program,
      solConnection,
      lockTime,
      tier
    );

    console.log(tx, "target tx");

    const { blockhash } = await provider.connection.getLatestBlockhash(
      "confirmed"
    );
    tx.feePayer = wallet.publicKey as PublicKey;
    tx.recentBlockhash = blockhash;
    if (wallet.signTransaction !== undefined) {
      const signedTx = await wallet.signTransaction(tx);
      const txId = await provider.connection.sendRawTransaction(
        signedTx.serialize(),
        { skipPreflight: true, maxRetries: 3, preflightCommitment: "confirmed" }
      );
      await solConnection.confirmTransaction(txId, "confirmed");
    }
    successAlert("Transaction was confirmed!");
    setLoading(false);
    updatePage();
  } catch (error) {
    filterError(error);
    setLoading(false);
    console.log(error);
  }
};

export const withdrawNft = async (
  wallet: WalletContextState,
  nfts: {
    mint: PublicKey;
  }[],
  setLoading: Function,
  updatePage: Function
) => {
  if (wallet.publicKey === null) return;
  const cloneWindow: any = window;
  const userAddress = wallet.publicKey;
  const provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    StakingIDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );

  try {
    setLoading(true);
    let transactions: Transaction[] = [];
    for (let i = 0; i < nfts.length; i++) {
      const tx = await createWithdrawNftTx(
        nfts[i].mint,
        userAddress,
        program,
        solConnection
      );
      if (tx) transactions.push(tx);
    }

    if (transactions.length !== 0) {
      let { blockhash } = await provider.connection.getLatestBlockhash(
        "confirmed"
      );
      transactions.forEach((transaction) => {
        transaction.feePayer = wallet.publicKey as PublicKey;
        transaction.recentBlockhash = blockhash;
      });
      if (wallet.signAllTransactions !== undefined) {
        const signedTransactions = await wallet.signAllTransactions(
          transactions
        );

        let signatures = await Promise.all(
          signedTransactions.map((transaction) =>
            provider.connection.sendRawTransaction(transaction.serialize(), {
              skipPreflight: true,
              maxRetries: 3,
              preflightCommitment: "confirmed",
            })
          )
        );
        await Promise.all(
          signatures.map((signature) =>
            provider.connection.confirmTransaction(signature, "finalized")
          )
        );
        setLoading(false);
        successAlert("Transaction is confirmed!");
        updatePage();
      }
    } else {
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
    filterError(error);
    console.log(error);
  }
};

export const withdrawNestNft = async (
  wallet: WalletContextState,
  nfts: {
    nestMint: PublicKey;
  }[],
  setLoading: Function,
  updatePage: Function
) => {
  if (wallet.publicKey === null) return;
  const cloneWindow: any = window;
  const userAddress = wallet.publicKey;
  const provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    StakingIDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );

  try {
    setLoading(true);
    let transactions: Transaction[] = [];
    for (let i = 0; i < nfts.length; i++) {
      const tx = await createWithdrawNestNftTx(
        nfts[i].nestMint,
        userAddress,
        program,
        solConnection
      );
      if (tx) transactions.push(tx);
    }

    if (transactions.length !== 0) {
      let { blockhash } = await provider.connection.getLatestBlockhash(
        "confirmed"
      );
      transactions.forEach((transaction) => {
        transaction.feePayer = wallet.publicKey as PublicKey;
        transaction.recentBlockhash = blockhash;
      });
      if (wallet.signAllTransactions !== undefined) {
        const signedTransactions = await wallet.signAllTransactions(
          transactions
        );

        let signatures = await Promise.all(
          signedTransactions.map((transaction) =>
            provider.connection.sendRawTransaction(transaction.serialize(), {
              skipPreflight: true,
              maxRetries: 3,
              preflightCommitment: "confirmed",
            })
          )
        );
        await Promise.all(
          signatures.map((signature) =>
            provider.connection.confirmTransaction(signature, "finalized")
          )
        );
        setLoading(false);
        successAlert("Transaction is confirmed!");
        updatePage();
      }
    } else {
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
    filterError(error);
    console.log(error);
  }
};

export const withdrawRansackft = async (
  wallet: WalletContextState,
  nfts: {
    nestMint: PublicKey;
  }[],
  setLoading: Function,
  updatePage: Function
) => {
  if (wallet.publicKey === null) return;
  const cloneWindow: any = window;
  const userAddress = wallet.publicKey;
  const provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    StakingIDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );

  try {
    setLoading(true);
    let transactions: Transaction[] = [];
    for (let i = 0; i < nfts.length; i++) {
      const tx = await createWithdrawRansackNftTx(
        nfts[i].nestMint,
        userAddress,
        program,
        solConnection
      );
      if (tx) transactions.push(tx);
    }

    if (transactions.length !== 0) {
      let { blockhash } = await provider.connection.getLatestBlockhash(
        "confirmed"
      );
      transactions.forEach((transaction) => {
        transaction.feePayer = wallet.publicKey as PublicKey;
        transaction.recentBlockhash = blockhash;
      });
      if (wallet.signAllTransactions !== undefined) {
        const signedTransactions = await wallet.signAllTransactions(
          transactions
        );

        let signatures = await Promise.all(
          signedTransactions.map((transaction) =>
            provider.connection.sendRawTransaction(transaction.serialize(), {
              skipPreflight: true,
              maxRetries: 3,
              preflightCommitment: "confirmed",
            })
          )
        );
        await Promise.all(
          signatures.map((signature) =>
            provider.connection.confirmTransaction(signature, "finalized")
          )
        );
        setLoading(false);
        successAlert("Transaction is confirmed!");
        updatePage();
      }
    } else {
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
    filterError(error);
    console.log(error);
  }
};

export const claimReward = async (
  wallet: WalletContextState,
  setLoading: Function,
  updatePage: Function,
  mint?: PublicKey
) => {
  if (wallet.publicKey === null) return;
  const cloneWindow: any = window;
  const userAddress = wallet.publicKey;
  const provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    StakingIDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );

  try {
    setLoading(true);
    const tx = await createClaimTx(userAddress, program, solConnection, mint);
    const { blockhash } = await provider.connection.getLatestBlockhash(
      "confirmed"
    );
    tx.feePayer = wallet.publicKey as PublicKey;
    tx.recentBlockhash = blockhash;
    if (wallet.signTransaction !== undefined) {
      const signedTx = await wallet.signTransaction(tx);

      const txId = await provider.connection.sendRawTransaction(
        signedTx.serialize(),
        { skipPreflight: true, maxRetries: 3, preflightCommitment: "confirmed" }
      );
      await solConnection.confirmTransaction(txId, "confirmed");
      successAlert("Transaction was confirmed!");
      setLoading(false);
      updatePage();
    }
  } catch (error) {
    filterError(error);
    console.log(error);
    setLoading(false);
  }
};

export const claimNestReward = async (
  wallet: WalletContextState,
  setLoading: Function,
  updatePage: Function,
  nestMint?: PublicKey
) => {
  if (wallet.publicKey === null) return;
  const cloneWindow: any = window;
  const userAddress = wallet.publicKey;
  const provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    StakingIDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );
  try {
    setLoading(true);

    const tx = await createNestClaimTx(
      userAddress,
      program,
      solConnection,
      nestMint
    );
    const { blockhash } = await provider.connection.getLatestBlockhash(
      "confirmed"
    );
    tx.feePayer = wallet.publicKey as PublicKey;
    tx.recentBlockhash = blockhash;
    if (wallet.signTransaction !== undefined) {
      const signedTx = await wallet.signTransaction(tx);

      const txId = await provider.connection.sendRawTransaction(
        signedTx.serialize(),
        { skipPreflight: true, maxRetries: 3, preflightCommitment: "confirmed" }
      );
      await solConnection.confirmTransaction(txId, "confirmed");
      successAlert("Transaction was confirmed!");
      setLoading(false);
      updatePage();
    }
  } catch (error) {
    filterError(error);
    console.log(error);
    setLoading(false);
  }
};

export const claimRansack = async (
  wallet: WalletContextState,
  nestMint: PublicKey,
  setLoading: Function,
  updatePage: Function
) => {
  if (wallet.publicKey === null) return;
  const cloneWindow: any = window;
  const userAddress = wallet.publicKey;
  const provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    StakingIDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );
  try {
    setLoading(true);
    const tx = await createRansackClaimTx(userAddress, program, nestMint);
    const { blockhash } = await provider.connection.getLatestBlockhash(
      "confirmed"
    );
    tx.feePayer = wallet.publicKey as PublicKey;
    tx.recentBlockhash = blockhash;
    if (wallet.signTransaction !== undefined) {
      const signedTx = await wallet.signTransaction(tx);

      const txId = await provider.connection.sendRawTransaction(
        signedTx.serialize(),
        { skipPreflight: true, maxRetries: 3, preflightCommitment: "confirmed" }
      );
      await solConnection.confirmTransaction(txId, "confirmed");
      successAlert("Transaction was confirmed!");
      const state = await getRansackedDetail(userAddress, nestMint);
      console.log(state?.rewardStyle.toNumber());
      console.log(state?.rewardAmount.toNumber());
      setLoading(false);
      updatePage();
    }
  } catch (error) {
    filterError(error);
    console.log(error);
    setLoading(false);
  }
};

export const withdrawToken = async (
  wallet: WalletContextState,
  amount: number,
  setLoading: Function,
  updatePage: Function
) => {
  if (wallet.publicKey === null) return;
  const cloneWindow: any = window;
  const userAddress = wallet.publicKey;
  const provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    StakingIDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );
  try {
    setLoading(true);
    const tx = await createWithdrawTx(
      userAddress,
      amount,
      program,
      solConnection
    );

    const { blockhash } = await provider.connection.getLatestBlockhash(
      "confirmed"
    );
    tx.feePayer = wallet.publicKey as PublicKey;
    tx.recentBlockhash = blockhash;
    if (wallet.signTransaction !== undefined) {
      const signedTx = await wallet.signTransaction(tx);

      const txId = await provider.connection.sendRawTransaction(
        signedTx.serialize(),
        { skipPreflight: true, maxRetries: 3, preflightCommitment: "confirmed" }
      );
      await solConnection.confirmTransaction(txId, "confirmed");
      successAlert("Transaction was confirmed!");
      setLoading(false);
      updatePage();
    }
  } catch (error) {
    filterError(error);
    console.log(error);
    setLoading(false);
  }
};

export const createInitializeTx = async (
  userAddress: PublicKey,
  program: anchor.Program
) => {
  const [globalAuthority, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    STAKING_PROGRAM_ID
  );
  const rewardVault = await getAssociatedTokenAccount(
    globalAuthority,
    BLAZE_TOKEN_MINT
  );
  console.log(rewardVault.toBase58());

  let tx = new Transaction();
  console.log("==>initializing program", rewardVault.toBase58());

  tx.add(
    program.instruction.initialize(bump, {
      accounts: {
        admin: userAddress,
        globalAuthority,
        rewardVault,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      },
      instructions: [],
      signers: [],
    })
  );

  return tx;
};

export const createInitUserPoolTx = async (
  userAddress: PublicKey,
  program: anchor.Program,
  connection: Connection
) => {
  let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
    userAddress,
    "user-pool",
    STAKING_PROGRAM_ID
  );
  console.log(USER_POOL_SIZE);
  let ix = SystemProgram.createAccountWithSeed({
    fromPubkey: userAddress,
    basePubkey: userAddress,
    seed: "user-pool",
    newAccountPubkey: userPoolKey,
    lamports: await connection.getMinimumBalanceForRentExemption(
      USER_POOL_SIZE
    ),
    space: USER_POOL_SIZE,
    programId: STAKING_PROGRAM_ID,
  });

  let tx = new Transaction();
  console.log("==>initializing user PDA", userPoolKey.toBase58());
  tx.add(ix);
  tx.add(
    program.instruction.initializeUserPool({
      accounts: {
        userPool: userPoolKey,
        owner: userAddress,
      },
      instructions: [],
      signers: [],
    })
  );

  return tx;
};

export const createInitUserDualPoolTx = async (
  userAddress: PublicKey,
  program: anchor.Program,
  connection: Connection
) => {
  let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
    userAddress,
    "user-nest-pool",
    STAKING_PROGRAM_ID
  );
  console.log(USER_DUAL_POOL_SIZE);
  let ix = SystemProgram.createAccountWithSeed({
    fromPubkey: userAddress,
    basePubkey: userAddress,
    seed: "user-nest-pool",
    newAccountPubkey: userPoolKey,
    lamports: await connection.getMinimumBalanceForRentExemption(
      USER_DUAL_POOL_SIZE
    ),
    space: USER_DUAL_POOL_SIZE,
    programId: STAKING_PROGRAM_ID,
  });

  let tx = new Transaction();
  console.log("==>initializing user dual PDA", userPoolKey.toBase58());
  tx.add(ix);
  tx.add(
    program.instruction.initializeUserDualPool({
      accounts: {
        userDualPool: userPoolKey,
        owner: userAddress,
      },
      instructions: [],
      signers: [],
    })
  );

  return tx;
};

export const createInitUserRansackPoolTx = async (
  userAddress: PublicKey,
  program: anchor.Program,
  connection: Connection
) => {
  let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
    userAddress,
    "user-ransack-pool-1",
    STAKING_PROGRAM_ID
  );
  console.log(USER_RANSACK_POOL_SIZE);
  let ix = SystemProgram.createAccountWithSeed({
    fromPubkey: userAddress,
    basePubkey: userAddress,
    seed: "user-ransack-pool-1",
    newAccountPubkey: userPoolKey,
    lamports: await connection.getMinimumBalanceForRentExemption(
      USER_RANSACK_POOL_SIZE
    ),
    space: USER_RANSACK_POOL_SIZE,
    programId: STAKING_PROGRAM_ID,
  });

  let tx = new Transaction();
  console.log("==>initializing user dual PDA", userPoolKey.toBase58());
  tx.add(ix);
  tx.add(
    program.instruction.initializeUserRansackPool({
      accounts: {
        userDualPool: userPoolKey,
        owner: userAddress,
      },
      instructions: [],
      signers: [],
    })
  );

  return tx;
};

export const createStakeNftTx = async (
  mint: PublicKey,
  userAddress: PublicKey,
  program: anchor.Program,
  connection: Connection,
  lockTime: number
) => {
  const [globalAuthority, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    STAKING_PROGRAM_ID
  );

  let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
    userAddress,
    "user-pool",
    STAKING_PROGRAM_ID
  );

  let userTokenAccount = await getAssociatedTokenAccount(userAddress, mint);
  if (!(await isExistAccount(userTokenAccount, connection))) {
    let accountOfNFT = await getNFTTokenAccount(mint, connection);
    if (userTokenAccount.toBase58() != accountOfNFT.toBase58()) {
      let nftOwner = await getOwnerOfNFT(mint, connection);
      if (nftOwner.toBase58() == userAddress.toBase58())
        userTokenAccount = accountOfNFT;
      else if (nftOwner.toBase58() !== globalAuthority.toBase58()) {
        throw "Error: Nft is not owned by user";
      }
    }
  }
  console.log("NFT = ", mint.toBase58(), userTokenAccount.toBase58());

  let { instructions, destinationAccounts } = await getATokenAccountsNeedCreate(
    connection,
    userAddress,
    globalAuthority,
    [BLAZE_TOKEN_MINT]
  );

  let ret = await getATokenAccountsNeedCreate(
    connection,
    userAddress,
    userAddress,
    [BLAZE_TOKEN_MINT]
  );

  console.log("Dest NFT Account = ", destinationAccounts[0].toBase58());

  const metadata = await getMetadata(mint);

  console.log("Metadata=", metadata.toBase58());
  const editionId = await Edition.getPDA(mint);
  let remainingAccounts = [
    {
      pubkey: editionId,
      isSigner: false,
      isWritable: false,
    },
  ];

  let tx = new Transaction();

  if (instructions.length > 0) instructions.map((ix) => tx.add(ix));
  if (ret.instructions.length > 0) ret.instructions.map((ix) => tx.add(ix));

  console.log("==>listing", mint.toBase58(), lockTime);

  tx.add(
    program.instruction.stakeNftToPool(bump, new anchor.BN(lockTime), {
      accounts: {
        owner: userAddress,
        globalAuthority,
        userPool: userPoolKey,
        userNftTokenAccount: userTokenAccount,
        userTokenAccount: ret.destinationAccounts[0],
        destTokenAccount: destinationAccounts[0],
        nftMint: mint,
        mintMetadata: metadata,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenMetadataProgram: METAPLEX,
      },
      remainingAccounts,
      instructions: [],
      signers: [],
    })
  );

  return tx;
};

export const createNestToPoolTx = async (
  nestMint: PublicKey,
  woodpecker: {
    mint: PublicKey;
  }[],
  userAddress: PublicKey,
  program: anchor.Program,
  connection: Connection,
  lockTime: number,
  tier: number
) => {
  const [globalAuthority, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    STAKING_PROGRAM_ID
  );

  let userDualPoolKey = await anchor.web3.PublicKey.createWithSeed(
    userAddress,
    "user-nest-pool",
    STAKING_PROGRAM_ID
  );

  let userNestAccount = await getAssociatedTokenAccount(userAddress, nestMint);
  if (!(await isExistAccount(userNestAccount, connection))) {
    let accountOfNFT = await getNFTTokenAccount(nestMint, connection);
    if (userNestAccount.toBase58() != accountOfNFT.toBase58()) {
      let nftOwner = await getOwnerOfNFT(nestMint, connection);
      if (nftOwner.toBase58() == userAddress.toBase58())
        userNestAccount = accountOfNFT;
      else if (nftOwner.toBase58() !== globalAuthority.toBase58()) {
        throw "Error: Nft is not owned by user";
      }
    }
  }
  console.log("Nest NFT = ", nestMint.toBase58(), userNestAccount.toBase58());

  let remainingAccounts = [];
  for (let i = 0; i < woodpecker.length; i++) {
    let userWoodAccount = await getAssociatedTokenAccount(
      userAddress,
      woodpecker[i].mint
    );
    if (!(await isExistAccount(userWoodAccount, connection))) {
      let accountOfNFT = await getNFTTokenAccount(
        woodpecker[i].mint,
        connection
      );
      if (userWoodAccount.toBase58() != accountOfNFT.toBase58()) {
        let nftOwner = await getOwnerOfNFT(woodpecker[i].mint, connection);
        if (nftOwner.toBase58() == userAddress.toBase58())
          userWoodAccount = accountOfNFT;
        else if (nftOwner.toBase58() !== globalAuthority.toBase58()) {
          throw "Error: Nft is not owned by user";
        }
      }
    }
    console.log(
      "Woodpecker NFT = ",
      woodpecker[i].mint.toBase58(),
      userWoodAccount.toBase58()
    );

    let woodEditionId = await Edition.getPDA(woodpecker[i].mint);

    remainingAccounts.push({
      pubkey: woodpecker[i].mint,
      isSigner: false,
      isWritable: false,
    });
    remainingAccounts.push({
      pubkey: userWoodAccount,
      isSigner: false,
      isWritable: true,
    });
    remainingAccounts.push({
      pubkey: woodEditionId,
      isSigner: false,
      isWritable: false,
    });
  }

  let userTokenAccount = await getAssociatedTokenAccount(
    userAddress,
    BLAZE_TOKEN_MINT
  );
  let destTokenAccount = await getAssociatedTokenAccount(
    globalAuthority,
    BLAZE_TOKEN_MINT
  );
  if (!(await isExistAccount(userTokenAccount, connection))) {
    throw "Error: The user doesn't own BLAZE";
  }
  if (!(await isExistAccount(destTokenAccount, connection))) {
    throw "Error: The PDA doesn't own BLAZE";
  }

  const nestMetadata = await getMetadata(nestMint);
  const nestEditionInfo = await Edition.getPDA(nestMint);

  let tx = new Transaction();
  console.log(nestEditionInfo.toBase58(), "==> nestEditionInfo");
  tx.add(
    program.instruction.nestToPool(bump, tier, new anchor.BN(lockTime), {
      accounts: {
        owner: userAddress,
        globalAuthority,
        userDualPool: userDualPoolKey,
        userNestAccount,
        nestMint,
        userTokenAccount,
        destTokenAccount,
        nestEditionInfo,
        nestMetadata,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenMetadataProgram: METAPLEX,
      },
      remainingAccounts,
      instructions: [],
      signers: [],
    })
  );

  return tx;
};

export const createRansackToPoolTx = async (
  nestMint: PublicKey,
  woodpecker: { mint: PublicKey }[],
  style: number,
  userAddress: PublicKey,
  program: anchor.Program,
  connection: Connection,
  lockTime: number,
  tier: number
) => {
  const [globalAuthority, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    STAKING_PROGRAM_ID
  );

  let userDualPoolKey = await anchor.web3.PublicKey.createWithSeed(
    userAddress,
    "user-ransack-pool-1",
    STAKING_PROGRAM_ID
  );

  let userNestAccount = await getAssociatedTokenAccount(userAddress, nestMint);
  if (!(await isExistAccount(userNestAccount, connection))) {
    let accountOfNFT = await getNFTTokenAccount(nestMint, connection);
    if (userNestAccount.toBase58() != accountOfNFT.toBase58()) {
      let nftOwner = await getOwnerOfNFT(nestMint, connection);
      if (nftOwner.toBase58() == userAddress.toBase58())
        userNestAccount = accountOfNFT;
      else if (nftOwner.toBase58() !== globalAuthority.toBase58()) {
        throw "Error: Nft is not owned by user";
      }
    }
  }
  console.log("Nest NFT = ", nestMint.toBase58(), userNestAccount.toBase58());

  let remainingAccounts: any = [];
  for (let i = 0; i < woodpecker.length; i++) {
    let userWoodAccount = await getAssociatedTokenAccount(
      userAddress,
      woodpecker[i].mint
    );
    if (!(await isExistAccount(userWoodAccount, connection))) {
      let accountOfNFT = await getNFTTokenAccount(
        woodpecker[i].mint,
        connection
      );
      if (userWoodAccount.toBase58() != accountOfNFT.toBase58()) {
        let nftOwner = await getOwnerOfNFT(woodpecker[i].mint, connection);
        if (nftOwner.toBase58() == userAddress.toBase58())
          userWoodAccount = accountOfNFT;
        else if (nftOwner.toBase58() !== globalAuthority.toBase58()) {
          throw "Error: Nft is not owned by user";
        }
      }
    }
    console.log(
      "Woodpecker NFT = ",
      woodpecker[i].mint.toBase58(),
      userWoodAccount.toBase58()
    );

    let woodEditionId = await Edition.getPDA(woodpecker[i].mint);

    remainingAccounts.push({
      pubkey: woodpecker[i].mint,
      isSigner: false,
      isWritable: false,
    });
    remainingAccounts.push({
      pubkey: userWoodAccount,
      isSigner: false,
      isWritable: true,
    });
    remainingAccounts.push({
      pubkey: woodEditionId,
      isSigner: false,
      isWritable: false,
    });
  }

  let userTokenAccount = await getAssociatedTokenAccount(
    userAddress,
    BLAZE_TOKEN_MINT
  );
  let destTokenAccount = await getAssociatedTokenAccount(
    globalAuthority,
    BLAZE_TOKEN_MINT
  );
  if (!(await isExistAccount(userTokenAccount, connection))) {
    throw "Error: The user doesn't own BLAZE";
  }
  if (!(await isExistAccount(destTokenAccount, connection))) {
    throw "Error: The PDA doesn't own BLAZE";
  }

  const nestMetadata = await getMetadata(nestMint);
  const nestEditionInfo = await Edition.getPDA(nestMint);

  let tx = new Transaction();
  console.log(tier, "tier");
  console.log(lockTime, "lockTime");
  console.log(style, "style");
  const state = await getRansackPoolState(
    new PublicKey("7Fa4oikF3dzqTpZqNWCvonTQ76scHBtcTaFXcjcbe3gg")
  );
  if (state) console.log(state.staking[1].style.toNumber(), "+target console+");

  tx.add(
    program.instruction.ransackToPool(
      bump,
      tier,
      new anchor.BN(style),
      new anchor.BN(lockTime),
      {
        accounts: {
          owner: userAddress,
          globalAuthority,
          userDualPool: userDualPoolKey,
          userNestAccount,
          nestMint,
          userTokenAccount,
          destTokenAccount,
          nestEditionInfo,
          nestMetadata,
          tokenProgram: TOKEN_PROGRAM_ID,
          tokenMetadataProgram: METAPLEX,
        },
        remainingAccounts,
        instructions: [],
        signers: [],
      }
    )
  );

  return tx;
};

export const createWithdrawNftTx = async (
  mint: PublicKey,
  userAddress: PublicKey,
  program: anchor.Program,
  connection: Connection
) => {
  let ret = await getATokenAccountsNeedCreate(
    connection,
    userAddress,
    userAddress,
    [mint]
  );
  let userTokenAccount = ret.destinationAccounts[0];
  console.log("User NFT = ", mint.toBase58(), userTokenAccount.toBase58());

  const [globalAuthority, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    STAKING_PROGRAM_ID
  );
  let rewardVault = await getAssociatedTokenAccount(
    globalAuthority,
    BLAZE_TOKEN_MINT
  );

  let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
    userAddress,
    "user-pool",
    STAKING_PROGRAM_ID
  );

  let ret1 = await getATokenAccountsNeedCreate(
    connection,
    userAddress,
    userAddress,
    [BLAZE_TOKEN_MINT]
  );

  const editionId = await Edition.getPDA(mint);
  let remainingAccounts = [
    {
      pubkey: editionId,
      isSigner: false,
      isWritable: true,
    },
  ];

  let tx = new Transaction();

  if (ret.instructions.length > 0) ret.instructions.map((ix) => tx.add(ix));
  if (ret1.instructions.length > 0) ret1.instructions.map((ix) => tx.add(ix));
  console.log("==> withdrawing", mint.toBase58());

  tx.add(
    program.instruction.withdrawNftFromPool(bump, {
      accounts: {
        owner: userAddress,
        globalAuthority,
        userPool: userPoolKey,
        userNftTokenAccount: userTokenAccount,
        rewardVault,
        userRewardAccount: ret1.destinationAccounts[0],
        nftMint: mint,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenMetadataProgram: METAPLEX,
      },
      remainingAccounts,
      instructions: [],
      signers: [],
    })
  );

  return tx;
};

export const createWithdrawNestNftTx = async (
  nestMint: PublicKey,
  userAddress: PublicKey,
  program: anchor.Program,
  connection: Connection
) => {
  const [globalAuthority, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    STAKING_PROGRAM_ID
  );

  console.log(nestMint.toBase58(), "==================");
  let userNestAccount = await getAssociatedTokenAccount(userAddress, nestMint);
  console.log(userNestAccount.toBase58());
  if (!(await isExistAccount(userNestAccount, connection))) {
    console.log(nestMint.toBase58());
    let accountOfNFT = await getNFTTokenAccount(nestMint, connection);
    if (userNestAccount.toBase58() != accountOfNFT.toBase58()) {
      let nftOwner = await getOwnerOfNFT(nestMint, connection);
      if (nftOwner.toBase58() == userAddress.toBase58())
        userNestAccount = accountOfNFT;
      else if (nftOwner.toBase58() !== globalAuthority.toBase58()) {
        throw "Error: Nft is not owned by user";
      }
    }
  }

  let ret = await getATokenAccountsNeedCreate(
    connection,
    userAddress,
    userAddress,
    [BLAZE_TOKEN_MINT]
  );

  let rewardVault = await getAssociatedTokenAccount(
    globalAuthority,
    BLAZE_TOKEN_MINT
  );

  let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
    userAddress,
    "user-nest-pool",
    STAKING_PROGRAM_ID
  );

  const nestEditionInfo = await Edition.getPDA(nestMint);
  let woodPeckers = await getNestedData(userAddress, nestMint);
  if (woodPeckers === null) return;
  let remainingAccounts = [];

  for (let i = 0; i < woodPeckers.length; i++) {
    console.log(PublicKey.default.toBase58());
    if (woodPeckers[i].toBase58() === PublicKey.default.toBase58()) {
      continue;
    }
    let userWoodAccount = await getAssociatedTokenAccount(
      userAddress,
      woodPeckers[i]
    );
    if (!(await isExistAccount(userWoodAccount, connection))) {
      let accountOfNFT = await getNFTTokenAccount(woodPeckers[i], connection);
      if (userWoodAccount.toBase58() != accountOfNFT.toBase58()) {
        let nftOwner = await getOwnerOfNFT(woodPeckers[i], connection);
        if (nftOwner.toBase58() == userAddress.toBase58())
          userWoodAccount = accountOfNFT;
        else if (nftOwner.toBase58() !== globalAuthority.toBase58()) {
          throw "Error: Nft is not owned by user";
        }
      }
    }
    console.log(
      "WoodPeckers NFT = ",
      woodPeckers[i].toBase58(),
      userWoodAccount.toBase58()
    );

    let woodEditionId = await Edition.getPDA(woodPeckers[i]);

    remainingAccounts.push({
      pubkey: woodPeckers[i],
      isSigner: false,
      isWritable: false,
    });
    remainingAccounts.push({
      pubkey: userWoodAccount,
      isSigner: false,
      isWritable: true,
    });
    remainingAccounts.push({
      pubkey: woodEditionId,
      isSigner: false,
      isWritable: false,
    });
    console.log("+++++++++++++++++++++++");
  }

  let tx = new Transaction();

  if (ret.instructions.length > 0) ret.instructions.map((ix) => tx.add(ix));
  console.log("==> withdrawing", nestMint.toBase58());

  tx.add(
    program.instruction.withdrawNestNftFromPool(bump, {
      accounts: {
        owner: userAddress,
        globalAuthority,
        userDualPool: userPoolKey,
        userNestAccount,
        rewardVault,
        userRewardAccount: ret.destinationAccounts[0],
        nestMint,
        nestEditionInfo,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenMetadataProgram: METAPLEX,
      },
      remainingAccounts,
      instructions: [],
      signers: [],
    })
  );

  return tx;
};

export const createWithdrawRansackNftTx = async (
  nestMint: PublicKey,
  userAddress: PublicKey,
  program: anchor.Program,
  connection: Connection
) => {
  const [globalAuthority, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    STAKING_PROGRAM_ID
  );

  let userNestAccount = await getAssociatedTokenAccount(userAddress, nestMint);
  if (!(await isExistAccount(userNestAccount, connection))) {
    let accountOfNFT = await getNFTTokenAccount(nestMint, connection);
    if (userNestAccount.toBase58() != accountOfNFT.toBase58()) {
      let nftOwner = await getOwnerOfNFT(nestMint, connection);
      if (nftOwner.toBase58() == userAddress.toBase58())
        userNestAccount = accountOfNFT;
      else if (nftOwner.toBase58() !== globalAuthority.toBase58()) {
        throw "Error: Nft is not owned by user";
      }
    }
  }

  let ret = await getATokenAccountsNeedCreate(
    connection,
    userAddress,
    userAddress,
    [BLAZE_TOKEN_MINT]
  );

  let rewardVault = await getAssociatedTokenAccount(
    globalAuthority,
    BLAZE_TOKEN_MINT
  );

  let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
    userAddress,
    "user-ransack-pool-1",
    STAKING_PROGRAM_ID
  );

  const nestEditionInfo = await Edition.getPDA(nestMint);
  let woodPeckers = await getRansackData(userAddress, nestMint);
  let detail = await getRansackedDetail(userAddress, nestMint);

  let remainingAccounts = [];
  if (woodPeckers === null) return;
  for (let i = 0; i < woodPeckers.length; i++) {
    console.log(PublicKey.default.toBase58());
    if (woodPeckers[i].toBase58() === PublicKey.default.toBase58()) {
      continue;
    }
    console.log("hdhd");
    let userWoodAccount = await getAssociatedTokenAccount(
      userAddress,
      woodPeckers[i]
    );
    if (!(await isExistAccount(userWoodAccount, connection))) {
      let accountOfNFT = await getNFTTokenAccount(woodPeckers[i], connection);
      if (userWoodAccount.toBase58() != accountOfNFT.toBase58()) {
        let nftOwner = await getOwnerOfNFT(woodPeckers[i], connection);
        if (nftOwner.toBase58() == userAddress.toBase58())
          userWoodAccount = accountOfNFT;
        else if (nftOwner.toBase58() !== globalAuthority.toBase58()) {
          throw "Error: Nft is not owned by user";
        }
      }
    }
    console.log(
      "WoodPeckers NFT = ",
      woodPeckers[i].toBase58(),
      userWoodAccount.toBase58()
    );

    let woodEditionId = await Edition.getPDA(woodPeckers[i]);

    remainingAccounts.push({
      pubkey: woodPeckers[i],
      isSigner: false,
      isWritable: false,
    });
    remainingAccounts.push({
      pubkey: userWoodAccount,
      isSigner: false,
      isWritable: false,
    });
    remainingAccounts.push({
      pubkey: woodEditionId,
      isSigner: false,
      isWritable: false,
    });
  }

  let ret1 = await getATokenAccountsNeedCreate(
    connection,
    userAddress,
    userAddress,
    [BLAZE_TOKEN_MINT]
  );
  let ret2 = await getATokenAccountsNeedCreate(
    connection,
    userAddress,
    globalAuthority,
    [BLAZE_TOKEN_MINT]
  );

  if (detail?.rewardStyle.toNumber() === 2) {
    ret1 = await getATokenAccountsNeedCreate(
      connection,
      userAddress,
      userAddress,
      [WOOD_TOKEN_MINT]
    );
    ret2 = await getATokenAccountsNeedCreate(
      connection,
      userAddress,
      globalAuthority,
      [WOOD_TOKEN_MINT]
    );
  }

  let tx = new Transaction();

  if (ret.instructions.length > 0) ret.instructions.map((ix) => tx.add(ix));
  if (ret1.instructions.length > 0)
    ret1.instructions.map(
      (
        ix:
          | anchor.web3.TransactionInstruction
          | anchor.web3.TransactionInstructionCtorFields
          | anchor.web3.Transaction
      ) => tx.add(ix)
    );
  if (ret2.instructions.length > 0)
    ret2.instructions.map(
      (
        ix:
          | anchor.web3.TransactionInstruction
          | anchor.web3.TransactionInstructionCtorFields
          | anchor.web3.Transaction
      ) => tx.add(ix)
    );

  console.log("==> withdrawing", nestMint.toBase58());

  tx.add(
    program.instruction.withdrawRansackNftFromPool(bump, {
      accounts: {
        owner: userAddress,
        globalAuthority,
        userDualPool: userPoolKey,
        userNestAccount,
        rewardVault,
        userRewardAccount: ret.destinationAccounts[0],
        ransackRewardVault: ret2.destinationAccounts[0],
        userRansackRewardAccount: ret1.destinationAccounts[0],
        nestMint,
        nestEditionInfo,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenMetadataProgram: METAPLEX,
      },
      remainingAccounts,
      instructions: [],
      signers: [],
    })
  );

  return tx;
};

export const createClaimTx = async (
  userAddress: PublicKey,
  program: anchor.Program,
  connection: Connection,
  mint?: PublicKey
) => {
  const [globalAuthority, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    STAKING_PROGRAM_ID
  );
  let rewardVault = await getAssociatedTokenAccount(
    globalAuthority,
    BLAZE_TOKEN_MINT
  );

  let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
    userAddress,
    "user-pool",
    STAKING_PROGRAM_ID
  );

  let ret = await getATokenAccountsNeedCreate(
    connection,
    userAddress,
    userAddress,
    [BLAZE_TOKEN_MINT]
  );

  let tx = new Transaction();

  if (ret.instructions.length > 0) ret.instructions.map((ix) => tx.add(ix));
  tx.add(
    program.instruction.claimReward(bump, mint ?? null, {
      accounts: {
        owner: userAddress,
        globalAuthority,
        userPool: userPoolKey,
        rewardVault,
        userRewardAccount: ret.destinationAccounts[0],
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      instructions: [],
      signers: [],
    })
  );

  return tx;
};

export const createNestClaimTx = async (
  userAddress: PublicKey,
  program: anchor.Program,
  connection: Connection,
  nestMint?: PublicKey
) => {
  const [globalAuthority, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    STAKING_PROGRAM_ID
  );
  let rewardVault = await getAssociatedTokenAccount(
    globalAuthority,
    BLAZE_TOKEN_MINT
  );

  let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
    userAddress,
    "user-nest-pool",
    STAKING_PROGRAM_ID
  );

  let ret = await getATokenAccountsNeedCreate(
    connection,
    userAddress,
    userAddress,
    [BLAZE_TOKEN_MINT]
  );

  let tx = new Transaction();

  if (ret.instructions.length > 0) ret.instructions.map((ix) => tx.add(ix));
  tx.add(
    program.instruction.claimNestReward(bump, nestMint ?? null, {
      accounts: {
        owner: userAddress,
        globalAuthority,
        userDualPool: userPoolKey,
        rewardVault,
        userRewardAccount: ret.destinationAccounts[0],
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      instructions: [],
      signers: [],
    })
  );

  return tx;
};

export const createRansackClaimTx = async (
  userAddress: PublicKey,
  program: anchor.Program,
  nestMint: PublicKey
) => {
  let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
    userAddress,
    "user-ransack-pool-1",
    STAKING_PROGRAM_ID
  );

  let tx = new Transaction();

  tx.add(
    program.instruction.claimRansack({
      accounts: {
        owner: userAddress,
        userDualPool: userPoolKey,
        nestMint,
      },
      instructions: [],
      signers: [],
    })
  );

  return tx;
};

export const createWithdrawTx = async (
  userAddress: PublicKey,
  amount: number,
  program: anchor.Program,
  connection: Connection
) => {
  const [globalAuthority, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    STAKING_PROGRAM_ID
  );
  let rewardVault = await getAssociatedTokenAccount(
    globalAuthority,
    BLAZE_TOKEN_MINT
  );

  let ret = await getATokenAccountsNeedCreate(
    connection,
    userAddress,
    userAddress,
    [BLAZE_TOKEN_MINT]
  );

  let tx = new Transaction();

  if (ret.instructions.length > 0) ret.instructions.map((ix) => tx.add(ix));
  tx.add(
    program.instruction.withdrawToken(
      bump,
      new anchor.BN(amount * BLAZE_TOKEN_DECIMAL),
      {
        accounts: {
          owner: userAddress,
          globalAuthority,
          rewardVault,
          userRewardAccount: ret.destinationAccounts[0],
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        instructions: [],
        signers: [],
      }
    )
  );

  return tx;
};

export const getUserPoolInfo = async (userAddress: PublicKey) => {
  const cloneWindow: any = window;
  const provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    StakingIDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );
  const userInfo: UserPool | null = await getUserPoolState(userAddress);
  if (userInfo === null) return;
  return {
    owner: userInfo.owner.toBase58(),
    stakedCount: userInfo.stakedCount.toNumber(),
    accumulatedReward: userInfo.accumulatedReward.toNumber(),
    staking: userInfo.staking.map((info) => {
      return {
        mint: info.mint.toBase58(),
        stakedTime: info.stakedTime.toNumber(),
        lockTime: info.lockTime.toNumber(),
        claimable: info.claimable.toNumber(),
      };
    }),
  };
};

export const getGlobalInfo = async () => {
  const cloneWindow: any = window;
  const provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    StakingIDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );
  const globalPool: GlobalPool | null = await getGlobalState(program);
  if (globalPool === null) return;
  const result = {
    admin: globalPool.superAdmin.toBase58(),
    totalStakedCount: globalPool.totalStakedCount.toNumber(),
    totalRewardDistributed: globalPool.totalRewardDistributed.toNumber(),
  };

  return result;
};

export const getAllNFTs = async (rpc?: string) => {
  return await getAllStakedNFTs(solConnection, rpc);
};

export const getGlobalState = async (
  program: anchor.Program
): Promise<GlobalPool | null> => {
  const [globalAuthority, _] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    STAKING_PROGRAM_ID
  );
  try {
    let globalState = await program.account.globalPool.fetch(globalAuthority);
    return globalState as unknown as GlobalPool;
  } catch {
    return null;
  }
};

export const getUserPoolState = async (
  userAddress: PublicKey
): Promise<UserPool | null> => {
  const cloneWindow: any = window;
  const provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    StakingIDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );
  let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
    userAddress,
    "user-pool",
    STAKING_PROGRAM_ID
  );
  try {
    let userPoolState = await program.account.userPool.fetch(userPoolKey);
    return userPoolState as unknown as UserPool;
  } catch {
    return null;
  }
};

export const getNestPoolState = async (
  userAddress: PublicKey
): Promise<UserNestPool | null> => {
  const cloneWindow: any = window;
  const provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    StakingIDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );
  let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
    userAddress,
    "user-nest-pool",
    STAKING_PROGRAM_ID
  );
  try {
    let userPoolState = await program.account.userNestPool.fetch(userPoolKey);
    return userPoolState as unknown as UserNestPool;
  } catch {
    return null;
  }
};

export const getRansackPoolState = async (
  userAddress: PublicKey
): Promise<UserRansackPool | null> => {
  const cloneWindow: any = window;
  const provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    StakingIDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );
  let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
    userAddress,
    "user-ransack-pool-1",
    STAKING_PROGRAM_ID
  );
  console.log(userPoolKey.toBase58());
  try {
    let userPoolState = await program.account.userRansackPool.fetch(
      userPoolKey
    );
    return userPoolState as unknown as UserRansackPool;
  } catch {
    return null;
  }
};

export const getNestedData = async (
  userAddress: PublicKey,
  nest: PublicKey
): Promise<PublicKey[] | null> => {
  const cloneWindow: any = window;
  const provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    StakingIDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );
  let nestState = await getNestPoolState(userAddress);
  if (nestState === null) return null;
  let woodPeckers: any[] = [];
  try {
    for (let i = 0; i < nestState.stakedCount.toNumber(); i++) {
      if (nest.toBase58() === nestState.staking[i].nest.toBase58()) {
        woodPeckers = nestState.staking[i].woodpecker;
      }
    }
    return woodPeckers;
  } catch {
    return null;
  }
};

export const getRansackData = async (
  userAddress: PublicKey,
  nest: PublicKey
): Promise<PublicKey[] | null> => {
  const cloneWindow: any = window;
  const provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    StakingIDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );
  let nestState = await getNestPoolState(userAddress);
  if (nestState === null) return null;
  let woodPeckers: any[] = [];
  try {
    for (let i = 0; i < nestState.stakedCount.toNumber(); i++) {
      if (nest.toBase58() === nestState.staking[i].nest.toBase58()) {
        woodPeckers = nestState.staking[i].woodpecker;
      }
    }
    return woodPeckers;
  } catch {
    return null;
  }
};

export const getRansackedDetail = async (
  userAddress: PublicKey,
  nest: PublicKey
): Promise<RansackedData | null> => {
  const cloneWindow: any = window;
  const provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    StakingIDL as anchor.Idl,
    STAKING_PROGRAM_ID,
    provider
  );
  let nestState = await getNestPoolState(userAddress);
  if (nestState == null) return null;
  let detail: any;
  try {
    for (let i = 0; i < nestState.stakedCount.toNumber(); i++) {
      if (nest.toBase58() === nestState.staking[i].nest.toBase58()) {
        detail = nestState.staking[i];
      }
    }
    return detail;
  } catch {
    return null;
  }
};

export const getAllStakedNFTs = async (
  connection: Connection,
  rpcUrl: string | undefined
) => {
  let solConnection = connection;

  if (rpcUrl) {
    solConnection = new anchor.web3.Connection(rpcUrl, "confirmed");
  }

  let poolAccounts = await solConnection.getProgramAccounts(
    STAKING_PROGRAM_ID,
    {
      filters: [
        {
          dataSize: USER_POOL_SIZE,
        },
      ],
    }
  );

  console.log(`Encounter ${poolAccounts.length} NFT Data Accounts`);

  let result: UserPool[] = [];

  try {
    for (let idx = 0; idx < poolAccounts.length; idx++) {
      let data = poolAccounts[idx].account.data;
      const owner = new PublicKey(data.slice(8, 40));

      let buf = data.slice(40, 48).reverse();
      const stakedCount = new anchor.BN(buf);

      buf = data.slice(48, 56).reverse();
      const accumulatedReward = new anchor.BN(buf);

      let staking: any = [];
      for (let i = 0; i < stakedCount.toNumber(); i++) {
        const mint = new PublicKey(data.slice(i * 56 + 56, i * 56 + 88));

        buf = data.slice(i * 56 + 88, i * 56 + 96).reverse();
        const stakedTime = new anchor.BN(buf);
        buf = data.slice(i * 56 + 96, i * 56 + 104).reverse();
        const lockTime = new anchor.BN(buf);
        buf = data.slice(i * 56 + 104, i * 56 + 112).reverse();
        const claimable = new anchor.BN(buf);

        staking.push({
          mint,
          stakedTime,
          lockTime,
          claimable,
        });
      }

      result.push({
        owner,
        stakedCount,
        accumulatedReward,
        staking,
      });
    }
  } catch (e) {
    console.log(e);
    return {};
  }

  return {
    count: result.length,
    data: result.map((info: UserPool) => {
      return {
        owner: info.owner.toBase58(),
        stakedCount: info.stakedCount.toNumber(),
        accumulatedReward: info.accumulatedReward.toNumber(),
        staking: info.staking.map((info) => {
          return {
            mint: info.mint.toBase58(),
            stakedTime: info.stakedTime.toNumber(),
            lockTime: info.lockTime.toNumber(),
            claimable: info.claimable.toNumber(),
          };
        }),
      };
    }),
  };
};
