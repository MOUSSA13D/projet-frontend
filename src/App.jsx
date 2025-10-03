// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Layout from './layout/Layout';
import Profil from './profil/Profil';
import Accuiel from './pages/Accuiel';
import Client from './pages/Client';
import Distributeur from './pages/Distributeur';
import Depot from './pages/Depot';
import TableauHistorique from './pages/Historique';
import AnnulerTransaction from './pages/AnnulerTransaction';
import ProtectedRoute from './components/ProtectedRoute';
import Conexion from './pages/connexion';
function App() {
  return (
    <Router>
      <Routes>
        {/* Page login sans Layout */}
        <Route path="/login" element={<Conexion />} />

        {/* Routes avec Layout et protection */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/accuiel" replace />} />
          <Route path="accuiel" element={<Accuiel />} />
          <Route path="profil" element={<Profil />} />
          <Route path="client" element={<Client />} />
          <Route path="distributeur" element={<Distributeur />} />
          <Route path="depot" element={<Depot />} />
          <Route path="historique" element={<TableauHistorique />} />
          <Route path="annuler-transaction" element={<AnnulerTransaction />} />
        </Route>

        {/* Route par défaut - redirection vers login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;