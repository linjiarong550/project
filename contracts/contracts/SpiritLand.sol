// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title SpiritLand
 * @dev 灵境地块NFT合约 - 支持地块购买、建造和升级
 */
contract SpiritLand is ERC1155, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    // 地块类型
    enum LandType {
        Basic,      // 基础地块
        Premium,    // 优质地块
        Legendary   // 传奇地块
    }
    
    // 建筑类型
    enum BuildingType {
        None,           // 无建筑
        Hospital,       // 灵宠医院
        Forge,          // 锻造坊
        Laboratory,     // 基因实验室
        Arena,          // 竞技场
        Altar,          // 祭坛
        Fountain,       // 喷泉
        Garden,         // 花园
        Tower           // 瞭望塔
    }
    
    // 地块等级
    enum LandLevel {
        Village,    // 村落
        Town,       // 城镇
        Castle      // 城堡
    }
    
    // 地块数据结构
    struct LandData {
        LandType landType;
        LandLevel level;
        BuildingType building;
        uint256 lastHarvest;        // 上次收获时间
        uint256 spiritProduction;  // 灵晶产量/小时
        bool isPublic;              // 是否对外开放
        uint256 visitFee;           // 参观费用
        string name;                // 地块名称
        address owner;
    }
    
    // 存储地块数据
    mapping(uint256 => LandData) public lands;
    
    // 地块价格 (单位: wei)
    mapping(LandType => uint256) public landPrices;
    
    // 建筑建造费用
    mapping(BuildingType => uint256) public buildingCosts;
    
    // 地块总数
    uint256 public constant MAX_LANDS = 10000;
    Counters.Counter private _landIdCounter;
    
    // 灵晶代币接口
    interface ISpiritToken {
        function mint(address to, uint256 amount) external;
        function burn(address from, uint256 amount) external;
        function balanceOf(address account) external view returns (uint256);
    }
    
    ISpiritToken public spiritToken;
    
    // 事件
    event LandPurchased(uint256 indexed landId, address indexed buyer, LandType landType);
    event BuildingConstructed(uint256 indexed landId, BuildingType building);
    event LandUpgraded(uint256 indexed landId, LandLevel newLevel);
    event SpiritHarvested(uint256 indexed landId, uint256 amount);
    event LandVisited(uint256 indexed landId, address indexed visitor, uint256 fee);

    constructor(string memory uri, address _spiritToken) ERC1155(uri) {
        spiritToken = ISpiritToken(_spiritToken);
        
        // 设置地块价格
        landPrices[LandType.Basic] = 0.1 ether;
        landPrices[LandType.Premium] = 0.5 ether;
        landPrices[LandType.Legendary] = 2.0 ether;
        
        // 设置建筑费用 (灵晶)
        buildingCosts[BuildingType.Hospital] = 1000;
        buildingCosts[BuildingType.Forge] = 1500;
        buildingCosts[BuildingType.Laboratory] = 2000;
        buildingCosts[BuildingType.Arena] = 2500;
        buildingCosts[BuildingType.Altar] = 3000;
        buildingCosts[BuildingType.Fountain] = 500;
        buildingCosts[BuildingType.Garden] = 800;
        buildingCosts[BuildingType.Tower] = 1200;
    }

    /**
     * @dev 购买地块
     */
    function purchaseLand(LandType landType, string memory landName) 
        external 
        payable 
        nonReentrant 
    {
        require(_landIdCounter.current() < MAX_LANDS, "All lands sold");
        require(msg.value >= landPrices[landType], "Insufficient payment");
        
        uint256 landId = _landIdCounter.current();
        _landIdCounter.increment();
        
        // 铸造地块NFT
        _mint(msg.sender, landId, 1, "");
        
        // 设置地块数据
        uint256 baseProduction = landType == LandType.Basic ? 10 : 
                                landType == LandType.Premium ? 25 : 50;
                                
        lands[landId] = LandData({
            landType: landType,
            level: LandLevel.Village,
            building: BuildingType.None,
            lastHarvest: block.timestamp,
            spiritProduction: baseProduction,
            isPublic: false,
            visitFee: 0,
            name: landName,
            owner: msg.sender
        });
        
        emit LandPurchased(landId, msg.sender, landType);
    }

    /**
     * @dev 建造建筑
     */
    function constructBuilding(uint256 landId, BuildingType building) 
        external 
        nonReentrant 
    {
        require(balanceOf(msg.sender, landId) > 0, "Not land owner");
        require(lands[landId].building == BuildingType.None, "Building already exists");
        require(building != BuildingType.None, "Invalid building type");
        
        uint256 cost = buildingCosts[building];
        require(spiritToken.balanceOf(msg.sender) >= cost, "Insufficient SPIRIT tokens");
        
        // 扣除建筑费用
        spiritToken.burn(msg.sender, cost);
        
        // 设置建筑
        lands[landId].building = building;
        
        // 根据建筑类型增加产量
        uint256 productionBonus = _getBuildingProductionBonus(building);
        lands[landId].spiritProduction += productionBonus;
        
        emit BuildingConstructed(landId, building);
    }

    /**
     * @dev 升级地块
     */
    function upgradeLand(uint256 landId) external nonReentrant {
        require(balanceOf(msg.sender, landId) > 0, "Not land owner");
        require(lands[landId].level != LandLevel.Castle, "Already max level");
        
        LandLevel currentLevel = lands[landId].level;
        uint256 upgradeCost = currentLevel == LandLevel.Village ? 5000 : 15000;
        
        require(spiritToken.balanceOf(msg.sender) >= upgradeCost, "Insufficient SPIRIT tokens");
        
        // 扣除升级费用
        spiritToken.burn(msg.sender, upgradeCost);
        
        // 升级地块
        if (currentLevel == LandLevel.Village) {
            lands[landId].level = LandLevel.Town;
            lands[landId].spiritProduction = lands[landId].spiritProduction * 150 / 100; // +50%
        } else {
            lands[landId].level = LandLevel.Castle;
            lands[landId].spiritProduction = lands[landId].spiritProduction * 200 / 100; // +100%
        }
        
        emit LandUpgraded(landId, lands[landId].level);
    }

    /**
     * @dev 收获灵晶
     */
    function harvestSpirit(uint256 landId) external nonReentrant {
        require(balanceOf(msg.sender, landId) > 0, "Not land owner");
        
        uint256 timeSinceLastHarvest = block.timestamp - lands[landId].lastHarvest;
        uint256 hoursPassed = timeSinceLastHarvest / 3600; // 转换为小时
        
        if (hoursPassed > 0) {
            uint256 spiritReward = hoursPassed * lands[landId].spiritProduction;
            
            // 最大24小时产量
            if (hoursPassed > 24) {
                spiritReward = 24 * lands[landId].spiritProduction;
            }
            
            // 更新收获时间
            lands[landId].lastHarvest = block.timestamp;
            
            // 铸造灵晶代币
            spiritToken.mint(msg.sender, spiritReward);
            
            emit SpiritHarvested(landId, spiritReward);
        }
    }

    /**
     * @dev 设置地块为公开参观
     */
    function setLandPublic(uint256 landId, bool isPublic, uint256 visitFee) external {
        require(balanceOf(msg.sender, landId) > 0, "Not land owner");
        
        lands[landId].isPublic = isPublic;
        lands[landId].visitFee = visitFee;
    }

    /**
     * @dev 参观他人地块
     */
    function visitLand(uint256 landId) external payable nonReentrant {
        require(lands[landId].isPublic, "Land not public");
        require(msg.value >= lands[landId].visitFee, "Insufficient visit fee");
        require(lands[landId].owner != msg.sender, "Cannot visit own land");
        
        // 转移参观费给地块主人
        if (lands[landId].visitFee > 0) {
            payable(lands[landId].owner).transfer(lands[landId].visitFee);
        }
        
        emit LandVisited(landId, msg.sender, lands[landId].visitFee);
    }

    /**
     * @dev 获取可收获的灵晶数量
     */
    function getPendingSpirit(uint256 landId) external view returns (uint256) {
        uint256 timeSinceLastHarvest = block.timestamp - lands[landId].lastHarvest;
        uint256 hoursPassed = timeSinceLastHarvest / 3600;
        
        if (hoursPassed > 24) {
            hoursPassed = 24; // 最大24小时
        }
        
        return hoursPassed * lands[landId].spiritProduction;
    }

    /**
     * @dev 获取地块完整数据
     */
    function getLandData(uint256 landId) external view returns (LandData memory) {
        return lands[landId];
    }

    /**
     * @dev 获取用户拥有的所有地块
     */
    function getUserLands(address user) external view returns (uint256[] memory) {
        uint256 totalLands = _landIdCounter.current();
        uint256[] memory tempLands = new uint256[](totalLands);
        uint256 count = 0;
        
        for (uint256 i = 0; i < totalLands; i++) {
            if (balanceOf(user, i) > 0) {
                tempLands[count] = i;
                count++;
            }
        }
        
        // 创建正确大小的数组
        uint256[] memory userLands = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            userLands[i] = tempLands[i];
        }
        
        return userLands;
    }

    /**
     * @dev 获取建筑产量加成
     */
    function _getBuildingProductionBonus(BuildingType building) 
        internal 
        pure 
        returns (uint256) 
    {
        if (building == BuildingType.Hospital) return 5;
        if (building == BuildingType.Forge) return 8;
        if (building == BuildingType.Laboratory) return 12;
        if (building == BuildingType.Arena) return 15;
        if (building == BuildingType.Altar) return 20;
        if (building == BuildingType.Fountain) return 3;
        if (building == BuildingType.Garden) return 4;
        if (building == BuildingType.Tower) return 6;
        return 0;
    }

    /**
     * @dev 设置灵晶代币合约地址
     */
    function setSpiritToken(address _spiritToken) external onlyOwner {
        spiritToken = ISpiritToken(_spiritToken);
    }

    /**
     * @dev 设置地块价格
     */
    function setLandPrice(LandType landType, uint256 price) external onlyOwner {
        landPrices[landType] = price;
    }

    /**
     * @dev 设置建筑费用
     */
    function setBuildingCost(BuildingType building, uint256 cost) external onlyOwner {
        buildingCosts[building] = cost;
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
     * @dev 返回当前已售出的地块数量
     */
    function totalLandsSold() external view returns (uint256) {
        return _landIdCounter.current();
    }
}