import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { Web3Provider } from './contexts/Web3Context';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyPets from './pages/MyPets';
import Battle from './pages/Battle';
import Lands from './pages/Lands';
import Market from './pages/Market';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const MainContent = styled.main`
  padding-top: 80px;
  min-height: calc(100vh - 80px);
`;

function App() {
  return (
    <Web3Provider>
      <AppContainer>
        <Navbar />
        <MainContent>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pets" element={<MyPets />} />
            <Route path="/battle" element={<Battle />} />
            <Route path="/lands" element={<Lands />} />
            <Route path="/market" element={<Market />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Web3Provider>
  );
}

export default App;