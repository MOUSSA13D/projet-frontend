import React from 'react';

function BlockCard({ param0, param, contenu, nombre, loading }) {
  return (
    <div className={`${param0} flex items-center justify-center`}>
      <div className="flex flex-col items-center justify-center text-center">
        <h3 className="text-[#093545] font-semibold text-sm lg:text-lg mb-2">
          {contenu}
        </h3>

        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#20DF7F]"></div>
          </div>
        ) : (
          <span className={`text-3xl lg:text-5xl font-bold ${param}`}>
            {nombre || 0}
          </span>
        )}
      </div>
    </div>
  );
}

export default BlockCard;
