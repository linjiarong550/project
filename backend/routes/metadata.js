const express = require('express');
const router = express.Router();
const { generateAppearanceDescription, calculateRarity } = require('../utils/petGenerator');

// 获取灵宠NFT元数据
router.get('/pets/:tokenId', (req, res) => {
  try {
    const { tokenId } = req.params;
    
    // 这里应该从区块链或数据库获取实际的灵宠数据
    // 为了演示，我们返回模拟的元数据
    const mockPetData = {
      id: parseInt(tokenId),
      name: `灵宠 #${tokenId}`,
      description: '来自灵境宠界的独特NFT灵宠',
      image: `https://api.spiritreampets.com/images/pets/${tokenId}.png`,
      external_url: `https://spiritreampets.com/pets/${tokenId}`,
      attributes: [
        {
          trait_type: 'Strength',
          value: 85,
          max_value: 100
        },
        {
          trait_type: 'Agility', 
          value: 70,
          max_value: 100
        },
        {
          trait_type: 'Intelligence',
          value: 60,
          max_value: 100
        },
        {
          trait_type: 'Stamina',
          value: 90,
          max_value: 100
        },
        {
          trait_type: 'Element Affinity',
          value: 95,
          max_value: 100
        },
        {
          trait_type: 'Luck',
          value: 75,
          max_value: 100
        },
        {
          trait_type: 'Level',
          value: 5
        },
        {
          trait_type: 'Generation',
          value: 0
        },
        {
          trait_type: 'Rarity',
          value: 'Rare'
        },
        {
          trait_type: 'Body Type',
          value: 'Strong'
        },
        {
          trait_type: 'Skin Color',
          value: 'Fire Red'
        },
        {
          trait_type: 'Eye Type',
          value: 'Fierce'
        }
      ],
      background_color: '667eea'
    };
    
    res.json(mockPetData);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch pet metadata',
      message: error.message
    });
  }
});

// 获取地块NFT元数据
router.get('/lands/:tokenId', (req, res) => {
  try {
    const { tokenId } = req.params;
    
    const mockLandData = {
      id: parseInt(tokenId),
      name: `灵境地块 #${tokenId}`,
      description: '灵境宠界中的NFT地块，可用于建造和收获资源',
      image: `https://api.spiritreampets.com/images/lands/${tokenId}.png`,
      external_url: `https://spiritreampets.com/lands/${tokenId}`,
      attributes: [
        {
          trait_type: 'Land Type',
          value: 'Basic'
        },
        {
          trait_type: 'Level',
          value: 'Village'
        },
        {
          trait_type: 'Building',
          value: 'Hospital'
        },
        {
          trait_type: 'Production Rate',
          value: 15,
          display_type: 'number',
          trait_suffix: ' SPIRIT/hour'
        },
        {
          trait_type: 'Size',
          value: '100x100'
        },
        {
          trait_type: 'Location',
          value: `Coordinates (${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)})`
        }
      ],
      background_color: '2ecc71'
    };
    
    res.json(mockLandData);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch land metadata',
      message: error.message
    });
  }
});

// 获取合约元数据
router.get('/contract', (req, res) => {
  try {
    const contractMetadata = {
      name: 'Spirit Realm Pets',
      description: '灵境宠界是一款结合NFT宠物养成与元宇宙建造的区块链游戏',
      image: 'https://api.spiritreampets.com/images/collection.png',
      external_link: 'https://spiritreampets.com',
      seller_fee_basis_points: 250, // 2.5%
      fee_recipient: '0x1234567890123456789012345678901234567890'
    };
    
    res.json(contractMetadata);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch contract metadata',
      message: error.message
    });
  }
});

// 生成灵宠图像（简单的SVG生成器）
router.get('/images/pets/:tokenId', (req, res) => {
  try {
    const { tokenId } = req.params;
    
    // 根据tokenId生成确定性的颜色和特征
    const seed = parseInt(tokenId);
    const hue = (seed * 137.508) % 360; // 黄金角度分布
    const saturation = 50 + (seed % 50);
    const lightness = 40 + (seed % 30);
    
    const svg = `
      <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bodyGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:hsl(${hue}, ${saturation}%, ${lightness + 20}%)" />
            <stop offset="100%" style="stop-color:hsl(${hue}, ${saturation}%, ${lightness}%)" />
          </radialGradient>
        </defs>
        
        <!-- 背景 -->
        <rect width="300" height="300" fill="linear-gradient(45deg, #667eea, #764ba2)" />
        
        <!-- 身体 -->
        <circle cx="150" cy="180" r="80" fill="url(#bodyGradient)" stroke="#333" stroke-width="2"/>
        
        <!-- 头部 -->
        <circle cx="150" cy="120" r="50" fill="url(#bodyGradient)" stroke="#333" stroke-width="2"/>
        
        <!-- 眼睛 -->
        <circle cx="135" cy="110" r="8" fill="white"/>
        <circle cx="165" cy="110" r="8" fill="white"/>
        <circle cx="135" cy="110" r="4" fill="black"/>
        <circle cx="165" cy="110" r="4" fill="black"/>
        
        <!-- 嘴巴 -->
        <path d="M 140 130 Q 150 140 160 130" stroke="#333" stroke-width="2" fill="none"/>
        
        <!-- 四肢 -->
        <circle cx="120" cy="220" r="15" fill="url(#bodyGradient)" stroke="#333" stroke-width="2"/>
        <circle cx="180" cy="220" r="15" fill="url(#bodyGradient)" stroke="#333" stroke-width="2"/>
        <circle cx="110" cy="160" r="12" fill="url(#bodyGradient)" stroke="#333" stroke-width="2"/>
        <circle cx="190" cy="160" r="12" fill="url(#bodyGradient)" stroke="#333" stroke-width="2"/>
        
        <!-- 灵宠ID -->
        <text x="150" y="280" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="white">
          #${tokenId}
        </text>
      </svg>
    `;
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to generate pet image',
      message: error.message
    });
  }
});

// 生成地块图像
router.get('/images/lands/:tokenId', (req, res) => {
  try {
    const { tokenId } = req.params;
    
    const seed = parseInt(tokenId);
    const grassHue = 100 + (seed % 60); // 绿色系
    
    const svg = `
      <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <!-- 天空背景 -->
        <rect width="300" height="150" fill="linear-gradient(to bottom, #87CEEB, #98FB98)"/>
        
        <!-- 地面 -->
        <rect y="150" width="300" height="150" fill="hsl(${grassHue}, 60%, 40%)"/>
        
        <!-- 网格 -->
        <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="300" height="300" fill="url(#grid)"/>
        
        <!-- 建筑物 -->
        <rect x="120" y="120" width="60" height="60" fill="#8B4513"/>
        <polygon points="120,120 150,100 180,120" fill="#DC143C"/>
        
        <!-- 树木 -->
        <circle cx="80" cy="180" r="20" fill="#228B22"/>
        <rect x="75" y="180" width="10" height="30" fill="#8B4513"/>
        
        <circle cx="220" cy="190" r="15" fill="#228B22"/>
        <rect x="217" y="190" width="6" height="20" fill="#8B4513"/>
        
        <!-- 地块ID -->
        <text x="150" y="280" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="white" stroke="black" stroke-width="1">
          Land #${tokenId}
        </text>
      </svg>
    `;
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to generate land image',
      message: error.message
    });
  }
});

// 批量获取元数据
router.post('/batch', (req, res) => {
  try {
    const { tokenIds, type } = req.body; // type: 'pets' or 'lands'
    
    if (!tokenIds || !Array.isArray(tokenIds)) {
      return res.status(400).json({
        error: 'Invalid tokenIds array'
      });
    }
    
    const metadata = tokenIds.map(tokenId => {
      if (type === 'pets') {
        return {
          id: tokenId,
          name: `灵宠 #${tokenId}`,
          image: `https://api.spiritreampets.com/images/pets/${tokenId}.png`,
          // 简化的属性
          power: Math.floor(Math.random() * 2000) + 1000,
          level: Math.floor(Math.random() * 20) + 1,
          rarity: ['Common', 'Rare', 'Epic', 'Legendary'][Math.floor(Math.random() * 4)]
        };
      } else {
        return {
          id: tokenId,
          name: `地块 #${tokenId}`,
          image: `https://api.spiritreampets.com/images/lands/${tokenId}.png`,
          type: ['Basic', 'Premium', 'Legendary'][Math.floor(Math.random() * 3)],
          level: ['Village', 'Town', 'Castle'][Math.floor(Math.random() * 3)]
        };
      }
    });
    
    res.json({
      success: true,
      metadata
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch batch metadata',
      message: error.message
    });
  }
});

module.exports = router;