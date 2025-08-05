import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useWeb3 } from '../contexts/Web3Context';

const HomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
`;

const Hero = styled.section`
  max-width: 1000px;
  margin-bottom: 60px;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 20px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 40px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin-bottom: 60px;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  color: white;
  margin-bottom: 15px;
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
`;

const CTASection = styled.section`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
`;

const CTAButton = styled(Link)`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 16px 32px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 18px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
  }
`;

const SecondaryButton = styled(CTAButton)`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const StatsSection = styled.section`
  margin-top: 80px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  max-width: 800px;
`;

const StatCard = styled.div`
  text-align: center;
  color: white;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 5px;
`;

const Home: React.FC = () => {
  const { account } = useWeb3();

  const features = [
    {
      icon: '🐉',
      title: 'NFT 灵宠养成',
      description: '收集独特的NFT灵宠，每只都有独特的基因和属性。通过战斗和繁殖培养最强灵宠队伍。'
    },
    {
      icon: '⚔️',
      title: '战斗冒险',
      description: '挑战PVE副本，参与PVP竞技场。策略性回合制战斗，考验你的团队搭配和战术运用。'
    },
    {
      icon: '🏰',
      title: '领地建设',
      description: '购买地块NFT，建造个人领地。从村落升级到城堡，打造独一无二的元宇宙空间。'
    },
    {
      icon: '💎',
      title: '区块链经济',
      description: '完整的NFT交易市场，双代币经济模型。所有资产上链，真正拥有你的游戏财产。'
    }
  ];

  const stats = [
    { number: '10,000', label: '灵宠NFT' },
    { number: '10,000', label: '地块数量' },
    { number: '5', label: '副本关卡' },
    { number: '∞', label: '无限可能' }
  ];

  return (
    <HomeContainer>
      <Hero>
        <Title>灵境宠界</Title>
        <Subtitle>
          融合 NFT 宠物养成与元宇宙建造的区块链游戏
          <br />
          收集、战斗、建造，在灵境中开启你的冒险旅程
        </Subtitle>

        <CTASection>
          {account ? (
            <>
              <CTAButton to="/pets">查看我的灵宠</CTAButton>
              <SecondaryButton to="/lands">管理领地</SecondaryButton>
            </>
          ) : (
            <>
              <CTAButton to="/pets">开始游戏</CTAButton>
              <SecondaryButton to="/market">浏览市场</SecondaryButton>
            </>
          )}
        </CTASection>
      </Hero>

      <FeatureGrid>
        {features.map((feature, index) => (
          <FeatureCard key={index} className="fade-in">
            <FeatureIcon>{feature.icon}</FeatureIcon>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
          </FeatureCard>
        ))}
      </FeatureGrid>

      <StatsSection>
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <StatNumber>{stat.number}</StatNumber>
            <StatLabel>{stat.label}</StatLabel>
          </StatCard>
        ))}
      </StatsSection>
    </HomeContainer>
  );
};

export default Home;