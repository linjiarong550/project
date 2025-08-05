const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// 载入环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/pets', require('./routes/pets'));
app.use('/api/lands', require('./routes/lands'));
app.use('/api/battles', require('./routes/battles'));
app.use('/api/market', require('./routes/market'));
app.use('/api/metadata', require('./routes/metadata'));

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Spirit Realm Pets Backend'
  });
});

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: '欢迎来到灵境宠界后端服务',
    version: '1.0.0',
    endpoints: {
      pets: '/api/pets',
      lands: '/api/lands',
      battles: '/api/battles',
      market: '/api/market',
      metadata: '/api/metadata'
    }
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err.stack);
  res.status(500).json({
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : '请稍后重试'
  });
});

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({
    error: '路径不存在',
    path: req.originalUrl
  });
});

// 连接数据库（如果配置了MongoDB）
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ 已连接到MongoDB数据库');
  })
  .catch((error) => {
    console.error('❌ MongoDB连接失败:', error);
  });
} else {
  console.log('📝 未配置MongoDB，使用内存存储模式');
}

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 灵境宠界后端服务已启动`);
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ 启动时间: ${new Date().toLocaleString('zh-CN')}`);
});

module.exports = app;