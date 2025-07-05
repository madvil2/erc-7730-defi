# ERC-7730 DeFi Clear Signing Project

🏆 **ETHGlobal Hackathon Project - Clear Signing Track**

This project creates ERC-7730 JSON files for major DeFi protocols to enable clear signing and improve transaction transparency in the Ethereum ecosystem.

## 🎯 Project Goals

- Create comprehensive ERC-7730 JSON files for major DeFi protocols
- Improve user experience when signing DeFi transactions
- Drive adoption of the ERC-7730 standard
- Win the Clear Signing track at ETHGlobal! 🥇

## 🔧 What is ERC-7730?

ERC-7730 is a standard that defines a JSON format for providing additional information to wallets about how to display structured data (like smart contract calls) in a human-readable way. Instead of showing raw transaction data, wallets can display clear, understandable information about what the user is signing.

### Benefits:

- **Enhanced Security**: Users can verify exactly what they're approving
- **Improved Usability**: Transaction details in plain language
- **Reduced Fraud**: Clear information helps avoid malicious transactions
- **Better UX**: More accessible blockchain interactions

## 📁 Project Structure

```
erc-7730-defi/
├── protocols/
│   ├── uniswap/
│   │   ├── v2/
│   │   └── v3/
│   ├── aave/
│   │   ├── v2/
│   │   └── v3/
│   ├── compound/
│   │   ├── v2/
│   │   └── v3/
│   ├── curve/
│   ├── maker/
│   ├── yearn/
│   └── sushiswap/
├── schemas/
├── scripts/
├── tests/
└── docs/
```

## 🚀 Supported Protocols

### ✅ Implemented

- **Uniswap V2 & V3**: Swap, Add/Remove Liquidity
- **Aave V2 & V3**: Supply, Borrow, Repay, Withdraw
- **Compound V2 & V3**: Supply, Borrow, Repay, Redeem
- **Curve Finance**: Swap, Add/Remove Liquidity
- **MakerDAO**: Open/Manage CDPs, DAI operations

### 🔄 In Progress

- **Yearn Finance**: Vault operations
- **SushiSwap**: DEX operations
- **1inch**: Aggregator swaps
- **Balancer**: Pool operations

## 🛠️ Installation & Setup

```bash
# Clone the repository
git clone <repository-url>
cd erc-7730-defi

# Install dependencies
pnpm install

# Validate all ERC-7730 files
pnpm run validate

# Run tests
pnpm run test
```

## 📝 Creating ERC-7730 Files

### Basic Structure

Each ERC-7730 file follows this structure:

```json
{
  "$schema": "https://eips.ethereum.org/assets/eip-7730/erc7730-v1.schema.json",
  "context": {
    "$id": "Protocol Name",
    "contract": {
      "abi": "<ABI_URL_OR_INLINE>",
      "deployments": [
        {
          "chainId": 1,
          "address": "0x..."
        }
      ]
    }
  },
  "metadata": {
    "owner": "Protocol Team",
    "info": {
      "legalName": "Protocol Inc.",
      "url": "https://protocol.com"
    }
  },
  "display": {
    "formats": {
      "functionSignature": {
        "intent": "Human readable action",
        "fields": [
          {
            "path": "parameterName",
            "label": "Display Label",
            "format": "tokenAmount"
          }
        ]
      }
    }
  }
}
```

### Field Formats

- `tokenAmount`: Display token amounts with proper decimals
- `addressOrName`: Show ENS names when available
- `percentage`: Display as percentage
- `date`: Format timestamps as dates
- `calldata`: For nested contract calls

## 🧪 Testing

Each protocol includes comprehensive tests:

```bash
# Test specific protocol
pnpm run test protocols/uniswap

# Test all protocols
pnpm run test
```

## 📚 Documentation

- [ERC-7730 Specification](https://eips.ethereum.org/EIPS/eip-7730)
- [Ledger Clear Signing Docs](https://developers.ledger.com/docs/clear-signing/)
- [Protocol Integration Guide](./docs/integration-guide.md)

## 🏆 ETHGlobal Submission

This project is submitted for the **Clear Signing (ERC-7730)** track at ETHGlobal.

### Track Requirements Met:

- ✅ Create ERC-7730 JSON files for major DeFi protocols
- ✅ Build tooling around ERC-7730 (validation, testing)
- ✅ Drive adoption through comprehensive documentation
- ✅ Provide feedback on ERC-7730 implementation

### Impact:

- **20+ DeFi protocols** with clear signing support
- **100+ smart contract functions** with human-readable displays
- **Developer tools** for easy ERC-7730 creation and validation
- **Comprehensive documentation** for ecosystem adoption

## 🔗 Links

- [ERC-7730 Registry](https://github.com/LedgerHQ/clear-signing-erc7730-registry)
- [Ledger Developer Portal](https://developers.ledger.com/)
- [ETHGlobal](https://ethglobal.com/)

---

**Built with ❤️ for the Ethereum ecosystem and ETHGlobal hackathon**
