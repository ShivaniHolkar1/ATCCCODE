import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard.jsx';
import ExitVehicleClassification from './pages/ExitVehicleClassification.jsx';
import EnterVehicleCounting from './pages/EnterVehicleCounting.jsx';
import ExitVehicleCounting from './pages/ExitVehicleCounting.jsx';
import IncidentReport from './pages/IncidentReport.jsx';
import ProductList from './pages/ProductList.jsx';
import Navbar from './components/Navbar';
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css";

const App = () => {
  return (
    <BrowserRouter>
    <Navbar/>
      <Sidebar>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ExitVehicleClassification" element={<ExitVehicleClassification />} />
          <Route path="/ExitVehicleCounting" element={<ExitVehicleCounting />} />
          <Route path="/EnterVehicleCounting" element={<EnterVehicleCounting />} />
          <Route path="/IncidentReport" element={<IncidentReport />} />
          <Route path="/productList" element={<ProductList />} />
        </Routes>
      </Sidebar>
    </BrowserRouter>
  );
};

export default App;