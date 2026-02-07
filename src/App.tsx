import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Inventory from './pages/Inventory';

// import Shipping from './pages/Shipping';
import Inbox from './pages/Inbox';

import ProductMasterPage from './pages/ProductMaster';

import { DataProvider } from './context/DataContext';
import OrderManagement from './pages/OrderManagement';
import Settings from './pages/Settings';

import Welcome from './pages/Welcome';

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page (No Layout) */}
          <Route path="/" element={<Welcome />} />

          {/* Main App Pages (With Layout) */}
          <Route path="/inbox" element={<Layout><Inbox /></Layout>} />
          <Route path="/shipping" element={<Layout><OrderManagement /></Layout>} />
          <Route path="/inventory" element={<Layout><Inventory /></Layout>} />
          <Route path="/products" element={<Layout><ProductMasterPage /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
