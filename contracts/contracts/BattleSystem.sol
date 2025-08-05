// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./SpiritPet.sol";
import "./SpiritToken.sol";

/**
 * @title BattleSystem
 * @dev 灵宠战斗系统 - 支持PVE和PVP战斗
 */
contract BattleSystem is Ownable, ReentrancyGuard {
    
    SpiritPet public spiritPetContract;
    SpiritToken public spiritToken;
    
    // 战斗结果
    enum BattleResult {
        Victory,
        Defeat,
        Draw
    }
    
    // 副本类型
    enum DungeonType {
        MistyForest,    // 迷雾森林
        LavaCave,       // 熔岩洞穴
        IcePalace,      // 冰霜宫殿
        ThunderPeak,    // 雷电峰
        ShadowRealm     // 暗影领域
    }
    
    // 战斗记录
    struct BattleRecord {
        address player;
        uint256[] petIds;
        DungeonType dungeonType;
        BattleResult result;
        uint256 spiritReward;
        uint256 experienceGained;
        uint256 timestamp;
    }
    
    // PVP挑战
    struct PVPChallenge {
        address challenger;
        address defender;
        uint256[] challengerPets;
        uint256[] defenderPets;
        uint256 wager;
        bool isActive;
        bool isCompleted;
        address winner;
        uint256 timestamp;
    }
    
    // 存储战斗记录
    mapping(address => BattleRecord[]) public playerBattleHistory;
    
    // 存储PVP挑战
    mapping(uint256 => PVPChallenge) public pvpChallenges;
    uint256 public challengeCounter;
    
    // 副本奖励配置
    mapping(DungeonType => uint256) public dungeonRewards;
    mapping(DungeonType => uint256) public dungeonExperience;
    
    // PVE战斗费用
    uint256 public battleFee = 100; // 100 SPIRIT
    
    // 事件
    event BattleCompleted(
        address indexed player, 
        DungeonType dungeonType, 
        BattleResult result, 
        uint256 reward
    );
    event PVPChallengeCreated(
        uint256 indexed challengeId, 
        address indexed challenger, 
        address indexed defender
    );
    event PVPBattleCompleted(
        uint256 indexed challengeId, 
        address indexed winner, 
        uint256 prize
    );

    constructor(address _spiritPetContract, address _spiritToken) {
        spiritPetContract = SpiritPet(_spiritPetContract);
        spiritToken = SpiritToken(_spiritToken);
        
        // 设置副本奖励
        dungeonRewards[DungeonType.MistyForest] = 50;
        dungeonRewards[DungeonType.LavaCave] = 75;
        dungeonRewards[DungeonType.IcePalace] = 100;
        dungeonRewards[DungeonType.ThunderPeak] = 125;
        dungeonRewards[DungeonType.ShadowRealm] = 150;
        
        // 设置经验奖励
        dungeonExperience[DungeonType.MistyForest] = 20;
        dungeonExperience[DungeonType.LavaCave] = 30;
        dungeonExperience[DungeonType.IcePalace] = 40;
        dungeonExperience[DungeonType.ThunderPeak] = 50;
        dungeonExperience[DungeonType.ShadowRealm] = 60;
    }

    /**
     * @dev PVE战斗 - 挑战副本
     */
    function battleDungeon(uint256[] memory petIds, DungeonType dungeonType) 
        external 
        nonReentrant 
    {
        require(petIds.length > 0 && petIds.length <= 3, "Invalid team size");
        require(spiritToken.balanceOf(msg.sender) >= battleFee, "Insufficient SPIRIT tokens");
        
        // 验证灵宠所有权和状态
        for (uint256 i = 0; i < petIds.length; i++) {
            require(spiritPetContract.ownerOf(petIds[i]) == msg.sender, "Not pet owner");
            SpiritPet.SpiritPetData memory petData = spiritPetContract.getPetData(petIds[i]);
            require(petData.attributes.isAlive, "Pet not alive");
        }
        
        // 扣除战斗费用
        spiritToken.burn(msg.sender, battleFee);
        
        // 计算战斗结果
        BattleResult result = _calculatePVEResult(petIds, dungeonType);
        
        uint256 spiritReward = 0;
        uint256 expGained = 0;
        
        if (result == BattleResult.Victory) {
            spiritReward = dungeonRewards[dungeonType];
            expGained = dungeonExperience[dungeonType];
            
            // 给予奖励
            spiritToken.mint(msg.sender, spiritReward);
            
            // 为每只参战灵宠增加经验
            for (uint256 i = 0; i < petIds.length; i++) {
                spiritPetContract.levelUpPet(petIds[i], expGained);
            }
        }
        
        // 记录战斗
        playerBattleHistory[msg.sender].push(BattleRecord({
            player: msg.sender,
            petIds: petIds,
            dungeonType: dungeonType,
            result: result,
            spiritReward: spiritReward,
            experienceGained: expGained,
            timestamp: block.timestamp
        }));
        
        emit BattleCompleted(msg.sender, dungeonType, result, spiritReward);
    }

    /**
     * @dev 创建PVP挑战
     */
    function createPVPChallenge(
        address defender, 
        uint256[] memory challengerPets, 
        uint256 wager
    ) external nonReentrant {
        require(defender != msg.sender, "Cannot challenge yourself");
        require(challengerPets.length > 0 && challengerPets.length <= 3, "Invalid team size");
        require(spiritToken.balanceOf(msg.sender) >= wager, "Insufficient wager");
        
        // 验证挑战者灵宠
        for (uint256 i = 0; i < challengerPets.length; i++) {
            require(spiritPetContract.ownerOf(challengerPets[i]) == msg.sender, "Not pet owner");
        }
        
        // 锁定挑战者的赌注
        spiritToken.burn(msg.sender, wager);
        
        uint256 challengeId = challengeCounter++;
        
        pvpChallenges[challengeId] = PVPChallenge({
            challenger: msg.sender,
            defender: defender,
            challengerPets: challengerPets,
            defenderPets: new uint256[](0),
            wager: wager,
            isActive: true,
            isCompleted: false,
            winner: address(0),
            timestamp: block.timestamp
        });
        
        emit PVPChallengeCreated(challengeId, msg.sender, defender);
    }

    /**
     * @dev 接受PVP挑战
     */
    function acceptPVPChallenge(uint256 challengeId, uint256[] memory defenderPets) 
        external 
        nonReentrant 
    {
        PVPChallenge storage challenge = pvpChallenges[challengeId];
        require(challenge.isActive, "Challenge not active");
        require(challenge.defender == msg.sender, "Not the defender");
        require(defenderPets.length > 0 && defenderPets.length <= 3, "Invalid team size");
        require(spiritToken.balanceOf(msg.sender) >= challenge.wager, "Insufficient wager");
        
        // 验证防守者灵宠
        for (uint256 i = 0; i < defenderPets.length; i++) {
            require(spiritPetContract.ownerOf(defenderPets[i]) == msg.sender, "Not pet owner");
        }
        
        // 锁定防守者的赌注
        spiritToken.burn(msg.sender, challenge.wager);
        
        // 设置防守者队伍
        challenge.defenderPets = defenderPets;
        
        // 计算战斗结果
        address winner = _calculatePVPResult(challenge.challengerPets, challenge.defenderPets);
        
        // 分配奖励
        uint256 totalPrize = challenge.wager * 2;
        spiritToken.mint(winner, totalPrize);
        
        // 更新挑战状态
        challenge.isActive = false;
        challenge.isCompleted = true;
        challenge.winner = winner;
        
        emit PVPBattleCompleted(challengeId, winner, totalPrize);
    }

    /**
     * @dev 计算PVE战斗结果
     */
    function _calculatePVEResult(uint256[] memory petIds, DungeonType dungeonType) 
        internal 
        view 
        returns (BattleResult) 
    {
        uint256 totalPower = 0;
        
        for (uint256 i = 0; i < petIds.length; i++) {
            SpiritPet.SpiritPetData memory petData = spiritPetContract.getPetData(petIds[i]);
            
            // 计算综合战力
            uint256 petPower = (
                petData.attributes.strength + 
                petData.attributes.agility + 
                petData.attributes.intelligence + 
                petData.attributes.stamina + 
                petData.attributes.elementAffinity + 
                petData.attributes.luck
            ) * petData.attributes.level;
            
            // 特殊基因加成
            if (petData.genes.wings == 99) petPower += 1000; // 星辰翅膀
            if (petData.genes.special1 == 99) petPower += 800; // 雷电爪
            if (petData.genes.pattern == 99) petPower += 600; // 火焰鬃毛
            
            totalPower += petPower;
        }
        
        // 副本难度阈值
        uint256 difficultyThreshold = 1000;
        if (dungeonType == DungeonType.LavaCave) difficultyThreshold = 1500;
        else if (dungeonType == DungeonType.IcePalace) difficultyThreshold = 2000;
        else if (dungeonType == DungeonType.ThunderPeak) difficultyThreshold = 2500;
        else if (dungeonType == DungeonType.ShadowRealm) difficultyThreshold = 3000;
        
        // 添加随机因素
        uint256 randomFactor = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 200;
        totalPower += randomFactor;
        
        if (totalPower >= difficultyThreshold * 120 / 100) {
            return BattleResult.Victory;
        } else if (totalPower >= difficultyThreshold * 80 / 100) {
            return BattleResult.Draw;
        } else {
            return BattleResult.Defeat;
        }
    }

    /**
     * @dev 计算PVP战斗结果
     */
    function _calculatePVPResult(uint256[] memory team1, uint256[] memory team2) 
        internal 
        view 
        returns (address winner) 
    {
        uint256 power1 = _calculateTeamPower(team1);
        uint256 power2 = _calculateTeamPower(team2);
        
        // 添加随机因素 (±10%)
        uint256 random1 = uint256(keccak256(abi.encodePacked(block.timestamp, team1[0]))) % 20;
        uint256 random2 = uint256(keccak256(abi.encodePacked(block.difficulty, team2[0]))) % 20;
        
        power1 = power1 * (90 + random1) / 100;
        power2 = power2 * (90 + random2) / 100;
        
        PVPChallenge storage challenge = pvpChallenges[challengeCounter - 1];
        return power1 > power2 ? challenge.challenger : challenge.defender;
    }

    /**
     * @dev 计算团队战力
     */
    function _calculateTeamPower(uint256[] memory petIds) internal view returns (uint256) {
        uint256 totalPower = 0;
        
        for (uint256 i = 0; i < petIds.length; i++) {
            SpiritPet.SpiritPetData memory petData = spiritPetContract.getPetData(petIds[i]);
            
            uint256 petPower = (
                petData.attributes.strength + 
                petData.attributes.agility + 
                petData.attributes.intelligence + 
                petData.attributes.stamina + 
                petData.attributes.elementAffinity + 
                petData.attributes.luck
            ) * petData.attributes.level;
            
            // 特殊基因加成
            if (petData.genes.wings == 99) petPower += 1000;
            if (petData.genes.special1 == 99) petPower += 800;
            if (petData.genes.pattern == 99) petPower += 600;
            
            totalPower += petPower;
        }
        
        return totalPower;
    }

    /**
     * @dev 获取玩家战斗历史
     */
    function getPlayerBattleHistory(address player) 
        external 
        view 
        returns (BattleRecord[] memory) 
    {
        return playerBattleHistory[player];
    }

    /**
     * @dev 设置战斗费用
     */
    function setBattleFee(uint256 _battleFee) external onlyOwner {
        battleFee = _battleFee;
    }

    /**
     * @dev 设置副本奖励
     */
    function setDungeonReward(DungeonType dungeonType, uint256 reward, uint256 experience) 
        external 
        onlyOwner 
    {
        dungeonRewards[dungeonType] = reward;
        dungeonExperience[dungeonType] = experience;
    }
}