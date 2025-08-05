/**
 * 灵宠生成器 - 处理灵宠的随机生成、基因继承和变异
 */

// 灵宠表情符号池
const PET_EMOJIS = [
  '🐲', '🐺', '🦁', '🐯', '🐱', '🐶', '🐹', '🐻', 
  '🦊', '🐸', '🐰', '🦅', '🦉', '🐢', '🐍', '🦎',
  '🦋', '🐞', '🦂', '🕷️', '🐙', '🦑', '🐳', '🐬'
];

// 基因范围配置
const GENE_RANGES = {
  bodyType: 10,
  skinColor: 20,
  eyeType: 15,
  mouthType: 10,
  ears: 12,
  horns: 8,
  wings: 6,
  tail: 14,
  pattern: 25,
  aura: 5,
  special1: 3,
  special2: 3
};

// 稀有变异基因ID
const MUTATION_GENES = {
  STELLAR_WINGS: 99,
  LIGHTNING_CLAWS: 99,
  FLAME_MANE: 99
};

/**
 * 生成随机属性
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 随机属性值
 */
function randomAttribute(min = 30, max = 99) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 生成随机基因
 * @param {string} geneType - 基因类型
 * @returns {number} 基因值
 */
function randomGene(geneType) {
  return Math.floor(Math.random() * GENE_RANGES[geneType]);
}

/**
 * 属性继承逻辑
 * @param {number} attr1 - 父母属性1
 * @param {number} attr2 - 父母属性2
 * @returns {number} 继承后的属性
 */
function inheritAttribute(attr1, attr2) {
  const avg = (attr1 + attr2) / 2;
  const variance = (Math.random() * 21) - 10; // -10到+10的随机变化
  const result = Math.round(avg + variance);
  return Math.max(1, Math.min(100, result));
}

/**
 * 基因继承逻辑
 * @param {number} gene1 - 父母基因1
 * @param {number} gene2 - 父母基因2
 * @returns {number} 继承后的基因
 */
function inheritGene(gene1, gene2) {
  // 50%概率继承父亲，50%概率继承母亲
  return Math.random() < 0.5 ? gene1 : gene2;
}

/**
 * 检查是否发生变异
 * @param {number} mutationRate - 变异概率（1/rate）
 * @returns {boolean} 是否变异
 */
function checkMutation(mutationRate = 100) {
  return Math.random() < (1 / mutationRate);
}

/**
 * 应用变异基因
 * @param {Object} genes - 基因对象
 * @returns {Object} 应用变异后的基因和变异信息
 */
function applyMutation(genes) {
  const mutations = [];
  const mutatedGenes = { ...genes };
  
  if (checkMutation(100)) { // 1%概率
    const mutationType = Math.floor(Math.random() * 3);
    
    switch (mutationType) {
      case 0:
        mutatedGenes.wings = MUTATION_GENES.STELLAR_WINGS;
        mutations.push('Stellar Wings');
        break;
      case 1:
        mutatedGenes.special1 = MUTATION_GENES.LIGHTNING_CLAWS;
        mutations.push('Lightning Claws');
        break;
      case 2:
        mutatedGenes.pattern = MUTATION_GENES.FLAME_MANE;
        mutations.push('Flame Mane');
        break;
    }
  }
  
  return { genes: mutatedGenes, mutations };
}

/**
 * 计算灵宠战力
 * @param {Object} pet - 灵宠对象
 * @returns {number} 战力值
 */
function calculatePetPower(pet) {
  if (!pet || !pet.attributes) return 0;
  
  const { attributes, genes } = pet;
  
  // 基础战力 = 所有属性之和 × 等级
  let power = (
    attributes.strength +
    attributes.agility +
    attributes.intelligence +
    attributes.stamina +
    attributes.elementAffinity +
    attributes.luck
  ) * attributes.level;
  
  // 变异基因加成
  if (genes) {
    if (genes.wings === MUTATION_GENES.STELLAR_WINGS) power += 1000;
    if (genes.special1 === MUTATION_GENES.LIGHTNING_CLAWS) power += 800;
    if (genes.pattern === MUTATION_GENES.FLAME_MANE) power += 600;
  }
  
  return Math.round(power);
}

/**
 * 生成随机灵宠
 * @param {Object} options - 生成选项
 * @returns {Object} 新生成的灵宠
 */
function generateRandomPet(options = {}) {
  const {
    id,
    owner,
    name = '新手灵宠',
    parent1 = 0,
    parent2 = 0,
    generation = 0
  } = options;
  
  let attributes, genes;
  
  if (parent1 === 0 && parent2 === 0) {
    // 新手盲盒：完全随机生成
    attributes = {
      strength: randomAttribute(30, 99),
      agility: randomAttribute(30, 99),
      intelligence: randomAttribute(30, 99),
      stamina: randomAttribute(30, 99),
      elementAffinity: randomAttribute(30, 99),
      luck: randomAttribute(30, 99),
      level: 1,
      experience: 0,
      generation: 0,
      isAlive: true
    };
    
    genes = {
      bodyType: randomGene('bodyType'),
      skinColor: randomGene('skinColor'),
      eyeType: randomGene('eyeType'),
      mouthType: randomGene('mouthType'),
      ears: randomGene('ears'),
      horns: randomGene('horns'),
      wings: randomGene('wings'),
      tail: randomGene('tail'),
      pattern: randomGene('pattern'),
      aura: randomGene('aura'),
      special1: randomGene('special1'),
      special2: randomGene('special2')
    };
  } else {
    // 繁殖：基因继承
    // 这里需要从实际的父母灵宠数据中获取属性和基因
    // 为了演示，我们使用模拟数据
    const mockParent1 = {
      attributes: {
        strength: 80, agility: 70, intelligence: 60,
        stamina: 85, elementAffinity: 75, luck: 65
      },
      genes: {
        bodyType: 3, skinColor: 8, eyeType: 5, mouthType: 2,
        ears: 7, horns: 4, wings: 2, tail: 6, pattern: 12,
        aura: 3, special1: 1, special2: 0
      }
    };
    
    const mockParent2 = {
      attributes: {
        strength: 75, agility: 85, intelligence: 70,
        stamina: 80, elementAffinity: 65, luck: 70
      },
      genes: {
        bodyType: 5, skinColor: 12, eyeType: 8, mouthType: 4,
        ears: 3, horns: 6, wings: 1, tail: 9, pattern: 8,
        aura: 2, special1: 2, special2: 1
      }
    };
    
    attributes = {
      strength: inheritAttribute(mockParent1.attributes.strength, mockParent2.attributes.strength),
      agility: inheritAttribute(mockParent1.attributes.agility, mockParent2.attributes.agility),
      intelligence: inheritAttribute(mockParent1.attributes.intelligence, mockParent2.attributes.intelligence),
      stamina: inheritAttribute(mockParent1.attributes.stamina, mockParent2.attributes.stamina),
      elementAffinity: inheritAttribute(mockParent1.attributes.elementAffinity, mockParent2.attributes.elementAffinity),
      luck: inheritAttribute(mockParent1.attributes.luck, mockParent2.attributes.luck),
      level: 1,
      experience: 0,
      generation: generation,
      isAlive: true
    };
    
    genes = {
      bodyType: inheritGene(mockParent1.genes.bodyType, mockParent2.genes.bodyType),
      skinColor: inheritGene(mockParent1.genes.skinColor, mockParent2.genes.skinColor),
      eyeType: inheritGene(mockParent1.genes.eyeType, mockParent2.genes.eyeType),
      mouthType: inheritGene(mockParent1.genes.mouthType, mockParent2.genes.mouthType),
      ears: inheritGene(mockParent1.genes.ears, mockParent2.genes.ears),
      horns: inheritGene(mockParent1.genes.horns, mockParent2.genes.horns),
      wings: inheritGene(mockParent1.genes.wings, mockParent2.genes.wings),
      tail: inheritGene(mockParent1.genes.tail, mockParent2.genes.tail),
      pattern: inheritGene(mockParent1.genes.pattern, mockParent2.genes.pattern),
      aura: inheritGene(mockParent1.genes.aura, mockParent2.genes.aura),
      special1: inheritGene(mockParent1.genes.special1, mockParent2.genes.special1),
      special2: inheritGene(mockParent1.genes.special2, mockParent2.genes.special2)
    };
  }
  
  // 检查变异
  const { genes: finalGenes, mutations } = applyMutation(genes);
  
  // 随机选择外观图标
  const appearance = PET_EMOJIS[Math.floor(Math.random() * PET_EMOJIS.length)];
  
  const newPet = {
    id,
    owner,
    name,
    attributes,
    genes: finalGenes,
    appearance,
    birthTime: Date.now(),
    breeder: owner,
    parent1,
    parent2,
    mutations: mutations.length > 0 ? mutations : undefined
  };
  
  return newPet;
}

/**
 * 根据基因生成灵宠外观描述
 * @param {Object} genes - 基因对象
 * @returns {string} 外观描述
 */
function generateAppearanceDescription(genes) {
  const descriptions = [];
  
  // 身体类型
  const bodyTypes = ['纤细', '标准', '强壮', '魁梧', '优雅', '威武', '敏捷', '厚重', '均衡', '独特'];
  descriptions.push(`${bodyTypes[genes.bodyType % bodyTypes.length]}的身型`);
  
  // 皮肤颜色
  const skinColors = [
    '雪白', '银灰', '金黄', '火红', '深蓝', '翠绿', '紫罗兰', '玫瑰粉',
    '琥珀', '青铜', '暗黑', '彩虹', '星空', '月光', '晨曦', '暮光',
    '水晶', '珍珠', '翡翠', '红宝石'
  ];
  descriptions.push(`${skinColors[genes.skinColor % skinColors.length]}色的皮肤`);
  
  // 检查变异基因
  if (genes.wings === MUTATION_GENES.STELLAR_WINGS) {
    descriptions.push('闪烁着星辰光芒的翅膀');
  }
  if (genes.special1 === MUTATION_GENES.LIGHTNING_CLAWS) {
    descriptions.push('雷电环绕的利爪');
  }
  if (genes.pattern === MUTATION_GENES.FLAME_MANE) {
    descriptions.push('燃烧的火焰鬃毛');
  }
  
  return descriptions.join('，');
}

/**
 * 计算灵宠稀有度
 * @param {Object} pet - 灵宠对象
 * @returns {string} 稀有度等级
 */
function calculateRarity(pet) {
  const { attributes, genes, mutations } = pet;
  
  // 有变异基因直接是传奇
  if (mutations && mutations.length > 0) {
    return 'Legendary';
  }
  
  // 计算属性总和
  const totalStats = attributes.strength + attributes.agility + 
                    attributes.intelligence + attributes.stamina + 
                    attributes.elementAffinity + attributes.luck;
  
  if (totalStats >= 500) return 'Legendary';
  if (totalStats >= 450) return 'Epic';
  if (totalStats >= 400) return 'Rare';
  return 'Common';
}

module.exports = {
  generateRandomPet,
  calculatePetPower,
  generateAppearanceDescription,
  calculateRarity,
  inheritAttribute,
  inheritGene,
  checkMutation,
  applyMutation,
  PET_EMOJIS,
  GENE_RANGES,
  MUTATION_GENES
};