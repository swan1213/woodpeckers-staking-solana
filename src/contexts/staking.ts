export type Staking = {
  version: "0.1.0";
  name: "staking";
  instructions: [
    {
      name: "initialize";
      accounts: [
        {
          name: "admin";
          isMut: true;
          isSigner: true;
        },
        {
          name: "globalAuthority";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rewardVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "globalBump";
          type: "u8";
        }
      ];
    },
    {
      name: "initializeUserPool";
      accounts: [
        {
          name: "userPool";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        }
      ];
      args: [];
    },
    {
      name: "initializeUserDualPool";
      accounts: [
        {
          name: "userDualPool";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        }
      ];
      args: [];
    },
    {
      name: "initializeUserRansackPool";
      accounts: [
        {
          name: "userDualPool";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        }
      ];
      args: [];
    },
    {
      name: "stakeNftToPool";
      accounts: [
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "userPool";
          isMut: true;
          isSigner: false;
        },
        {
          name: "globalAuthority";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userNftTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "destTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "nftMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mintMetadata";
          isMut: true;
          isSigner: false;
          docs: ["the mint metadata"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenMetadataProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "globalBump";
          type: "u8";
        },
        {
          name: "lockTime";
          type: "u64";
        }
      ];
    },
    {
      name: "withdrawNftFromPool";
      accounts: [
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "userPool";
          isMut: true;
          isSigner: false;
        },
        {
          name: "globalAuthority";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userNftTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rewardVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userRewardAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "nftMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenMetadataProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "globalBump";
          type: "u8";
        }
      ];
    },
    {
      name: "claimReward";
      accounts: [
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "globalAuthority";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userPool";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rewardVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userRewardAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "globalBump";
          type: "u8";
        },
        {
          name: "mint";
          type: {
            option: "publicKey";
          };
        }
      ];
    },
    {
      name: "nestToPool";
      accounts: [
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "userDualPool";
          isMut: true;
          isSigner: false;
        },
        {
          name: "globalAuthority";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userNestAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "nestMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "userTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "destTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "nestEditionInfo";
          isMut: true;
          isSigner: false;
        },
        {
          name: "nestMetadata";
          isMut: true;
          isSigner: false;
          docs: ["the mint metadata"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenMetadataProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "globalBump";
          type: "u8";
        },
        {
          name: "tier";
          type: "u8";
        },
        {
          name: "lockTime";
          type: "u64";
        }
      ];
    },
    {
      name: "withdrawNestNftFromPool";
      accounts: [
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "userDualPool";
          isMut: true;
          isSigner: false;
        },
        {
          name: "globalAuthority";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userNestAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rewardVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userRewardAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "nestMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "nestEditionInfo";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenMetadataProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "globalBump";
          type: "u8";
        }
      ];
    },
    {
      name: "claimNestReward";
      accounts: [
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "globalAuthority";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userDualPool";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rewardVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userRewardAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "globalBump";
          type: "u8";
        },
        {
          name: "nestMint";
          type: {
            option: "publicKey";
          };
        }
      ];
    },
    {
      name: "ransackToPool";
      accounts: [
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "userDualPool";
          isMut: true;
          isSigner: false;
        },
        {
          name: "globalAuthority";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userNestAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "nestMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "userTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "destTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "nestEditionInfo";
          isMut: true;
          isSigner: false;
        },
        {
          name: "nestMetadata";
          isMut: true;
          isSigner: false;
          docs: ["the mint metadata"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenMetadataProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "globalBump";
          type: "u8";
        },
        {
          name: "tier";
          type: "u8";
        },
        {
          name: "style";
          type: "u64";
        },
        {
          name: "lockTime";
          type: "u64";
        }
      ];
    },
    {
      name: "claimRansack";
      accounts: [
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "userDualPool";
          isMut: true;
          isSigner: false;
        },
        {
          name: "nestMint";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "withdrawRansackNftFromPool";
      accounts: [
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "userDualPool";
          isMut: true;
          isSigner: false;
        },
        {
          name: "globalAuthority";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userNestAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rewardVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userRewardAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "ransackRewardVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userRansackRewardAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "nestMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "nestEditionInfo";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenMetadataProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "globalBump";
          type: "u8";
        }
      ];
    },
    {
      name: "withdrawToken";
      accounts: [
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "globalAuthority";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rewardVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userRewardAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "bump";
          type: "u8";
        },
        {
          name: "amount";
          type: "u64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "globalPool";
      type: {
        kind: "struct";
        fields: [
          {
            name: "superAdmin";
            type: "publicKey";
          },
          {
            name: "totalStakedCount";
            type: "u64";
          },
          {
            name: "totalRewardDistributed";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "userPool";
      type: {
        kind: "struct";
        fields: [
          {
            name: "owner";
            type: "publicKey";
          },
          {
            name: "stakedCount";
            type: "u64";
          },
          {
            name: "accumulatedReward";
            type: "u64";
          },
          {
            name: "staking";
            type: {
              array: [
                {
                  defined: "StakedData";
                },
                100
              ];
            };
          }
        ];
      };
    },
    {
      name: "userNestPool";
      type: {
        kind: "struct";
        fields: [
          {
            name: "owner";
            type: "publicKey";
          },
          {
            name: "stakedCount";
            type: "u64";
          },
          {
            name: "accumulatedReward";
            type: "u64";
          },
          {
            name: "staking";
            type: {
              array: [
                {
                  defined: "NestedData";
                },
                100
              ];
            };
          }
        ];
      };
    },
    {
      name: "userRansackPool";
      type: {
        kind: "struct";
        fields: [
          {
            name: "owner";
            type: "publicKey";
          },
          {
            name: "stakedCount";
            type: "u64";
          },
          {
            name: "accumulatedReward";
            type: "u64";
          },
          {
            name: "staking";
            type: {
              array: [
                {
                  defined: "RansackedData";
                },
                100
              ];
            };
          }
        ];
      };
    }
  ];
  types: [
    {
      name: "StakedData";
      docs: ["User PDA Layout"];
      type: {
        kind: "struct";
        fields: [
          {
            name: "mint";
            type: "publicKey";
          },
          {
            name: "stakedTime";
            type: "i64";
          },
          {
            name: "lockTime";
            type: "i64";
          },
          {
            name: "claimable";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "NestedData";
      docs: ["User PDA Layout"];
      type: {
        kind: "struct";
        fields: [
          {
            name: "nest";
            type: "publicKey";
          },
          {
            name: "woodpecker";
            type: {
              array: ["publicKey", 8];
            };
          },
          {
            name: "stakedTime";
            type: "i64";
          },
          {
            name: "lockTime";
            type: "i64";
          },
          {
            name: "claimable";
            type: "u64";
          },
          {
            name: "emission";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "RansackedData";
      docs: ["User PDA Layout"];
      type: {
        kind: "struct";
        fields: [
          {
            name: "nest";
            type: "publicKey";
          },
          {
            name: "woodpecker";
            type: {
              array: ["publicKey", 8];
            };
          },
          {
            name: "stakedTime";
            type: "i64";
          },
          {
            name: "lockTime";
            type: "i64";
          },
          {
            name: "claimable";
            type: "u64";
          },
          {
            name: "emission";
            type: "u64";
          },
          {
            name: "style";
            type: "u64";
          },
          {
            name: "rewardStyle";
            type: "u64";
          },
          {
            name: "rewardAmount";
            type: "u64";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "InvalidSuperOwner";
      msg: "Invalid Super Owner";
    },
    {
      code: 6001;
      name: "InvalidGlobalPool";
      msg: "Invalid Global Pool Address";
    },
    {
      code: 6002;
      name: "InvalidUserPool";
      msg: "Invalid User Pool Owner Address";
    },
    {
      code: 6003;
      name: "InvalidWithdrawTime";
      msg: "Invalid Withdraw Time";
    },
    {
      code: 6004;
      name: "InvalidNFTAddress";
      msg: "Not Found Staked Mint";
    },
    {
      code: 6005;
      name: "InsufficientRewardVault";
      msg: "Insufficient Reward Token Balance";
    },
    {
      code: 6006;
      name: "InsufficientTokenAmount";
      msg: "Insufficient Token Balance";
    },
    {
      code: 6007;
      name: "InvaliedMetadata";
      msg: "Invalid Metadata Address";
    },
    {
      code: 6008;
      name: "MetadataCreatorParseError";
      msg: "Can't Parse The NFT's Creators";
    },
    {
      code: 6009;
      name: "UnkownOrNotAllowedNFTCollection";
      msg: "Unknown Collection Or The Collection Is Not Allowed";
    }
  ];
};

export const IDL: Staking = {
  version: "0.1.0",
  name: "staking",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "admin",
          isMut: true,
          isSigner: true,
        },
        {
          name: "globalAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rewardVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "globalBump",
          type: "u8",
        },
      ],
    },
    {
      name: "initializeUserPool",
      accounts: [
        {
          name: "userPool",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
      ],
      args: [],
    },
    {
      name: "initializeUserDualPool",
      accounts: [
        {
          name: "userDualPool",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
      ],
      args: [],
    },
    {
      name: "initializeUserRansackPool",
      accounts: [
        {
          name: "userDualPool",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
      ],
      args: [],
    },
    {
      name: "stakeNftToPool",
      accounts: [
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "userPool",
          isMut: true,
          isSigner: false,
        },
        {
          name: "globalAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userNftTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "destTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "nftMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mintMetadata",
          isMut: true,
          isSigner: false,
          docs: ["the mint metadata"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenMetadataProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "globalBump",
          type: "u8",
        },
        {
          name: "lockTime",
          type: "u64",
        },
      ],
    },
    {
      name: "withdrawNftFromPool",
      accounts: [
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "userPool",
          isMut: true,
          isSigner: false,
        },
        {
          name: "globalAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userNftTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rewardVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userRewardAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "nftMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenMetadataProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "globalBump",
          type: "u8",
        },
      ],
    },
    {
      name: "claimReward",
      accounts: [
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "globalAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userPool",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rewardVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userRewardAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "globalBump",
          type: "u8",
        },
        {
          name: "mint",
          type: {
            option: "publicKey",
          },
        },
      ],
    },
    {
      name: "nestToPool",
      accounts: [
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "userDualPool",
          isMut: true,
          isSigner: false,
        },
        {
          name: "globalAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userNestAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "nestMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "userTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "destTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "nestEditionInfo",
          isMut: true,
          isSigner: false,
        },
        {
          name: "nestMetadata",
          isMut: true,
          isSigner: false,
          docs: ["the mint metadata"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenMetadataProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "globalBump",
          type: "u8",
        },
        {
          name: "tier",
          type: "u8",
        },
        {
          name: "lockTime",
          type: "u64",
        },
      ],
    },
    {
      name: "withdrawNestNftFromPool",
      accounts: [
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "userDualPool",
          isMut: true,
          isSigner: false,
        },
        {
          name: "globalAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userNestAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rewardVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userRewardAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "nestMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "nestEditionInfo",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenMetadataProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "globalBump",
          type: "u8",
        },
      ],
    },
    {
      name: "claimNestReward",
      accounts: [
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "globalAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userDualPool",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rewardVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userRewardAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "globalBump",
          type: "u8",
        },
        {
          name: "nestMint",
          type: {
            option: "publicKey",
          },
        },
      ],
    },
    {
      name: "ransackToPool",
      accounts: [
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "userDualPool",
          isMut: true,
          isSigner: false,
        },
        {
          name: "globalAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userNestAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "nestMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "userTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "destTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "nestEditionInfo",
          isMut: true,
          isSigner: false,
        },
        {
          name: "nestMetadata",
          isMut: true,
          isSigner: false,
          docs: ["the mint metadata"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenMetadataProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "globalBump",
          type: "u8",
        },
        {
          name: "tier",
          type: "u8",
        },
        {
          name: "style",
          type: "u64",
        },
        {
          name: "lockTime",
          type: "u64",
        },
      ],
    },
    {
      name: "claimRansack",
      accounts: [
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "userDualPool",
          isMut: true,
          isSigner: false,
        },
        {
          name: "nestMint",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "withdrawRansackNftFromPool",
      accounts: [
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "userDualPool",
          isMut: true,
          isSigner: false,
        },
        {
          name: "globalAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userNestAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rewardVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userRewardAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "ransackRewardVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userRansackRewardAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "nestMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "nestEditionInfo",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenMetadataProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "globalBump",
          type: "u8",
        },
      ],
    },
    {
      name: "withdrawToken",
      accounts: [
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "globalAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rewardVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userRewardAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "bump",
          type: "u8",
        },
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "globalPool",
      type: {
        kind: "struct",
        fields: [
          {
            name: "superAdmin",
            type: "publicKey",
          },
          {
            name: "totalStakedCount",
            type: "u64",
          },
          {
            name: "totalRewardDistributed",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "userPool",
      type: {
        kind: "struct",
        fields: [
          {
            name: "owner",
            type: "publicKey",
          },
          {
            name: "stakedCount",
            type: "u64",
          },
          {
            name: "accumulatedReward",
            type: "u64",
          },
          {
            name: "staking",
            type: {
              array: [
                {
                  defined: "StakedData",
                },
                100,
              ],
            },
          },
        ],
      },
    },
    {
      name: "userNestPool",
      type: {
        kind: "struct",
        fields: [
          {
            name: "owner",
            type: "publicKey",
          },
          {
            name: "stakedCount",
            type: "u64",
          },
          {
            name: "accumulatedReward",
            type: "u64",
          },
          {
            name: "staking",
            type: {
              array: [
                {
                  defined: "NestedData",
                },
                100,
              ],
            },
          },
        ],
      },
    },
    {
      name: "userRansackPool",
      type: {
        kind: "struct",
        fields: [
          {
            name: "owner",
            type: "publicKey",
          },
          {
            name: "stakedCount",
            type: "u64",
          },
          {
            name: "accumulatedReward",
            type: "u64",
          },
          {
            name: "staking",
            type: {
              array: [
                {
                  defined: "RansackedData",
                },
                100,
              ],
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "StakedData",
      docs: ["User PDA Layout"],
      type: {
        kind: "struct",
        fields: [
          {
            name: "mint",
            type: "publicKey",
          },
          {
            name: "stakedTime",
            type: "i64",
          },
          {
            name: "lockTime",
            type: "i64",
          },
          {
            name: "claimable",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "NestedData",
      docs: ["User PDA Layout"],
      type: {
        kind: "struct",
        fields: [
          {
            name: "nest",
            type: "publicKey",
          },
          {
            name: "woodpecker",
            type: {
              array: ["publicKey", 8],
            },
          },
          {
            name: "stakedTime",
            type: "i64",
          },
          {
            name: "lockTime",
            type: "i64",
          },
          {
            name: "claimable",
            type: "u64",
          },
          {
            name: "emission",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "RansackedData",
      docs: ["User PDA Layout"],
      type: {
        kind: "struct",
        fields: [
          {
            name: "nest",
            type: "publicKey",
          },
          {
            name: "woodpecker",
            type: {
              array: ["publicKey", 8],
            },
          },
          {
            name: "stakedTime",
            type: "i64",
          },
          {
            name: "lockTime",
            type: "i64",
          },
          {
            name: "claimable",
            type: "u64",
          },
          {
            name: "emission",
            type: "u64",
          },
          {
            name: "style",
            type: "u64",
          },
          {
            name: "rewardStyle",
            type: "u64",
          },
          {
            name: "rewardAmount",
            type: "u64",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "InvalidSuperOwner",
      msg: "Invalid Super Owner",
    },
    {
      code: 6001,
      name: "InvalidGlobalPool",
      msg: "Invalid Global Pool Address",
    },
    {
      code: 6002,
      name: "InvalidUserPool",
      msg: "Invalid User Pool Owner Address",
    },
    {
      code: 6003,
      name: "InvalidWithdrawTime",
      msg: "Invalid Withdraw Time",
    },
    {
      code: 6004,
      name: "InvalidNFTAddress",
      msg: "Not Found Staked Mint",
    },
    {
      code: 6005,
      name: "InsufficientRewardVault",
      msg: "Insufficient Reward Token Balance",
    },
    {
      code: 6006,
      name: "InsufficientTokenAmount",
      msg: "Insufficient Token Balance",
    },
    {
      code: 6007,
      name: "InvaliedMetadata",
      msg: "Invalid Metadata Address",
    },
    {
      code: 6008,
      name: "MetadataCreatorParseError",
      msg: "Can't Parse The NFT's Creators",
    },
    {
      code: 6009,
      name: "UnkownOrNotAllowedNFTCollection",
      msg: "Unknown Collection Or The Collection Is Not Allowed",
    },
  ],
};
