// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title SpiritPet
 * @dev 灵宠NFT合约 - 包含基因系统、繁殖机制和战斗属性
 */
contract SpiritPet is ERC721, ERC721Enumerable, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // 灵宠基础属性结构
    struct PetAttributes {
        uint256 strength;     // 力量 (1-100)
        uint256 agility;      // 敏捷 (1-100)
        uint256 intelligence; // 智慧 (1-100)
        uint256 stamina;      // 耐力 (1-100)
        uint256 elementAffinity; // 元素亲和 (1-100)
        uint256 luck;         // 幸运 (1-100)
        uint256 level;        // 等级 (1-50)
        uint256 experience;   // 经验值
        uint256 generation;   // 世代
        bool isAlive;         // 是否存活
    }

    // 基因系统 - 12个基因片段
    struct Genes {
        uint256 bodyType;     // 身体类型
        uint256 skinColor;    // 皮肤颜色
        uint256 eyeType;      // 眼睛类型
        uint256 mouthType;    // 嘴部类型
        uint256 ears;         // 耳朵
        uint256 horns;        // 角
        uint256 wings;        // 翅膀
        uint256 tail;         // 尾巴
        uint256 pattern;      // 花纹
        uint256 aura;         // 光环
        uint256 special1;     // 特殊基因1
        uint256 special2;     // 特殊基因2
    }

    // 灵宠完整数据
    struct SpiritPetData {
        PetAttributes attributes;
        Genes genes;
        string name;
        uint256 birthTime;
        address breeder;
        uint256 parent1;
        uint256 parent2;
    }

    // 存储所有灵宠数据
    mapping(uint256 => SpiritPetData) public pets;
    
    // 繁殖冷却时间
    mapping(uint256 => uint256) public breedCooldown;
    
    // 新手盲盒价格
    uint256 public starterBoxPrice = 0.01 ether;
    
    // 繁殖费用
    uint256 public breedingFee = 0.005 ether;
    
    // 最大供应量
    uint256 public maxSupply = 100000;
    
    // 稀有基因变异概率 (1%)
    uint256 public mutationRate = 100; // 1/100
    
    // IPFS基础URI
    string private _baseTokenURI;

    // 事件
    event PetMinted(uint256 indexed tokenId, address indexed owner, string name);
    event PetBred(uint256 indexed tokenId, uint256 indexed parent1, uint256 indexed parent2);
    event PetLevelUp(uint256 indexed tokenId, uint256 newLevel);
    event MutationOccurred(uint256 indexed tokenId, string mutationType);

    constructor(string memory baseURI) ERC721("SpiritPet", "SPIRIT") {
        _baseTokenURI = baseURI;
    }

    /**
     * @dev 购买新手盲盒，获得随机灵宠
     */
    function buyStarterBox() external payable nonReentrant {
        require(msg.value >= starterBoxPrice, "Insufficient payment");
        require(totalSupply() < maxSupply, "Max supply reached");
        
        _mintRandomPet(msg.sender, "Starter Pet", 0, 0, 0);
    }

    /**
     * @dev 繁殖两只灵宠
     */
    function breedPets(uint256 parent1Id, uint256 parent2Id, string memory childName) 
        external 
        payable 
        nonReentrant 
    {
        require(msg.value >= breedingFee, "Insufficient breeding fee");
        require(ownerOf(parent1Id) == msg.sender, "Not owner of parent1");
        require(ownerOf(parent2Id) == msg.sender, "Not owner of parent2");
        require(parent1Id != parent2Id, "Cannot breed with itself");
        require(block.timestamp >= breedCooldown[parent1Id], "Parent1 in cooldown");
        require(block.timestamp >= breedCooldown[parent2Id], "Parent2 in cooldown");
        require(pets[parent1Id].attributes.isAlive, "Parent1 not alive");
        require(pets[parent2Id].attributes.isAlive, "Parent2 not alive");
        
        // 设置冷却时间（7天）
        breedCooldown[parent1Id] = block.timestamp + 7 days;
        breedCooldown[parent2Id] = block.timestamp + 7 days;
        
        uint256 newGeneration = _max(pets[parent1Id].attributes.generation, 
                                    pets[parent2Id].attributes.generation) + 1;
        
        _mintRandomPet(msg.sender, childName, parent1Id, parent2Id, newGeneration);
    }

    /**
     * @dev 内部函数：铸造随机灵宠
     */
    function _mintRandomPet(
        address to, 
        string memory name, 
        uint256 parent1, 
        uint256 parent2, 
        uint256 generation
    ) internal {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        
        // 生成随机属性和基因
        PetAttributes memory attributes = _generateRandomAttributes(tokenId, parent1, parent2);
        Genes memory genes = _generateRandomGenes(tokenId, parent1, parent2);
        
        pets[tokenId] = SpiritPetData({
            attributes: attributes,
            genes: genes,
            name: name,
            birthTime: block.timestamp,
            breeder: to,
            parent1: parent1,
            parent2: parent2
        });
        
        emit PetMinted(tokenId, to, name);
        
        // 检查变异
        _checkForMutation(tokenId);
    }

    /**
     * @dev 生成随机属性
     */
    function _generateRandomAttributes(uint256 tokenId, uint256 parent1, uint256 parent2) 
        internal 
        view 
        returns (PetAttributes memory) 
    {
        uint256 seed = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, tokenId)));
        
        if (parent1 == 0 && parent2 == 0) {
            // 新手盲盒：完全随机
            return PetAttributes({
                strength: (seed % 70) + 30,      // 30-99
                agility: ((seed >> 8) % 70) + 30,
                intelligence: ((seed >> 16) % 70) + 30,
                stamina: ((seed >> 24) % 70) + 30,
                elementAffinity: ((seed >> 32) % 70) + 30,
                luck: ((seed >> 40) % 70) + 30,
                level: 1,
                experience: 0,
                generation: 0,
                isAlive: true
            });
        } else {
            // 繁殖：继承父母属性
            PetAttributes memory p1 = pets[parent1].attributes;
            PetAttributes memory p2 = pets[parent2].attributes;
            
            return PetAttributes({
                strength: _inheritAttribute(p1.strength, p2.strength, seed),
                agility: _inheritAttribute(p1.agility, p2.agility, seed >> 8),
                intelligence: _inheritAttribute(p1.intelligence, p2.intelligence, seed >> 16),
                stamina: _inheritAttribute(p1.stamina, p2.stamina, seed >> 24),
                elementAffinity: _inheritAttribute(p1.elementAffinity, p2.elementAffinity, seed >> 32),
                luck: _inheritAttribute(p1.luck, p2.luck, seed >> 40),
                level: 1,
                experience: 0,
                generation: _max(p1.generation, p2.generation) + 1,
                isAlive: true
            });
        }
    }

    /**
     * @dev 生成随机基因
     */
    function _generateRandomGenes(uint256 tokenId, uint256 parent1, uint256 parent2) 
        internal 
        view 
        returns (Genes memory) 
    {
        uint256 seed = uint256(keccak256(abi.encodePacked(block.difficulty, msg.sender, tokenId)));
        
        if (parent1 == 0 && parent2 == 0) {
            // 新手盲盒：完全随机基因
            return Genes({
                bodyType: seed % 10,
                skinColor: (seed >> 4) % 20,
                eyeType: (seed >> 8) % 15,
                mouthType: (seed >> 12) % 10,
                ears: (seed >> 16) % 12,
                horns: (seed >> 20) % 8,
                wings: (seed >> 24) % 6,
                tail: (seed >> 28) % 14,
                pattern: (seed >> 32) % 25,
                aura: (seed >> 36) % 5,
                special1: (seed >> 40) % 3,
                special2: (seed >> 44) % 3
            });
        } else {
            // 繁殖：基因遗传
            Genes memory p1 = pets[parent1].genes;
            Genes memory p2 = pets[parent2].genes;
            
            return Genes({
                bodyType: _inheritGene(p1.bodyType, p2.bodyType, seed),
                skinColor: _inheritGene(p1.skinColor, p2.skinColor, seed >> 4),
                eyeType: _inheritGene(p1.eyeType, p2.eyeType, seed >> 8),
                mouthType: _inheritGene(p1.mouthType, p2.mouthType, seed >> 12),
                ears: _inheritGene(p1.ears, p2.ears, seed >> 16),
                horns: _inheritGene(p1.horns, p2.horns, seed >> 20),
                wings: _inheritGene(p1.wings, p2.wings, seed >> 24),
                tail: _inheritGene(p1.tail, p2.tail, seed >> 28),
                pattern: _inheritGene(p1.pattern, p2.pattern, seed >> 32),
                aura: _inheritGene(p1.aura, p2.aura, seed >> 36),
                special1: _inheritGene(p1.special1, p2.special1, seed >> 40),
                special2: _inheritGene(p1.special2, p2.special2, seed >> 44)
            });
        }
    }

    /**
     * @dev 属性继承逻辑
     */
    function _inheritAttribute(uint256 attr1, uint256 attr2, uint256 seed) 
        internal 
        pure 
        returns (uint256) 
    {
        uint256 avg = (attr1 + attr2) / 2;
        uint256 variance = (seed % 21) - 10; // -10到+10的随机变化
        uint256 result = avg + variance;
        
        if (result < 1) return 1;
        if (result > 100) return 100;
        return result;
    }

    /**
     * @dev 基因继承逻辑
     */
    function _inheritGene(uint256 gene1, uint256 gene2, uint256 seed) 
        internal 
        pure 
        returns (uint256) 
    {
        // 50%概率继承父亲，50%概率继承母亲
        return (seed % 2 == 0) ? gene1 : gene2;
    }

    /**
     * @dev 检查变异
     */
    function _checkForMutation(uint256 tokenId) internal {
        uint256 mutationSeed = uint256(keccak256(abi.encodePacked(block.timestamp, tokenId, "mutation")));
        
        if (mutationSeed % mutationRate == 0) {
            // 1%概率变异
            uint256 mutationType = mutationSeed % 3;
            
            if (mutationType == 0) {
                // 星辰翅膀变异
                pets[tokenId].genes.wings = 99; // 特殊变异ID
                emit MutationOccurred(tokenId, "Stellar Wings");
            } else if (mutationType == 1) {
                // 雷电爪变异
                pets[tokenId].genes.special1 = 99;
                emit MutationOccurred(tokenId, "Lightning Claws");
            } else {
                // 火焰鬃毛变异
                pets[tokenId].genes.pattern = 99;
                emit MutationOccurred(tokenId, "Flame Mane");
            }
        }
    }

    /**
     * @dev 升级灵宠
     */
    function levelUpPet(uint256 tokenId, uint256 experienceGained) external {
        require(_exists(tokenId), "Pet does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not pet owner");
        
        pets[tokenId].attributes.experience += experienceGained;
        
        // 简单的升级公式：每100经验升1级
        uint256 newLevel = 1 + (pets[tokenId].attributes.experience / 100);
        if (newLevel > pets[tokenId].attributes.level && newLevel <= 50) {
            pets[tokenId].attributes.level = newLevel;
            emit PetLevelUp(tokenId, newLevel);
        }
    }

    /**
     * @dev 获取灵宠完整数据
     */
    function getPetData(uint256 tokenId) external view returns (SpiritPetData memory) {
        require(_exists(tokenId), "Pet does not exist");
        return pets[tokenId];
    }

    /**
     * @dev 设置基础URI
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev 提取合约资金
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev 辅助函数
     */
    function _max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a >= b ? a : b;
    }

    // Override functions for ERC721Enumerable
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}