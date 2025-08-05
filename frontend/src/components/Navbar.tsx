import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useWeb3 } from '../contexts/Web3Context';

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 20px;
`;

const NavContent = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 28px;
  font-weight: bold;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    flex-direction: column;
    padding: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  text-decoration: none;
  color: ${props => props.$isActive ? '#667eea' : '#333'};
  font-weight: ${props => props.$isActive ? '600' : '500'};
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }

  ${props => props.$isActive && `
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 16px;
      right: 16px;
      height: 2px;
      background: linear-gradient(45deg, #667eea, #764ba2);
      border-radius: 1px;
    }
  `}
`;

const WalletSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const WalletButton = styled.button<{ $isConnected: boolean }>`
  background: ${props => props.$isConnected 
    ? 'linear-gradient(45deg, #27ae60, #2ecc71)' 
    : 'linear-gradient(45deg, #667eea, #764ba2)'};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;

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

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;

  @media (max-width: 768px) {
    display: block;
  }
`;

const AccountInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 12px;
  color: #666;
`;

const Navbar: React.FC = () => {
  const location = useLocation();
  const { account, connectWallet, disconnect, isConnecting, chainId } = useWeb3();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: '首页', path: '/' },
    { name: '我的灵宠', path: '/pets' },
    { name: '战斗', path: '/battle' },
    { name: '领地', path: '/lands' },
    { name: '市场', path: '/market' }
  ];

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 1: return 'Mainnet';
      case 5: return 'Goerli';
      case 11155111: return 'Sepolia';
      case 31337: return 'Localhost';
      default: return `Chain ${chainId}`;
    }
  };

  return (
    <NavContainer>
      <NavContent>
        <Logo to="/">
          ✨ 灵境宠界
        </Logo>

        <NavLinks isOpen={isMobileMenuOpen}>
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              $isActive={location.pathname === item.path}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </NavLink>
          ))}
        </NavLinks>

        <WalletSection>
          {account ? (
            <>
              <AccountInfo>
                <div>{formatAddress(account)}</div>
                {chainId && <div>{getNetworkName(chainId)}</div>}
              </AccountInfo>
              <WalletButton $isConnected={true} onClick={disconnect}>
                断开连接
              </WalletButton>
            </>
          ) : (
            <WalletButton 
              $isConnected={false} 
              onClick={connectWallet}
              disabled={isConnecting}
            >
              {isConnecting ? '连接中...' : '连接钱包'}
            </WalletButton>
          )}

          <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            ☰
          </MobileMenuButton>
        </WalletSection>
      </NavContent>
    </NavContainer>
  );
};

export default Navbar;