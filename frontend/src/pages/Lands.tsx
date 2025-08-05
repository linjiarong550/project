import React, { useState } from 'react';
import styled from 'styled-components';
import { useWeb3 } from '../contexts/Web3Context';

const LandsContainer = styled.div`
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

const LandTypesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const LandTypeCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const LandIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
`;

const LandTypeName = styled.h3`
  color: #333;
  margin-bottom: 12px;
  font-size: 1.4rem;
`;

const LandPrice = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 12px;
`;

const LandFeatures = styled.ul`
  text-align: left;
  color: #666;
  margin-bottom: 20px;
  padding-left: 20px;

  li {
    margin-bottom: 6px;
  }
`;

const PurchaseButton = styled.button`
  background: linear-gradient(45deg, #27ae60, #2ecc71);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;

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

const MyLandsSection = styled.div`
  margin-top: 60px;
`;

const SectionTitle = styled.h2`
  color: white;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
`;

const LandsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

const LandCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const LandImage = styled.div`
  width: 100%;
  height: 150px;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin-bottom: 16px;
`;

const LandInfo = styled.div`
  h4 {
    color: #333;
    margin-bottom: 8px;
    font-size: 1.2rem;
  }

  p {
    color: #666;
    margin-bottom: 12px;
    font-size: 0.9rem;
  }
`;

const LandStats = styled.div`
  background: rgba(102, 126, 234, 0.1);
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 0.85rem;

  .label {
    color: #667eea;
    font-weight: 600;
  }

  .value {
    color: #333;
  }
`;

const LandActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &.primary {
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
    }
  }

  &.secondary {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;

    &:hover {
      background: rgba(102, 126, 234, 0.2);
    }
  }
`;

const Lands: React.FC = () => {
  const { account, connectWallet } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [myLands, setMyLands] = useState<any[]>([]);

  const landTypes = [
    {
      type: "Basic",
      name: "基础地块",
      price: "0.1 ETH",
      icon: "🌱",
      features: [
        "10 灵晶/小时 基础产量",
        "可建造基础建筑",
        "可升级到村落",
        "支持1个建筑位"
      ]
    },
    {
      type: "Premium",
      name: "优质地块",
      price: "0.5 ETH",
      icon: "🌳",
      features: [
        "25 灵晶/小时 基础产量",
        "可建造高级建筑",
        "升级加成更高",
        "支持2个建筑位"
      ]
    },
    {
      type: "Legendary",
      name: "传奇地块",
      price: "2.0 ETH",
      icon: "🏰",
      features: [
        "50 灵晶/小时 基础产量",
        "可建造稀有建筑",
        "最高升级等级",
        "支持3个建筑位"
      ]
    }
  ];

  // 模拟用户地块数据
  const mockLands = [
    {
      id: 1,
      name: "我的第一块地",
      type: "Basic",
      level: "Village",
      building: "Hospital",
      production: 15,
      lastHarvest: Date.now() - 3600000, // 1小时前
      icon: "🌱"
    }
  ];

  const handlePurchaseLand = async (landType: any) => {
    if (!account) {
      await connectWallet();
      return;
    }

    setLoading(true);
    try {
      console.log(`购买${landType.name}...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newLand = {
        id: Date.now(),
        name: `新的${landType.name}`,
        type: landType.type,
        level: "Village",
        building: "None",
        production: landType.type === "Basic" ? 10 : landType.type === "Premium" ? 25 : 50,
        lastHarvest: Date.now(),
        icon: landType.icon
      };
      
      setMyLands([...myLands, newLand]);
      alert(`成功购买${landType.name}！`);
    } catch (error) {
      console.error('购买失败:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (account) {
      setMyLands(mockLands);
    }
  }, [account]);

  if (!account) {
    return (
      <LandsContainer>
        <Header>
          <Title>灵境领地</Title>
          <Subtitle>购买地块，建造专属领地</Subtitle>
        </Header>

        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '16px', 
          padding: '40px', 
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h2 style={{ color: 'white', marginBottom: '16px' }}>连接钱包开始建造</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '24px' }}>
            请连接您的MetaMask钱包以购买和管理地块NFT
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
      </LandsContainer>
    );
  }

  return (
    <LandsContainer>
      <Header>
        <Title>灵境领地</Title>
        <Subtitle>购买地块，建造专属领地</Subtitle>
      </Header>

      <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '30px' }}>
        购买地块
      </h2>

      <LandTypesGrid>
        {landTypes.map((landType, index) => (
          <LandTypeCard key={index}>
            <LandIcon>{landType.icon}</LandIcon>
            <LandTypeName>{landType.name}</LandTypeName>
            <LandPrice>{landType.price}</LandPrice>
            
            <LandFeatures>
              {landType.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </LandFeatures>

            <PurchaseButton 
              onClick={() => handlePurchaseLand(landType)}
              disabled={loading}
            >
              {loading ? '购买中...' : '购买地块'}
            </PurchaseButton>
          </LandTypeCard>
        ))}
      </LandTypesGrid>

      {myLands.length > 0 && (
        <MyLandsSection>
          <SectionTitle>我的领地</SectionTitle>
          
          <LandsGrid>
            {myLands.map((land) => (
              <LandCard key={land.id}>
                <LandImage>{land.icon}</LandImage>
                
                <LandInfo>
                  <h4>{land.name}</h4>
                  <p>类型: {land.type} • 等级: {land.level}</p>
                </LandInfo>

                <LandStats>
                  <StatRow>
                    <span className="label">建筑</span>
                    <span className="value">{land.building === "None" ? "无" : land.building}</span>
                  </StatRow>
                  <StatRow>
                    <span className="label">产量</span>
                    <span className="value">{land.production} 灵晶/小时</span>
                  </StatRow>
                  <StatRow>
                    <span className="label">待收获</span>
                    <span className="value">
                      {Math.floor((Date.now() - land.lastHarvest) / 1000 / 60)} 分钟
                    </span>
                  </StatRow>
                </LandStats>

                <LandActions>
                  <ActionButton className="primary">
                    收获
                  </ActionButton>
                  <ActionButton className="secondary">
                    建造
                  </ActionButton>
                  <ActionButton className="secondary">
                    升级
                  </ActionButton>
                  <ActionButton className="secondary">
                    详情
                  </ActionButton>
                </LandActions>
              </LandCard>
            ))}
          </LandsGrid>
        </MyLandsSection>
      )}
    </LandsContainer>
  );
};

export default Lands;