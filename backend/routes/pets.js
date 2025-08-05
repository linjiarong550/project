const express = require('express');
const router = express.Router();
const { generateRandomPet, calculatePetPower } = require('../utils/petGenerator');

// 模拟数据存储（实际项目中应该使用数据库）
let pets = [
  {
    id: 1,
    owner: '0x1234567890123456789012345678901234567890',
    name: '火焰龙',
    attributes: {
      strength: 85,
      agility: 70,
      intelligence: 60,
      stamina: 90,
      elementAffinity: 95,
      luck: 75,
      level: 5,
      experience: 250,
      generation: 0,
      isAlive: true
    },
    genes: {
      bodyType: 3,
      skinColor: 8,
      eyeType: 5,
      mouthType: 2,
      ears: 7,
      horns: 4,
      wings: 2,
      tail: 6,
      pattern: 12,
      aura: 3,
      special1: 1,
      special2: 0
    },
    birthTime: Date.now() - 86400000,
    breeder: '0x1234567890123456789012345678901234567890',
    parent1: 0,
    parent2: 0
  }
];

// 获取用户的所有灵宠
router.get('/user/:address', (req, res) => {
  try {
    const { address } = req.params;
    const userPets = pets.filter(pet => 
      pet.owner.toLowerCase() === address.toLowerCase()
    );
    
    res.json({
      success: true,
      pets: userPets,
      count: userPets.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取特定灵宠详情
router.get('/:petId', (req, res) => {
  try {
    const { petId } = req.params;
    const pet = pets.find(p => p.id === parseInt(petId));
    
    if (!pet) {
      return res.status(404).json({
        success: false,
        error: '灵宠不存在'
      });
    }
    
    // 计算战力
    const power = calculatePetPower(pet);
    
    res.json({
      success: true,
      pet: {
        ...pet,
        power
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 生成新的随机灵宠（购买盲盒）
router.post('/generate', (req, res) => {
  try {
    const { owner, name, parent1, parent2 } = req.body;
    
    if (!owner) {
      return res.status(400).json({
        success: false,
        error: '缺少拥有者地址'
      });
    }
    
    const newPet = generateRandomPet({
      id: pets.length + 1,
      owner,
      name: name || '新手灵宠',
      parent1: parent1 || 0,
      parent2: parent2 || 0
    });
    
    pets.push(newPet);
    
    res.json({
      success: true,
      pet: newPet,
      message: '成功生成新灵宠'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 升级灵宠
router.post('/:petId/levelup', (req, res) => {
  try {
    const { petId } = req.params;
    const { experienceGain } = req.body;
    
    const petIndex = pets.findIndex(p => p.id === parseInt(petId));
    if (petIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '灵宠不存在'
      });
    }
    
    const pet = pets[petIndex];
    pet.attributes.experience += experienceGain || 50;
    
    // 简单的升级逻辑：每100经验升1级
    const newLevel = Math.floor(pet.attributes.experience / 100) + 1;
    const leveledUp = newLevel > pet.attributes.level;
    
    if (leveledUp && newLevel <= 50) {
      pet.attributes.level = newLevel;
    }
    
    pets[petIndex] = pet;
    
    res.json({
      success: true,
      pet,
      leveledUp,
      message: leveledUp ? `恭喜！${pet.name}升级到${newLevel}级` : '获得经验值'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 繁殖灵宠
router.post('/breed', (req, res) => {
  try {
    const { parent1Id, parent2Id, childName, owner } = req.body;
    
    const parent1 = pets.find(p => p.id === parent1Id);
    const parent2 = pets.find(p => p.id === parent2Id);
    
    if (!parent1 || !parent2) {
      return res.status(404).json({
        success: false,
        error: '父母灵宠不存在'
      });
    }
    
    if (parent1.owner !== owner || parent2.owner !== owner) {
      return res.status(403).json({
        success: false,
        error: '只能繁殖自己的灵宠'
      });
    }
    
    const childPet = generateRandomPet({
      id: pets.length + 1,
      owner,
      name: childName || '繁殖后代',
      parent1: parent1Id,
      parent2: parent2Id,
      generation: Math.max(parent1.attributes.generation, parent2.attributes.generation) + 1
    });
    
    pets.push(childPet);
    
    res.json({
      success: true,
      pet: childPet,
      message: '繁殖成功！'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取市场上的灵宠
router.get('/market/all', (req, res) => {
  try {
    // 模拟市场灵宠（实际中应该从数据库查询在售的灵宠）
    const marketPets = [
      {
        id: 999,
        name: '星辰翅膀龙',
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
        genes: {
          wings: 99, // 变异基因
          pattern: 99,
          special1: 99
        },
        price: '5.2',
        currency: 'ETH',
        seller: '0x9876543210987654321098765432109876543210',
        rarity: 'Legendary'
      }
    ];
    
    res.json({
      success: true,
      pets: marketPets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取灵宠排行榜
router.get('/leaderboard/:type', (req, res) => {
  try {
    const { type } = req.params; // 'power', 'level', 'generation'
    
    let sortedPets = [...pets];
    
    switch (type) {
      case 'power':
        sortedPets.sort((a, b) => calculatePetPower(b) - calculatePetPower(a));
        break;
      case 'level':
        sortedPets.sort((a, b) => b.attributes.level - a.attributes.level);
        break;
      case 'generation':
        sortedPets.sort((a, b) => b.attributes.generation - a.attributes.generation);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: '无效的排行榜类型'
        });
    }
    
    const topPets = sortedPets.slice(0, 100).map((pet, index) => ({
      rank: index + 1,
      id: pet.id,
      name: pet.name,
      owner: pet.owner,
      level: pet.attributes.level,
      power: calculatePetPower(pet),
      generation: pet.attributes.generation
    }));
    
    res.json({
      success: true,
      leaderboard: topPets,
      type
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;