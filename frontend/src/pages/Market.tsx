import React, { useState } from 'react';
import styled from 'styled-components';
import { useWeb3 } from '../contexts/Web3Context';

const MarketContainer = styled.div`
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

const FilterTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 40px;
  flex-wrap: wrap;
`;

const FilterTab = styled.button<{ $active: boolean }>`
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.$active 
    ? 'linear-gradient(45deg, #667eea, #764ba2)' 
    : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  border: 2px solid ${props => props.$active 
    ? 'transparent' 
    : 'rgba(255, 255, 255, 0.3)'};

  &:hover {
    background: ${props => props.$active 
      ? 'linear-gradient(45deg, #667eea, #764ba2)' 
      : 'rgba(255, 255, 255, 0.3)'};
    transform: translateY(-2px);
  }
`;

const MarketGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`;

const MarketCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ItemImage = styled.div`
  width: 100%;
  height: 180px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  margin-bottom: 16px;
  position: relative;
`;

const RarityBadge = styled.div<{ $rarity: string }>`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  background: ${props => {
    switch (props.$rarity) {
      case 'Common': return '#95a5a6';
      case 'Rare': return '#3498db';
      case 'Epic': return '#9b59b6';
      case 'Legendary': return '#f39c12';
      default: return '#95a5a6';
    }
  }};
  color: white;
`;

const ItemInfo = styled.div`
  h4 {
    color: #333;
    margin-bottom: 8px;
    font-size: 1.1rem;
  }

  .description {
    color: #666;
    font-size: 0.85rem;
    margin-bottom: 12px;
  }
`;

const ItemStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-bottom: 16px;
`;

const StatItem = styled.div`
  background: rgba(102, 126, 234, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  text-align: center;

  .label {
    color: #667eea;
    font-weight: 600;
  }

  .value {
    color: #333;
    font-weight: 500;
  }
`;

const PriceSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Price = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;

  .currency {
    font-size: 0.8rem;
    color: #666;
  }
`;

const SellerInfo = styled.div`
  font-size: 0.75rem;
  color: #666;
  text-align: right;
`;

const BuyButton = styled.button`
  width: 100%;
  background: linear-gradient(45deg, #27ae60, #2ecc71);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(39, 174, 96, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.8);

  h3 {
    font-size: 1.5rem;
    margin-bottom: 16px;
    color: white;
  }

  p {
    font-size: 1rem;
    line-height: 1.6;
  }
`;

const Market: React.FC = () => {
  const { account, connectWallet } = useWeb3();
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const filters = [
    { id: 'all', name: '全部' },
    { id: 'pets', name: '灵宠' },
    { id: 'lands', name: '地块' },
    { id: 'equipment', name: '装备' }
  ];

  // 模拟市场数据
  const marketItems = [
    {
      id: 1,
      type: 'pet',
      name: '星辰翅膀龙',
      image: '🐲',
      rarity: 'Legendary',
      price: '5.2',
      currency: 'ETH',
      seller: '0x1234...5678',
      description: '拥有稀有星辰翅膀变异基因的传奇灵宠',
      stats: {
        strength: 95,
        agility: 88,
        intelligence: 75,
        level: 15
      }
    },
    {
      id: 2,
      type: 'pet',
      name: '雷电爪狼',
      image: '🐺',
      rarity: 'Epic',
      price: '2.8',
      currency: 'ETH',
      seller: '0x2345...6789',
      description: '具有雷电爪特殊技能的史诗级灵宠',
      stats: {
        strength: 82,
        agility: 95,
        intelligence: 68,
        level: 12
      }
    },
    {
      id: 3,
      type: 'land',
      name: '传奇城堡地块',
      image: '🏰',
      rarity: 'Legendary',
      price: '8.5',
      currency: 'ETH',
      seller: '0x3456...7890',
      description: '已升级到城堡级别的传奇地块，带稀有祭坛建筑',
      stats: {
        level: 'Castle',
        production: 120,
        building: 'Altar',
        type: 'Legendary'
      }
    },
    {
      id: 4,
      type: 'pet',
      name: '火焰鬃毛狮',
      image: '🦁',
      rarity: 'Rare',
      price: '1.2',
      currency: 'ETH',
      seller: '0x4567...8901',
      description: '拥有火焰鬃毛基因的稀有灵宠',
      stats: {
        strength: 78,
        agility: 65,
        intelligence: 72,
        level: 8
      }
    },
    {
      id: 5,
      type: 'land',
      name: '优质村落地块',
      image: '🌳',
      rarity: 'Rare',
      price: '1.8',
      currency: 'ETH',
      seller: '0x5678...9012',
      description: '优质地块，已建造锻造坊',
      stats: {
        level: 'Village',
        production: 35,
        building: 'Forge',
        type: 'Premium'
      }
    },
    {
      id: 6,
      type: 'pet',
      name: '普通灵猫',
      image: '🐱',
      rarity: 'Common',
      price: '0.3',
      currency: 'ETH',
      seller: '0x6789...0123',
      description: '新手友好的普通灵宠',
      stats: {
        strength: 45,
        agility: 55,
        intelligence: 48,
        level: 3
      }
    }
  ];

  const filteredItems = marketItems.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pets') return item.type === 'pet';
    if (activeFilter === 'lands') return item.type === 'land';
    if (activeFilter === 'equipment') return item.type === 'equipment';
    return true;
  });

  const handleBuyItem = async (item: any) => {
    if (!account) {
      await connectWallet();
      return;
    }

    setLoading(true);
    try {
      console.log(`购买物品: ${item.name}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`成功购买 ${item.name}！`);
    } catch (error) {
      console.error('购买失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItemStats = (item: any) => {
    if (item.type === 'pet') {
      return (
        <ItemStats>
          <StatItem>
            <div className="label">力量</div>
            <div className="value">{item.stats.strength}</div>
          </StatItem>
          <StatItem>
            <div className="label">敏捷</div>
            <div className="value">{item.stats.agility}</div>
          </StatItem>
          <StatItem>
            <div className="label">智慧</div>
            <div className="value">{item.stats.intelligence}</div>
          </StatItem>
          <StatItem>
            <div className="label">等级</div>
            <div className="value">{item.stats.level}</div>
          </StatItem>
        </ItemStats>
      );
    } else if (item.type === 'land') {
      return (
        <ItemStats>
          <StatItem>
            <div className="label">等级</div>
            <div className="value">{item.stats.level}</div>
          </StatItem>
          <StatItem>
            <div className="label">产量</div>
            <div className="value">{item.stats.production}/h</div>
          </StatItem>
          <StatItem>
            <div className="label">建筑</div>
            <div className="value">{item.stats.building}</div>
          </StatItem>
          <StatItem>
            <div className="label">类型</div>
            <div className="value">{item.stats.type}</div>
          </StatItem>
        </ItemStats>
      );
    }
    return null;
  };

  if (!account) {
    return (
      <MarketContainer>
        <Header>
          <Title>NFT 市场</Title>
          <Subtitle>买卖灵宠、地块和装备NFT</Subtitle>
        </Header>

        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '16px', 
          padding: '40px', 
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h2 style={{ color: 'white', marginBottom: '16px' }}>连接钱包进入市场</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '24px' }}>
            请连接您的MetaMask钱包以浏览和购买NFT物品
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
      </MarketContainer>
    );
  }

  return (
    <MarketContainer>
      <Header>
        <Title>NFT 市场</Title>
        <Subtitle>买卖灵宠、地块和装备NFT</Subtitle>
      </Header>

      <FilterTabs>
        {filters.map((filter) => (
          <FilterTab
            key={filter.id}
            $active={activeFilter === filter.id}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.name}
          </FilterTab>
        ))}
      </FilterTabs>

      {filteredItems.length === 0 ? (
        <EmptyState>
          <h3>暂无物品</h3>
          <p>
            当前分类下暂无可购买的物品。
            <br />
            请尝试其他分类或稍后再来查看。
          </p>
        </EmptyState>
      ) : (
        <MarketGrid>
          {filteredItems.map((item) => (
            <MarketCard key={item.id}>
              <ItemImage>
                {item.image}
                <RarityBadge $rarity={item.rarity}>
                  {item.rarity}
                </RarityBadge>
              </ItemImage>

              <ItemInfo>
                <h4>{item.name}</h4>
                <div className="description">{item.description}</div>
              </ItemInfo>

              {renderItemStats(item)}

              <PriceSection>
                <Price>
                  {item.price} <span className="currency">{item.currency}</span>
                </Price>
                <SellerInfo>
                  卖家: {item.seller}
                </SellerInfo>
              </PriceSection>

              <BuyButton 
                onClick={() => handleBuyItem(item)}
                disabled={loading}
              >
                {loading ? '购买中...' : '立即购买'}
              </BuyButton>
            </MarketCard>
          ))}
        </MarketGrid>
      )}
    </MarketContainer>
  );
};

export default Market;