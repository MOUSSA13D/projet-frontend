
function Pikture({img}) {
    return (
        <div className='flex justify-center items-center bg-[#093545] rounded-e-3xl min-h-screen'>
            <img src={img} alt="" className='max-w-full h-auto p-4' />
        </div>
    );
}

export default Pikture;
