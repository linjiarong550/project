const express = require('express');
const router = express.Router();

// 模拟地块数据
let lands = [
  {
    id: 1,
    owner: '0x1234567890123456789012345678901234567890',
    name: '我的第一块地',
    type: 'Basic',
    level: 'Village',
    building: 'Hospital',
    production: 15,
    lastHarvest: Date.now() - 3600000,
    isPublic: false,
    visitFee: 0
  }
];

// 获取用户的所有地块
router.get('/user/:address', (req, res) => {
  try {
    const { address } = req.params;
    const userLands = lands.filter(land => 
      land.owner.toLowerCase() === address.toLowerCase()
    );
    
    res.json({
      success: true,
      lands: userLands,
      count: userLands.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取特定地块详情
router.get('/:landId', (req, res) => {
  try {
    const { landId } = req.params;
    const land = lands.find(l => l.id === parseInt(landId));
    
    if (!land) {
      return res.status(404).json({
        success: false,
        error: '地块不存在'
      });
    }
    
    // 计算待收获的灵晶
    const timeSinceLastHarvest = Date.now() - land.lastHarvest;
    const hoursPassed = Math.floor(timeSinceLastHarvest / (1000 * 60 * 60));
    const pendingSpirit = Math.min(hoursPassed * land.production, 24 * land.production);
    
    res.json({
      success: true,
      land: {
        ...land,
        pendingSpirit
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 收获灵晶
router.post('/:landId/harvest', (req, res) => {
  try {
    const { landId } = req.params;
    const { owner } = req.body;
    
    const landIndex = lands.findIndex(l => l.id === parseInt(landId));
    if (landIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '地块不存在'
      });
    }
    
    const land = lands[landIndex];
    if (land.owner !== owner) {
      return res.status(403).json({
        success: false,
        error: '只能收获自己的地块'
      });
    }
    
    const timeSinceLastHarvest = Date.now() - land.lastHarvest;
    const hoursPassed = Math.floor(timeSinceLastHarvest / (1000 * 60 * 60));
    const spiritReward = Math.min(hoursPassed * land.production, 24 * land.production);
    
    if (spiritReward > 0) {
      land.lastHarvest = Date.now();
      lands[landIndex] = land;
    }
    
    res.json({
      success: true,
      spiritReward,
      message: spiritReward > 0 ? `收获了${spiritReward}灵晶` : '暂无可收获的灵晶'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 建造建筑
router.post('/:landId/build', (req, res) => {
  try {
    const { landId } = req.params;
    const { owner, buildingType } = req.body;
    
    const landIndex = lands.findIndex(l => l.id === parseInt(landId));
    if (landIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '地块不存在'
      });
    }
    
    const land = lands[landIndex];
    if (land.owner !== owner) {
      return res.status(403).json({
        success: false,
        error: '只能在自己的地块上建造'
      });
    }
    
    if (land.building !== 'None') {
      return res.status(400).json({
        success: false,
        error: '地块上已有建筑'
      });
    }
    
    // 建筑产量加成
    const productionBonus = {
      'Hospital': 5,
      'Forge': 8,
      'Laboratory': 12,
      'Arena': 15,
      'Altar': 20,
      'Fountain': 3,
      'Garden': 4,
      'Tower': 6
    };
    
    land.building = buildingType;
    land.production += productionBonus[buildingType] || 0;
    lands[landIndex] = land;
    
    res.json({
      success: true,
      land,
      message: `成功建造${buildingType}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 升级地块
router.post('/:landId/upgrade', (req, res) => {
  try {
    const { landId } = req.params;
    const { owner } = req.body;
    
    const landIndex = lands.findIndex(l => l.id === parseInt(landId));
    if (landIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '地块不存在'
      });
    }
    
    const land = lands[landIndex];
    if (land.owner !== owner) {
      return res.status(403).json({
        success: false,
        error: '只能升级自己的地块'
      });
    }
    
    if (land.level === 'Castle') {
      return res.status(400).json({
        success: false,
        error: '地块已达到最高等级'
      });
    }
    
    const oldLevel = land.level;
    if (land.level === 'Village') {
      land.level = 'Town';
      land.production = Math.floor(land.production * 1.5); // +50%
    } else if (land.level === 'Town') {
      land.level = 'Castle';
      land.production = Math.floor(land.production * 2); // +100%
    }
    
    lands[landIndex] = land;
    
    res.json({
      success: true,
      land,
      message: `地块从${oldLevel}升级到${land.level}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 设置地块公开访问
router.post('/:landId/public', (req, res) => {
  try {
    const { landId } = req.params;
    const { owner, isPublic, visitFee } = req.body;
    
    const landIndex = lands.findIndex(l => l.id === parseInt(landId));
    if (landIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '地块不存在'
      });
    }
    
    const land = lands[landIndex];
    if (land.owner !== owner) {
      return res.status(403).json({
        success: false,
        error: '只能设置自己的地块'
      });
    }
    
    land.isPublic = isPublic;
    land.visitFee = visitFee || 0;
    lands[landIndex] = land;
    
    res.json({
      success: true,
      message: isPublic ? '地块已设置为公开' : '地块已设置为私有'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取公开地块列表
router.get('/public/all', (req, res) => {
  try {
    const publicLands = lands.filter(land => land.isPublic);
    
    res.json({
      success: true,
      lands: publicLands
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;