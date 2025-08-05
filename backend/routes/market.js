const express = require('express');
const router = express.Router();

// 模拟市场物品数据
let marketItems = [
  {
    id: 1,
    type: 'pet',
    tokenId: 999,
    name: '星辰翅膀龙',
    description: '拥有稀有星辰翅膀变异基因的传奇灵宠',
    price: '5.2',
    currency: 'ETH',
    seller: '0x9876543210987654321098765432109876543210',
    rarity: 'Legendary',
    attributes: {
      strength: 95,
      agility: 88,
      intelligence: 75,
      stamina: 92,
      elementAffinity: 98,
      luck: 85,
      level: 15,
      generation: 2
    },
    image: '🐲',
    listedAt: Date.now() - 3600000,
    status: 'active'
  },
  {
    id: 2,
    type: 'pet',
    tokenId: 888,
    name: '雷电爪狼',
    description: '具有雷电爪特殊技能的史诗级灵宠',
    price: '2.8',
    currency: 'ETH',
    seller: '0x2345678901234567890123456789012345678901',
    rarity: 'Epic',
    attributes: {
      strength: 82,
      agility: 95,
      intelligence: 68,
      stamina: 88,
      elementAffinity: 75,
      luck: 70,
      level: 12,
      generation: 1
    },
    image: '🐺',
    listedAt: Date.now() - 7200000,
    status: 'active'
  },
  {
    id: 3,
    type: 'land',
    tokenId: 500,
    name: '传奇城堡地块',
    description: '已升级到城堡级别的传奇地块，带稀有祭坛建筑',
    price: '8.5',
    currency: 'ETH',
    seller: '0x3456789012345678901234567890123456789012',
    rarity: 'Legendary',
    attributes: {
      level: 'Castle',
      production: 120,
      building: 'Altar',
      type: 'Legendary'
    },
    image: '🏰',
    listedAt: Date.now() - 1800000,
    status: 'active'
  }
];

// 获取市场物品列表
router.get('/items', (req, res) => {
  try {
    const { 
      type,        // 'all', 'pets', 'lands'
      rarity,      // 'Common', 'Rare', 'Epic', 'Legendary'
      minPrice,
      maxPrice,
      sortBy = 'listedAt',  // 'price', 'listedAt', 'rarity'
      sortOrder = 'desc',   // 'asc', 'desc'
      limit = 50,
      offset = 0
    } = req.query;
    
    let filteredItems = [...marketItems].filter(item => item.status === 'active');
    
    // 类型筛选
    if (type && type !== 'all') {
      if (type === 'pets') filteredItems = filteredItems.filter(item => item.type === 'pet');
      else if (type === 'lands') filteredItems = filteredItems.filter(item => item.type === 'land');
    }
    
    // 稀有度筛选
    if (rarity) {
      filteredItems = filteredItems.filter(item => item.rarity === rarity);
    }
    
    // 价格筛选
    if (minPrice) {
      filteredItems = filteredItems.filter(item => parseFloat(item.price) >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filteredItems = filteredItems.filter(item => parseFloat(item.price) <= parseFloat(maxPrice));
    }
    
    // 排序
    filteredItems.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          aValue = parseFloat(a.price);
          bValue = parseFloat(b.price);
          break;
        case 'listedAt':
          aValue = a.listedAt;
          bValue = b.listedAt;
          break;
        case 'rarity':
          const rarityOrder = { 'Common': 1, 'Rare': 2, 'Epic': 3, 'Legendary': 4 };
          aValue = rarityOrder[a.rarity] || 0;
          bValue = rarityOrder[b.rarity] || 0;
          break;
        default:
          aValue = a.listedAt;
          bValue = b.listedAt;
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
    
    // 分页
    const paginatedItems = filteredItems.slice(
      parseInt(offset), 
      parseInt(offset) + parseInt(limit)
    );
    
    res.json({
      success: true,
      items: paginatedItems,
      total: filteredItems.length,
      filters: {
        type,
        rarity,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder
      },
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: filteredItems.length > (parseInt(offset) + parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取特定物品详情
router.get('/items/:itemId', (req, res) => {
  try {
    const { itemId } = req.params;
    const item = marketItems.find(item => item.id === parseInt(itemId));
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: '物品不存在'
      });
    }
    
    res.json({
      success: true,
      item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 上架物品
router.post('/list', (req, res) => {
  try {
    const {
      seller,
      type,
      tokenId,
      name,
      description,
      price,
      currency = 'ETH',
      rarity,
      attributes,
      image
    } = req.body;
    
    if (!seller || !type || !tokenId || !name || !price) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数'
      });
    }
    
    // 检查是否已上架
    const existingItem = marketItems.find(
      item => item.type === type && item.tokenId === parseInt(tokenId) && item.status === 'active'
    );
    
    if (existingItem) {
      return res.status(400).json({
        success: false,
        error: '该物品已在市场上架'
      });
    }
    
    const newItem = {
      id: marketItems.length + 1,
      type,
      tokenId: parseInt(tokenId),
      name,
      description,
      price,
      currency,
      seller,
      rarity,
      attributes,
      image,
      listedAt: Date.now(),
      status: 'active'
    };
    
    marketItems.push(newItem);
    
    res.json({
      success: true,
      item: newItem,
      message: '物品成功上架'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 购买物品
router.post('/buy/:itemId', (req, res) => {
  try {
    const { itemId } = req.params;
    const { buyer } = req.body;
    
    if (!buyer) {
      return res.status(400).json({
        success: false,
        error: '缺少买家地址'
      });
    }
    
    const itemIndex = marketItems.findIndex(item => item.id === parseInt(itemId));
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '物品不存在'
      });
    }
    
    const item = marketItems[itemIndex];
    if (item.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: '物品不可购买'
      });
    }
    
    if (item.seller.toLowerCase() === buyer.toLowerCase()) {
      return res.status(400).json({
        success: false,
        error: '不能购买自己的物品'
      });
    }
    
    // 更新物品状态
    item.status = 'sold';
    item.buyer = buyer;
    item.soldAt = Date.now();
    marketItems[itemIndex] = item;
    
    res.json({
      success: true,
      transaction: {
        itemId: item.id,
        seller: item.seller,
        buyer,
        price: item.price,
        currency: item.currency,
        timestamp: Date.now()
      },
      message: '购买成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 下架物品
router.post('/delist/:itemId', (req, res) => {
  try {
    const { itemId } = req.params;
    const { seller } = req.body;
    
    const itemIndex = marketItems.findIndex(item => item.id === parseInt(itemId));
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '物品不存在'
      });
    }
    
    const item = marketItems[itemIndex];
    if (item.seller.toLowerCase() !== seller.toLowerCase()) {
      return res.status(403).json({
        success: false,
        error: '只能下架自己的物品'
      });
    }
    
    if (item.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: '物品已下架或已售出'
      });
    }
    
    item.status = 'delisted';
    item.delistedAt = Date.now();
    marketItems[itemIndex] = item;
    
    res.json({
      success: true,
      message: '物品已下架'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取用户的上架物品
router.get('/user/:address/listings', (req, res) => {
  try {
    const { address } = req.params;
    const { status = 'active' } = req.query;
    
    let userItems = marketItems.filter(
      item => item.seller.toLowerCase() === address.toLowerCase()
    );
    
    if (status !== 'all') {
      userItems = userItems.filter(item => item.status === status);
    }
    
    userItems.sort((a, b) => b.listedAt - a.listedAt);
    
    res.json({
      success: true,
      items: userItems,
      count: userItems.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取用户的购买历史
router.get('/user/:address/purchases', (req, res) => {
  try {
    const { address } = req.params;
    
    const purchases = marketItems.filter(
      item => item.buyer && item.buyer.toLowerCase() === address.toLowerCase()
    );
    
    purchases.sort((a, b) => b.soldAt - a.soldAt);
    
    res.json({
      success: true,
      purchases,
      count: purchases.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取市场统计
router.get('/stats', (req, res) => {
  try {
    const activeItems = marketItems.filter(item => item.status === 'active');
    const soldItems = marketItems.filter(item => item.status === 'sold');
    
    const stats = {
      totalListings: activeItems.length,
      totalSold: soldItems.length,
      avgPrice: {
        pets: 0,
        lands: 0,
        all: 0
      },
      volumeETH: 0,
      topSellers: [],
      recentSales: soldItems.slice(-10).reverse()
    };
    
    // 计算平均价格
    const activePets = activeItems.filter(item => item.type === 'pet');
    const activeLands = activeItems.filter(item => item.type === 'land');
    
    if (activePets.length > 0) {
      stats.avgPrice.pets = (activePets.reduce((sum, item) => sum + parseFloat(item.price), 0) / activePets.length).toFixed(3);
    }
    
    if (activeLands.length > 0) {
      stats.avgPrice.lands = (activeLands.reduce((sum, item) => sum + parseFloat(item.price), 0) / activeLands.length).toFixed(3);
    }
    
    if (activeItems.length > 0) {
      stats.avgPrice.all = (activeItems.reduce((sum, item) => sum + parseFloat(item.price), 0) / activeItems.length).toFixed(3);
    }
    
    // 计算交易量
    stats.volumeETH = soldItems.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(3);
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;