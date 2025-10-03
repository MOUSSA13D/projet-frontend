import { Component } from "react";

class ValidModal extends Component{
    render(){
        const { ouvert } = this.props;
        if (!ouvert) return null;
        return (
            <div>
               <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div className="bg-white rounded-lg p-4 max-w-md mx-auto">
          <div className="mt-4">
           
            <div className=" p-2">

              {/* profil */}
              <div className="  px-0 flex flex-col items-center justify-center sm:w-2/5 w-full md:mb-0 mx-auto block">
          <div className='rounded-full p-1 bg-[#20DF7F]'>
          <img src={admin} alt="Image de profil" className="rounded-full   h-24" />
          </div>
          
          <h1 className="text-[#093545] mb-2 font-semibold text-lg">Ndiaga Sall</h1>
          <h1 className="text-[#093545] mb-4 font-semibold text-md">Admin</h1>
        </div>
        <p className='text-xl'>Vore mots de passe a ete modifier</p>
            </div>
            <button type="submit" className="mt-4 bg-[#20DF7F] mx-auto block text-black p-2 rounded w-28 font-semibold text-lg shadow-lg">Valider</button>
         
          </div>
        </div>
      </div>
            </div>
          )
    }
}
export default ValidModal;