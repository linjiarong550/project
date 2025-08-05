# 《灵境宠界》Spirit Realm Pets

融合 Axie Infinity 的 NFT 宠物养成战斗体系与 The Sandbox 的元宇宙建造自由度的区块链游戏。

## 🎮 游戏特色

- **NFT 灵宠系统**: 独特的基因系统，每只灵宠都是独特的ERC-721代币
- **战斗系统**: 回合制策略对战，PVE副本和PVP竞技场
- **领地建设**: 购买地块NFT，自由建造个人领地
- **经济系统**: 双代币模型(SPIRIT/REALM)，完整的NFT交易市场
- **社交系统**: 部落协作，领地参观互动

## 🏗️ 项目结构

```
spirit-realm-pets/
├── contracts/          # 智能合约 (Hardhat)
├── frontend/           # Web前端 (React + Three.js)
├── backend/            # 后端服务 (Node.js + Express)
├── assets/             # 游戏资源
└── docs/               # 项目文档
```

## 🚀 快速开始

### 安装依赖
```bash
npm run install:all
```

### 本地开发
```bash
# 启动本地区块链网络
npx hardhat node

# 部署合约到本地网络
npm run deploy:local

# 启动前后端服务
npm run dev
```

### 游戏访问
打开浏览器访问 `http://localhost:3000`

## 📋 开发进度

### 第一阶段 ✅ (1-2个月)
- [x] 灵宠NFT生成系统
- [x] 基础战斗系统
- [x] 简单地块购买功能
- [x] Web前端界面

### 第二阶段 🔄 (2-3个月)
- [ ] 繁殖系统
- [ ] 领地建造模块
- [ ] NFT交易市场

### 第三阶段 📅 (持续迭代)
- [ ] PVP竞技场
- [ ] 部落系统
- [ ] 自定义模型上传

## 🛠️ 技术栈

- **区块链**: Ethereum, Hardhat, OpenZeppelin
- **前端**: React, Three.js, Web3.js, MetaMask
- **后端**: Node.js, Express, MongoDB
- **存储**: IPFS (元数据和图像)

## 📄 License

MIT License