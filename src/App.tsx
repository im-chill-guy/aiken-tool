import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MintTokenValidator } from "./components/MintTokenValidator";
import ContractPage from "./pages/ContractPage";
import Sidebar from "./components/layout/Sidebar";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ContractPage />} />
        <Route path="/mint-tokens" element={
          <div className="flex h-screen bg-gradient-to-br from-[#1a1533] to-[#0f1729]">
            <Sidebar />
            <div className="flex-1">
              <MintTokenValidator />
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
