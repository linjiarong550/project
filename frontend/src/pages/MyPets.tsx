import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useWeb3 } from '../contexts/Web3Context';

const PetsContainer = styled.div`
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

const PetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const PetCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const PetImage = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  margin-bottom: 16px;
`;

const PetInfo = styled.div`
  h3 {
    font-size: 1.3rem;
    color: #333;
    margin-bottom: 8px;
  }

  p {
    color: #666;
    margin-bottom: 16px;
  }
`;

const AttributesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 16px;
`;

const Attribute = styled.div`
  background: rgba(102, 126, 234, 0.1);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.85rem;

  .label {
    color: #667eea;
    font-weight: 600;
  }

  .value {
    color: #333;
    font-weight: 500;
  }
`;

const PetActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &.primary {
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
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

const StarterBoxSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const StarterBoxTitle = styled.h2`
  color: white;
  margin-bottom: 16px;
  font-size: 1.5rem;
`;

const StarterBoxDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 24px;
  line-height: 1.6;
`;

const PurchaseButton = styled.button`
  background: linear-gradient(45deg, #f39c12, #e67e22);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(243, 156, 18, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ConnectPrompt = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  h2 {
    color: white;
    margin-bottom: 16px;
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 24px;
  }
`;

const ConnectButton = styled.button`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

const MyPets: React.FC = () => {
  const { account, connectWallet } = useWeb3();
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 模拟灵宠数据（实际项目中会从智能合约获取）
  const mockPets = [
    {
      id: 1,
      name: "火焰龙",
      image: "🐲",
      level: 5,
      experience: 250,
      attributes: {
        strength: 85,
        agility: 70,
        intelligence: 60,
        stamina: 90,
        elementAffinity: 95,
        luck: 75
      },
      generation: 0,
      isAlive: true
    },
    {
      id: 2,
      name: "冰霜狼",
      image: "🐺",
      level: 3,
      experience: 120,
      attributes: {
        strength: 70,
        agility: 95,
        intelligence: 80,
        stamina: 85,
        elementAffinity: 65,
        luck: 60
      },
      generation: 1,
      isAlive: true
    }
  ];

  useEffect(() => {
    if (account) {
      // 这里应该调用智能合约获取用户的灵宠
      setPets(mockPets);
    }
  }, [account]);

  const handlePurchaseStarterBox = async () => {
    if (!account) {
      await connectWallet();
      return;
    }

    setLoading(true);
    try {
      // 这里应该调用智能合约购买新手盲盒
      console.log('购买新手盲盒...');
      // 模拟交易
      await new Promise(resolve => setTimeout(resolve, 2000));
      // 添加新灵宠到列表
      const newPet = {
        id: Date.now(),
        name: "新手灵宠",
        image: "🐱",
        level: 1,
        experience: 0,
        attributes: {
          strength: Math.floor(Math.random() * 40) + 30,
          agility: Math.floor(Math.random() * 40) + 30,
          intelligence: Math.floor(Math.random() * 40) + 30,
          stamina: Math.floor(Math.random() * 40) + 30,
          elementAffinity: Math.floor(Math.random() * 40) + 30,
          luck: Math.floor(Math.random() * 40) + 30
        },
        generation: 0,
        isAlive: true
      };
      setPets([...pets, newPet]);
    } catch (error) {
      console.error('购买失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <PetsContainer>
        <ConnectPrompt>
          <h2>连接钱包开始游戏</h2>
          <p>请连接您的MetaMask钱包以查看和管理您的灵宠NFT</p>
          <ConnectButton onClick={connectWallet}>
            连接钱包
          </ConnectButton>
        </ConnectPrompt>
      </PetsContainer>
    );
  }

  return (
    <PetsContainer>
      <Header>
        <Title>我的灵宠</Title>
        <Subtitle>管理你的NFT灵宠收藏</Subtitle>
      </Header>

      {pets.length === 0 ? (
        <StarterBoxSection>
          <StarterBoxTitle>🎁 获得你的第一只灵宠</StarterBoxTitle>
          <StarterBoxDescription>
            购买新手盲盒，获得一只随机属性的灵宠NFT！
            <br />
            每只灵宠都有独特的基因和属性，开始你的灵境冒险吧！
          </StarterBoxDescription>
          <PurchaseButton 
            onClick={handlePurchaseStarterBox}
            disabled={loading}
          >
            {loading ? '购买中...' : '购买新手盲盒 (0.01 ETH)'}
          </PurchaseButton>
        </StarterBoxSection>
      ) : (
        <>
          <PetsGrid>
            {pets.map((pet) => (
              <PetCard key={pet.id}>
                <PetImage>{pet.image}</PetImage>
                <PetInfo>
                  <h3>{pet.name}</h3>
                  <p>等级 {pet.level} • 经验 {pet.experience} • 第{pet.generation}代</p>
                </PetInfo>
                
                <AttributesGrid>
                  <Attribute>
                    <div className="label">力量</div>
                    <div className="value">{pet.attributes.strength}</div>
                  </Attribute>
                  <Attribute>
                    <div className="label">敏捷</div>
                    <div className="value">{pet.attributes.agility}</div>
                  </Attribute>
                  <Attribute>
                    <div className="label">智慧</div>
                    <div className="value">{pet.attributes.intelligence}</div>
                  </Attribute>
                  <Attribute>
                    <div className="label">耐力</div>
                    <div className="value">{pet.attributes.stamina}</div>
                  </Attribute>
                  <Attribute>
                    <div className="label">元素</div>
                    <div className="value">{pet.attributes.elementAffinity}</div>
                  </Attribute>
                  <Attribute>
                    <div className="label">幸运</div>
                    <div className="value">{pet.attributes.luck}</div>
                  </Attribute>
                </AttributesGrid>

                <PetActions>
                  <ActionButton className="primary">
                    训练
                  </ActionButton>
                  <ActionButton className="secondary">
                    详情
                  </ActionButton>
                </PetActions>
              </PetCard>
            ))}
          </PetsGrid>

          <StarterBoxSection>
            <StarterBoxTitle>🎁 获得更多灵宠</StarterBoxTitle>
            <StarterBoxDescription>
              继续购买新手盲盒扩展你的灵宠收藏，或通过繁殖培育新的后代！
            </StarterBoxDescription>
            <PurchaseButton 
              onClick={handlePurchaseStarterBox}
              disabled={loading}
            >
              {loading ? '购买中...' : '购买新手盲盒 (0.01 ETH)'}
            </PurchaseButton>
          </StarterBoxSection>
        </>
      )}
    </PetsContainer>
  );
};

export default MyPets;