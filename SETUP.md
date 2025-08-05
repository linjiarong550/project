# 《灵境宠界》项目设置指南

## 🚀 快速开始

### 1. 安装依赖

```bash
# 安装根目录依赖
npm install

# 安装所有模块依赖
npm run install:all
```

### 2. 环境配置

```bash
# 复制环境变量模板
cp backend/.env.example backend/.env

# 编辑配置文件（可选）
nano backend/.env
```

### 3. 启动本地区块链（开发用）

```bash
# 在新终端中启动Hardhat网络
cd contracts
npx hardhat node
```

### 4. 编译和部署智能合约

```bash
# 编译合约
npm run compile

# 部署到本地网络
npm run deploy:local
```

### 5. 启动应用

```bash
# 启动前后端服务
npm run dev
```

现在可以访问：
- 前端应用：http://localhost:3000
- 后端API：http://localhost:3001

## 📋 详细设置步骤

### 智能合约开发

1. **编译合约**
   ```bash
   cd contracts
   npx hardhat compile
   ```

2. **运行测试**
   ```bash
   cd contracts
   npx hardhat test
   ```

3. **部署到测试网**
   ```bash
   # 配置环境变量中的SEPOLIA_URL和PRIVATE_KEY
   cd contracts
   npx hardhat run scripts/deploy.js --network sepolia
   ```

### 前端开发

1. **安装依赖**
   ```bash
   cd frontend
   npm install
   ```

2. **启动开发服务器**
   ```bash
   cd frontend
   npm start
   ```

3. **构建生产版本**
   ```bash
   cd frontend
   npm run build
   ```

### 后端开发

1. **安装依赖**
   ```bash
   cd backend
   npm install
   ```

2. **启动开发服务器**
   ```bash
   cd backend
   npm run dev
   ```

3. **配置数据库（可选）**
   - 安装MongoDB
   - 在.env中配置MONGODB_URI
   - 服务器会自动连接

## 🔧 开发工具

### MetaMask钱包设置

1. 安装MetaMask浏览器扩展
2. 创建钱包或导入现有钱包
3. 添加本地网络：
   - 网络名称：Hardhat Local
   - RPC URL：http://127.0.0.1:8545
   - 链ID：31337
   - 货币符号：ETH

### 获取测试ETH

**本地开发：**
- Hardhat本地网络会自动提供测试账户和ETH

**测试网：**
- Sepolia测试网：https://sepoliafaucet.com/
- Goerli测试网：https://goerlifaucet.com/

## 🎮 游戏功能测试

### 1. 连接钱包
- 访问 http://localhost:3000
- 点击"连接钱包"按钮
- 在MetaMask中确认连接

### 2. 购买新手盲盒
- 进入"我的灵宠"页面
- 点击"购买新手盲盒"
- 确认交易（0.01 ETH）

### 3. 战斗系统
- 进入"战斗"页面
- 选择PVE模式
- 选择副本挑战

### 4. 地块购买
- 进入"领地"页面
- 选择地块类型
- 确认购买交易

### 5. NFT市场
- 进入"市场"页面
- 浏览可购买的NFT
- 测试购买功能

## 🐛 故障排除

### 常见问题

1. **合约部署失败**
   - 检查本地Hardhat网络是否运行
   - 确认账户有足够的ETH
   - 检查网络配置

2. **前端连接失败**
   - 检查MetaMask是否连接到正确网络
   - 确认合约地址是否正确
   - 查看浏览器控制台错误

3. **后端API错误**
   - 检查端口3001是否被占用
   - 查看后端服务器日志
   - 确认环境变量配置

### 获取帮助

- 查看项目README.md
- 检查GitHub Issues
- 联系开发团队

## 📦 项目结构

```
spirit-realm-pets/
├── contracts/          # 智能合约
│   ├── contracts/      # Solidity合约文件
│   ├── scripts/        # 部署脚本
│   ├── test/          # 合约测试
│   └── hardhat.config.js
├── frontend/           # React前端
│   ├── src/
│   │   ├── components/ # 组件
│   │   ├── pages/     # 页面
│   │   ├── contexts/  # React Context
│   │   └── contracts/ # 合约接口
│   └── package.json
├── backend/            # Node.js后端
│   ├── routes/        # API路由
│   ├── utils/         # 工具函数
│   └── index.js
└── docs/              # 文档
```

## 🚀 生产部署

### 1. 智能合约部署

```bash
# 部署到主网或测试网
cd contracts
npx hardhat run scripts/deploy.js --network mainnet
```

### 2. 前端部署

```bash
# 构建生产版本
cd frontend
npm run build

# 部署到Vercel/Netlify等平台
```

### 3. 后端部署

```bash
# 使用PM2或Docker部署
pm2 start backend/index.js --name spirit-realm-backend
```

## 🔐 安全注意事项

1. **私钥安全**
   - 绝不提交私钥到版本控制
   - 使用环境变量管理敏感信息
   - 在生产环境使用硬件钱包

2. **合约安全**
   - 进行安全审计
   - 使用OpenZeppelin标准库
   - 实施适当的访问控制

3. **前端安全**
   - 验证所有用户输入
   - 使用HTTPS传输
   - 实施CORS策略

## 📈 性能优化

1. **智能合约优化**
   - 使用gas优化技巧
   - 批量操作减少交易次数
   - 合理设计数据结构

2. **前端优化**
   - 代码分割和懒加载
   - 图片压缩和CDN
   - 缓存策略

3. **后端优化**
   - 数据库索引
   - API缓存
   - 负载均衡

Happy coding! 🎮✨