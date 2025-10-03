// src/ComponentConnexion/Formulaire.jsx
import useLogin from '../hooks/useLogin';

function Formulaire() {
    const { formData, loading, error, handleChange, handleSubmit } = useLogin();

    return (
        <div className="flex flex-col justify-center items-center h-full">
            <h3 className="text-[#093545] text-2xl md:text-5xl text-center mb-8">
                Connectez-vous
            </h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80 md:w-96">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <input 
                    type="text" 
                    name="identifiant"
                    placeholder="Email ou identifiant" 
                    required 
                    value={formData.identifiant}
                    onChange={handleChange}
                    disabled={loading}
                    className="bg-[#093545] text-white p-2 rounded placeholder:text-white focus:outline-none focus:ring-2 focus:ring-[#20DF7F] disabled:opacity-50" 
                    style={{
                        WebkitBoxShadow: '0 0 0 1000px #093545 inset',
                        WebkitTextFillColor: 'white'
                    }}
                />
                
                <input 
                    type="password" 
                    name="mot_de_passe"
                    placeholder="Mot de passe" 
                    required 
                    value={formData.mot_de_passe}
                    onChange={handleChange}
                    disabled={loading}
                    className="bg-[#093545] text-white p-2 rounded placeholder:text-white focus:outline-none focus:ring-2 focus:ring-[#20DF7F] disabled:opacity-50" 
                    style={{
                        WebkitBoxShadow: '0 0 0 1000px #093545 inset',
                        WebkitTextFillColor: 'white'
                    }}
                />
                
                <button 
                    type="submit"
                    disabled={loading}
                    className="bg-[#20DF7F] text-[#224957] p-2 font-bold rounded mx-auto w-32 mt-2 hover:bg-[#1BC970] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Connexion...' : 'Connexion'}
                </button>
            </form>
        </div>
    );
}

export default Formulaire;