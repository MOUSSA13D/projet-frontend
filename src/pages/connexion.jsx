// src/pages/Conexion.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Conectimg from '/image/img-connexion.png';
import authService from '../services/authService';
import Formulaire from '../ComponentConnexion/formulaire';
import Pikture from '../ComponentConnexion/pikture';

function Conexion() {
    const navigate = useNavigate();

    useEffect(() => {
        // Si l'utilisateur est déjà connecté, rediriger vers l'accueil
        if (authService.isAuthenticated()) {
            navigate('/accuiel');
        }
    }, [navigate]);
    
    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-7xl h-screen">
                <div className="hidden lg:block">
                    <Pikture img={Conectimg} />
                </div>
                <div className="flex items-center justify-center">
                    <Formulaire />
                </div>
            </div>
        </div>
    );
}

export default Conexion;