const express = require('express');
const router = express.Router();

// 模拟战斗记录
let battleHistory = [];

// 副本配置
const dungeons = {
  'MistyForest': {
    name: '迷雾森林',
    difficulty: '简单',
    spiritReward: 50,
    experience: 20,
    threshold: 1000
  },
  'LavaCave': {
    name: '熔岩洞穴',
    difficulty: '中等',
    spiritReward: 75,
    experience: 30,
    threshold: 1500
  },
  'IcePalace': {
    name: '冰霜宫殿',
    difficulty: '困难',
    spiritReward: 100,
    experience: 40,
    threshold: 2000
  },
  'ThunderPeak': {
    name: '雷电峰',
    difficulty: '专家',
    spiritReward: 125,
    experience: 50,
    threshold: 2500
  },
  'ShadowRealm': {
    name: '暗影领域',
    difficulty: '传奇',
    spiritReward: 150,
    experience: 60,
    threshold: 3000
  }
};

// PVE战斗
router.post('/pve', (req, res) => {
  try {
    const { player, petIds, dungeonType } = req.body;
    
    if (!player || !petIds || !dungeonType) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数'
      });
    }
    
    const dungeon = dungeons[dungeonType];
    if (!dungeon) {
      return res.status(400).json({
        success: false,
        error: '无效的副本类型'
      });
    }
    
    // 模拟计算战力（实际中应该从区块链获取灵宠数据）
    let totalPower = 0;
    petIds.forEach(petId => {
      // 模拟灵宠战力
      totalPower += Math.floor(Math.random() * 1000) + 500;
    });
    
    // 添加随机因素
    const randomFactor = Math.floor(Math.random() * 200);
    totalPower += randomFactor;
    
    // 判断战斗结果
    let result = 'Defeat';
    if (totalPower >= dungeon.threshold * 1.2) {
      result = 'Victory';
    } else if (totalPower >= dungeon.threshold * 0.8) {
      result = 'Draw';
    }
    
    const battleRecord = {
      id: battleHistory.length + 1,
      player,
      petIds,
      dungeonType,
      result,
      spiritReward: result === 'Victory' ? dungeon.spiritReward : 0,
      experienceGained: result === 'Victory' ? dungeon.experience : Math.floor(dungeon.experience * 0.3),
      timestamp: Date.now(),
      totalPower
    };
    
    battleHistory.push(battleRecord);
    
    res.json({
      success: true,
      battleResult: battleRecord,
      message: result === 'Victory' ? '战斗胜利！' : result === 'Draw' ? '战斗平局！' : '战斗失败！'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取玩家战斗历史
router.get('/history/:player', (req, res) => {
  try {
    const { player } = req.params;
    const { limit = 50 } = req.query;
    
    const playerHistory = battleHistory
      .filter(battle => battle.player.toLowerCase() === player.toLowerCase())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, parseInt(limit));
    
    res.json({
      success: true,
      battles: playerHistory,
      count: playerHistory.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取副本信息
router.get('/dungeons', (req, res) => {
  try {
    res.json({
      success: true,
      dungeons: Object.keys(dungeons).map(key => ({
        type: key,
        ...dungeons[key]
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取战斗统计
router.get('/stats/:player', (req, res) => {
  try {
    const { player } = req.params;
    
    const playerBattles = battleHistory.filter(
      battle => battle.player.toLowerCase() === player.toLowerCase()
    );
    
    const stats = {
      totalBattles: playerBattles.length,
      victories: playerBattles.filter(b => b.result === 'Victory').length,
      defeats: playerBattles.filter(b => b.result === 'Defeat').length,
      draws: playerBattles.filter(b => b.result === 'Draw').length,
      totalSpiritEarned: playerBattles.reduce((sum, b) => sum + b.spiritReward, 0),
      totalExperienceGained: playerBattles.reduce((sum, b) => sum + b.experienceGained, 0),
      avgPower: playerBattles.length > 0 
        ? Math.round(playerBattles.reduce((sum, b) => sum + b.totalPower, 0) / playerBattles.length)
        : 0
    };
    
    stats.winRate = stats.totalBattles > 0 
      ? Math.round((stats.victories / stats.totalBattles) * 100)
      : 0;
    
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

// 获取全球排行榜
router.get('/leaderboard', (req, res) => {
  try {
    const { type = 'victories' } = req.query;
    
    // 统计每个玩家的数据
    const playerStats = {};
    
    battleHistory.forEach(battle => {
      if (!playerStats[battle.player]) {
        playerStats[battle.player] = {
          player: battle.player,
          victories: 0,
          totalBattles: 0,
          totalSpirit: 0,
          maxPower: 0
        };
      }
      
      const stats = playerStats[battle.player];
      stats.totalBattles++;
      stats.totalSpirit += battle.spiritReward;
      stats.maxPower = Math.max(stats.maxPower, battle.totalPower);
      
      if (battle.result === 'Victory') {
        stats.victories++;
      }
    });
    
    // 计算胜率
    Object.values(playerStats).forEach(stats => {
      stats.winRate = stats.totalBattles > 0 
        ? Math.round((stats.victories / stats.totalBattles) * 100)
        : 0;
    });
    
    // 排序
    let sortedPlayers = Object.values(playerStats);
    switch (type) {
      case 'victories':
        sortedPlayers.sort((a, b) => b.victories - a.victories);
        break;
      case 'winRate':
        sortedPlayers.sort((a, b) => b.winRate - a.winRate);
        break;
      case 'spirit':
        sortedPlayers.sort((a, b) => b.totalSpirit - a.totalSpirit);
        break;
      case 'power':
        sortedPlayers.sort((a, b) => b.maxPower - a.maxPower);
        break;
    }
    
    const leaderboard = sortedPlayers.slice(0, 100).map((player, index) => ({
      rank: index + 1,
      ...player
    }));
    
    res.json({
      success: true,
      leaderboard,
      type
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PVP挑战（简化版本）
router.post('/pvp/challenge', (req, res) => {
  try {
    const { challenger, defender, challengerPets, wager } = req.body;
    
    if (!challenger || !defender || !challengerPets) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数'
      });
    }
    
    // 创建PVP挑战
    const challenge = {
      id: Date.now(),
      challenger,
      defender,
      challengerPets,
      wager: wager || 0,
      status: 'pending',
      createdAt: Date.now()
    };
    
    res.json({
      success: true,
      challenge,
      message: '挑战已发出，等待对方接受'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;