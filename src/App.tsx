import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Inventory from './pages/Inventory';

import Shipping from './pages/Shipping';
import Inbox from './pages/Inbox';

import ProductMasterPage from './pages/ProductMaster';

import { DataProvider } from './context/DataContext';
import OrderManagement from './pages/OrderManagement';
import Settings from './pages/Settings';

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Inventory />} />
            <Route path="/products" element={<ProductMasterPage />} />
            <Route path="/shipping" element={<OrderManagement />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
