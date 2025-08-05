import React, { useState } from 'react';
import styled from 'styled-components';
import { useWeb3 } from '../contexts/Web3Context';

const BattleContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: white;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
`;

const BattleModes = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const ModeCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const ModeIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
`;

const ModeTitle = styled.h3`
  color: white;
  font-size: 1.5rem;
  margin-bottom: 12px;
`;

const ModeDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20px;
  line-height: 1.6;
`;

const ModeButton = styled.button`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const DungeonsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const DungeonCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const DungeonName = styled.h4`
  color: #333;
  margin-bottom: 8px;
  font-size: 1.2rem;
`;

const DungeonInfo = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 16px;
`;

const RewardInfo = styled.div`
  background: rgba(102, 126, 234, 0.1);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  margin-bottom: 12px;

  .label {
    color: #667eea;
    font-weight: 600;
  }
`;

const Battle: React.FC = () => {
  const { account, connectWallet } = useWeb3();
  const [selectedMode, setSelectedMode] = useState<'pve' | 'pvp' | null>(null);
  const [loading, setLoading] = useState(false);

  const dungeons = [
    {
      name: "迷雾森林",
      difficulty: "简单",
      spiritReward: 50,
      experience: 20,
      icon: "🌲",
      description: "新手友好的副本，适合初级灵宠挑战"
    },
    {
      name: "熔岩洞穴",
      difficulty: "中等",
      spiritReward: 75,
      experience: 30,
      icon: "🌋",
      description: "炽热的洞穴，火属性灵宠更有优势"
    },
    {
      name: "冰霜宫殿",
      difficulty: "困难",
      spiritReward: 100,
      experience: 40,
      icon: "🏰",
      description: "冰冷的宫殿，需要强力灵宠才能征服"
    },
    {
      name: "雷电峰",
      difficulty: "专家",
      spiritReward: 125,
      experience: 50,
      icon: "⛰️",
      description: "雷电环绕的山峰，极具挑战性"
    },
    {
      name: "暗影领域",
      difficulty: "传奇",
      spiritReward: 150,
      experience: 60,
      icon: "🌑",
      description: "最终挑战，只有最强的灵宠才能通过"
    }
  ];

  const handleBattleMode = (mode: 'pve' | 'pvp') => {
    if (!account) {
      connectWallet();
      return;
    }
    setSelectedMode(mode);
  };

  const handleDungeonBattle = async (dungeon: any) => {
    setLoading(true);
    try {
      // 这里应该调用智能合约进行战斗
      console.log(`挑战副本: ${dungeon.name}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`挑战${dungeon.name}成功！获得${dungeon.spiritReward}灵晶`);
    } catch (error) {
      console.error('战斗失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <BattleContainer>
        <Header>
          <Title>战斗竞技场</Title>
          <Subtitle>挑战副本，参与PVP，获得丰厚奖励</Subtitle>
        </Header>

        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '16px', 
          padding: '40px', 
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h2 style={{ color: 'white', marginBottom: '16px' }}>连接钱包开始战斗</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '24px' }}>
            请先连接钱包并拥有灵宠才能参与战斗
          </p>
          <button 
            onClick={connectWallet}
            style={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            连接钱包
          </button>
        </div>
      </BattleContainer>
    );
  }

  return (
    <BattleContainer>
      <Header>
        <Title>战斗竞技场</Title>
        <Subtitle>挑战副本，参与PVP，获得丰厚奖励</Subtitle>
      </Header>

      {selectedMode === null && (
        <BattleModes>
          <ModeCard>
            <ModeIcon>🏰</ModeIcon>
            <ModeTitle>PVE 副本</ModeTitle>
            <ModeDescription>
              挑战各种副本，获得灵晶和经验奖励。
              每个副本都有不同的难度和特殊机制。
            </ModeDescription>
            <ModeButton onClick={() => handleBattleMode('pve')}>
              进入副本
            </ModeButton>
          </ModeCard>

          <ModeCard>
            <ModeIcon>⚔️</ModeIcon>
            <ModeTitle>PVP 竞技场</ModeTitle>
            <ModeDescription>
              与其他玩家进行实时对战，争夺排名和奖励。
              胜者获得对手的赌注。
            </ModeDescription>
            <ModeButton onClick={() => handleBattleMode('pvp')}>
              进入竞技场
            </ModeButton>
          </ModeCard>
        </BattleModes>
      )}

      {selectedMode === 'pve' && (
        <>
          <div style={{ marginBottom: '30px', textAlign: 'center' }}>
            <button
              onClick={() => setSelectedMode(null)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              ← 返回选择模式
            </button>
          </div>

          <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '30px' }}>
            选择副本挑战
          </h2>

          <DungeonsGrid>
            {dungeons.map((dungeon, index) => (
              <DungeonCard key={index}>
                <div style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '12px' }}>
                  {dungeon.icon}
                </div>
                <DungeonName>{dungeon.name}</DungeonName>
                <DungeonInfo>
                  难度: {dungeon.difficulty}
                  <br />
                  {dungeon.description}
                </DungeonInfo>
                
                <RewardInfo>
                  <div className="label">奖励</div>
                  <div>{dungeon.spiritReward} 灵晶 • {dungeon.experience} 经验</div>
                </RewardInfo>

                <ModeButton 
                  onClick={() => handleDungeonBattle(dungeon)}
                  disabled={loading}
                  style={{ width: '100%' }}
                >
                  {loading ? '战斗中...' : '开始挑战'}
                </ModeButton>
              </DungeonCard>
            ))}
          </DungeonsGrid>
        </>
      )}

      {selectedMode === 'pvp' && (
        <>
          <div style={{ marginBottom: '30px', textAlign: 'center' }}>
            <button
              onClick={() => setSelectedMode(null)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              ← 返回选择模式
            </button>
          </div>

          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            borderRadius: '16px', 
            padding: '40px', 
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h2 style={{ color: 'white', marginBottom: '16px' }}>PVP 竞技场</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '24px' }}>
              PVP功能正在开发中，敬请期待！
              <br />
              你将能够与其他玩家进行实时对战，赢取丰厚奖励。
            </p>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
              即将推出功能：
              <br />
              • 排位赛系统
              <br />
              • 实时匹配
              <br />
              • 赛季奖励
              <br />
              • 观战模式
            </div>
          </div>
        </>
      )}
    </BattleContainer>
  );
};

export default Battle;