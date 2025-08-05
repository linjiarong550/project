import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface Web3ContextType {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  account: string | null;
  chainId: number | null;
  connectWallet: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
  error: string | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error('请安装MetaMask钱包');
      }

      // 请求账户访问
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      const network = await provider.getNetwork();

      setProvider(provider);
      setSigner(signer);
      setAccount(account);
      setChainId(network.chainId);

      // 保存连接状态
      localStorage.setItem('walletConnected', 'true');
    } catch (err: any) {
      console.error('连接钱包失败:', err);
      setError(err.message || '连接钱包失败');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setChainId(null);
    setError(null);
    localStorage.removeItem('walletConnected');
  };

  // 检查是否已连接
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum && localStorage.getItem('walletConnected')) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            const signer = provider.getSigner();
            const network = await provider.getNetwork();
            
            setProvider(provider);
            setSigner(signer);
            setAccount(accounts[0]);
            setChainId(network.chainId);
          }
        } catch (err) {
          console.error('检查连接状态失败:', err);
        }
      }
    };

    checkConnection();
  }, []);

  // 监听账户变化
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else if (accounts[0] !== account) {
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = (chainId: string) => {
        setChainId(parseInt(chainId, 16));
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [account]);

  const contextValue: Web3ContextType = {
    provider,
    signer,
    account,
    chainId,
    connectWallet,
    disconnect,
    isConnecting,
    error
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};