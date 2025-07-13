# Syncron Swap - Decentralized Exchange Platform

<div align="center">
  <img src="public/logo.webp" alt="Syncron Logo" width="120" height="120">
  <h3>The Next Generation DeFi Exchange</h3>
  <p>A modern, user-friendly decentralized exchange built with cutting-edge web technologies</p>
</div>

## 🌟 Overview

Syncron Swap is a comprehensive decentralized finance (DeFi) platform that enables users to swap cryptocurrencies, provide liquidity, and participate in the decentralized economy. Built with React, TypeScript, and Tailwind CSS, it offers a seamless and intuitive trading experience with a beautiful lime green (#ccff00) design theme.

## ✨ Features

### Core Trading Features
- **Token Swapping**: Swap between any ERC-20 tokens with optimal pricing
- **Liquidity Pools**: Provide liquidity and earn fees from trading activities
- **Real-time Pricing**: Live price feeds and market data integration
- **Wallet Integration**: Support for MetaMask, WalletConnect, and other popular wallets
- **Multi-chain Support**: Compatible with Ethereum and other EVM-compatible networks

### Platform Features
- **Responsive Design**: Fully responsive interface that works on all devices
- **Dark Theme**: Modern dark UI with lime green accents for optimal user experience
- **Advanced Analytics**: Detailed trading analytics and portfolio tracking
- **Security First**: Audited smart contracts and secure wallet connections

### Navigation & Pages
- **Trading Interface**: Main swap and pool management interface
- **Explore**: Discover trending tokens and market opportunities
- **DEX Futures**: Advanced futures trading capabilities
- **Governance**: Participate in protocol governance and voting
- **Developer Resources**: APIs, SDKs, and integration guides
- **Help Center**: Comprehensive FAQ and support documentation

## 🛠 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Build Tool**: Next.js 14 with App Router
- **State Management**: React Context and custom hooks
- **Web3 Integration**: Ethers.js for blockchain interactions
- **Icons**: Lucide React for consistent iconography

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/syncron-labs/Syncron-Swap.git
   cd syncron-swap
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_INFURA_KEY=your_infura_key
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Connecting Your Wallet
1. Click "Connect Wallet" in the top navigation
2. Select your preferred wallet provider
3. Approve the connection in your wallet

### Swapping Tokens
1. Navigate to the Swap interface
2. Select the token you want to swap from
3. Choose the token you want to receive
4. Enter the amount and review the transaction
5. Confirm the swap in your wallet

### Providing Liquidity
1. Go to the Pool section
2. Click "Add Liquidity"
3. Select the token pair
4. Enter equal values of both tokens
5. Confirm the transaction to receive LP tokens

## 📁 Project Structure

```
syncron-swap/
├── public/                 # Static assets
│   ├── logo.webp          # Syncron logo
│   └── landing-banner.png  # Hero banner image
├── src/
│   ├── app/                # Next.js app directory
│   │   ├── blog/           # Blog page
│   │   ├── careers/        # Careers page
│   │   ├── contact/        # Contact support
│   │   ├── developers/     # Developer resources
│   │   ├── explore/        # Token exploration
│   │   ├── governance/     # Governance participation
│   │   ├── help-center/    # Help and FAQ
│   │   ├── privacy-policy/ # Privacy policy
│   │   ├── trademark-policy/ # Trademark guidelines
│   │   ├── trade/          # Trading interface
│   │   └── vote/           # Voting interface
│   ├── components/         # Reusable components
│   │   ├── footer/         # Footer navigation
│   │   ├── navbar/         # Main navigation
│   │   └── layouts/        # Layout components
│   ├── section/            # Page sections
│   │   ├── global/         # Global components
│   │   └── landing/        # Landing page sections
│   └── styles/             # Global styles
├── tailwind.config.js      # Tailwind configuration
├── next.config.js          # Next.js configuration
└── package.json            # Dependencies and scripts
```

## 🎨 Design System

### Color Palette
- **Primary**: `#ccff00` (Lime Green) - Main brand color
- **Background**: `#0f172a` (Slate 950) - Dark background
- **Secondary**: `#1e293b` (Slate 800) - Card backgrounds
- **Text**: `#ffffff` (White) - Primary text
- **Muted**: `#64748b` (Slate 500) - Secondary text

### Typography
- **Font Family**: Inter (system font fallback)
- **Headings**: Bold weight with proper hierarchy
- **Body**: Regular weight with good line height

## 🔗 Navigation Structure

### Main Navigation
- **Swap**: Token swapping interface
- **Pool**: Liquidity provision and management
- **DEX Futures**: [External] Advanced futures trading
- **Syncron Exchange**: [External] Beta exchange platform
- **Syncron U.S.**: [External] U.S. specific platform

### Footer Sections
- **App**: Trade, Explore, Pool
- **Company**: Careers, Blog, Brand Assets
- **Protocol**: Vote, Governance
- **Developers**: Developer resources and APIs
- **Need Help?**: Help Center, Contact Us
- **Legal**: Trademark Policy, Privacy Policy

## 🧪 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type checking
npm run type-check
```

### Code Style
- Use TypeScript for all new code
- Follow React best practices and hooks patterns
- Use Tailwind CSS classes for styling
- Maintain consistent component structure
- Add proper type definitions for all props

### Adding New Features
1. Create feature branch from `develop`
2. Implement feature with proper TypeScript types
3. Add responsive design with Tailwind CSS
4. Test functionality across different screen sizes
5. Submit pull request with detailed description

## 🤝 Contributing

We welcome contributions from the community! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and conventions
- Write clear, concise commit messages
- Add tests for new functionality when applicable
- Update documentation for significant changes
- Ensure all CI checks pass before submitting PR

## 📞 Support

### Getting Help
- **Documentation**: Visit our [Help Center](/help-center)
- **Community**: Join our [Discord](https://discord.gg/syncron)
- **Email**: [support@syncron.network](mailto:support@syncron.network)
- **Issues**: [GitHub Issues](https://github.com/syncron-labs/Syncron-Swap/issues)

### Security
If you discover a security vulnerability, please email [security@syncron.network](mailto:security@syncron.network) instead of using the issue tracker.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Web3 integration powered by [Ethers.js](https://ethers.org/)

---

<div align="center">
  <p>Made with ❤️ by the Syncron Labs team</p>
  <p>© 2024 Syncron Labs Inc. All rights reserved.</p>
</div>
