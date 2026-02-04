/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/rentby.json`.
 */
export type Rentby = {
  "address": "HmRuwkcYtKaCmx1uXycwCrjVcYBH5o9KGNd6ZF3S6Eq3",
  "metadata": {
    "name": "rentby",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "RentBy - Agent resource marketplace on Solana"
  },
  "instructions": [
    {
      "name": "completeRental",
      "docs": [
        "Complete a rental and release escrow funds to resource owner"
      ],
      "discriminator": [
        179,
        18,
        175,
        28,
        208,
        197,
        89,
        176
      ],
      "accounts": [
        {
          "name": "rental",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  110,
                  116,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "rental.renter",
                "account": "rentalAgreement"
              },
              {
                "kind": "account",
                "path": "rental.resource_mint",
                "account": "rentalAgreement"
              }
            ]
          }
        },
        {
          "name": "escrowTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "rental"
              }
            ]
          }
        },
        {
          "name": "escrowAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "rental"
              }
            ]
          }
        },
        {
          "name": "renter",
          "writable": true,
          "signer": true
        },
        {
          "name": "resourceOwner"
        },
        {
          "name": "resourceAccount",
          "writable": true
        },
        {
          "name": "ownerTokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "createRental",
      "docs": [
        "Create a new rental agreement between a renter and a resource owner",
        "Funds are locked in escrow until task completion"
      ],
      "discriminator": [
        130,
        240,
        153,
        29,
        243,
        149,
        80,
        243
      ],
      "accounts": [
        {
          "name": "rental",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  110,
                  116,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "renter"
              },
              {
                "kind": "account",
                "path": "resourceMint"
              }
            ]
          }
        },
        {
          "name": "escrowTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "rental"
              }
            ]
          }
        },
        {
          "name": "escrowAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "rental"
              }
            ]
          }
        },
        {
          "name": "renter",
          "writable": true,
          "signer": true
        },
        {
          "name": "resourceOwner"
        },
        {
          "name": "resourceMint"
        },
        {
          "name": "renterTokenAccount",
          "writable": true
        },
        {
          "name": "ownerTokenAccount"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "duration",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createResource",
      "docs": [
        "Create a new resource NFT"
      ],
      "discriminator": [
        42,
        4,
        153,
        170,
        163,
        159,
        188,
        194
      ],
      "accounts": [
        {
          "name": "resource",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  115,
                  111,
                  117,
                  114,
                  99,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "mint"
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "resourceType",
          "type": "string"
        },
        {
          "name": "specs",
          "type": "string"
        },
        {
          "name": "hourlyRate",
          "type": "u64"
        }
      ]
    },
    {
      "name": "disputeRental",
      "docs": [
        "Dispute a rental - funds are held pending resolution",
        "Can be escalated to human arbitration"
      ],
      "discriminator": [
        45,
        43,
        209,
        171,
        195,
        100,
        2,
        61
      ],
      "accounts": [
        {
          "name": "rental",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  110,
                  116,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "rental.renter",
                "account": "rentalAgreement"
              },
              {
                "kind": "account",
                "path": "rental.resource_mint",
                "account": "rentalAgreement"
              }
            ]
          }
        },
        {
          "name": "renter",
          "writable": true,
          "signer": true
        },
        {
          "name": "resourceOwner"
        }
      ],
      "args": []
    },
    {
      "name": "resolveDispute",
      "docs": [
        "Resolve a dispute - release funds to renter (refund) or owner (payment)"
      ],
      "discriminator": [
        231,
        6,
        202,
        6,
        96,
        103,
        12,
        230
      ],
      "accounts": [
        {
          "name": "rental",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  110,
                  116,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "rental.renter",
                "account": "rentalAgreement"
              },
              {
                "kind": "account",
                "path": "rental.resource_mint",
                "account": "rentalAgreement"
              }
            ]
          }
        },
        {
          "name": "escrowTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "rental"
              }
            ]
          }
        },
        {
          "name": "escrowAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "rental"
              }
            ]
          }
        },
        {
          "name": "renter",
          "writable": true,
          "signer": true
        },
        {
          "name": "resourceOwner"
        },
        {
          "name": "resourceAccount",
          "writable": true
        },
        {
          "name": "renterTokenAccount",
          "writable": true
        },
        {
          "name": "ownerTokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "refundToRenter",
          "type": "bool"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "rentalAgreement",
      "discriminator": [
        84,
        206,
        204,
        146,
        240,
        218,
        19,
        14
      ]
    },
    {
      "name": "resource",
      "discriminator": [
        10,
        160,
        2,
        1,
        42,
        207,
        51,
        212
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "notActive",
      "msg": "Rental is not active"
    },
    {
      "code": 6001,
      "name": "notDisputed",
      "msg": "Rental is not disputed"
    },
    {
      "code": 6002,
      "name": "unauthorized",
      "msg": "Unauthorized to perform this action"
    }
  ],
  "types": [
    {
      "name": "rentalAgreement",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "renter",
            "type": "pubkey"
          },
          {
            "name": "resourceOwner",
            "type": "pubkey"
          },
          {
            "name": "resourceMint",
            "type": "pubkey"
          },
          {
            "name": "escrowAmount",
            "type": "u64"
          },
          {
            "name": "startTime",
            "type": "i64"
          },
          {
            "name": "duration",
            "type": "i64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "rentalStatus"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "rentalStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "active"
          },
          {
            "name": "completed"
          },
          {
            "name": "disputed"
          },
          {
            "name": "resolved"
          }
        ]
      }
    },
    {
      "name": "resource",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "resourceType",
            "type": "string"
          },
          {
            "name": "specs",
            "type": "string"
          },
          {
            "name": "hourlyRate",
            "type": "u64"
          },
          {
            "name": "reputation",
            "type": "i32"
          },
          {
            "name": "totalRentals",
            "type": "u32"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
