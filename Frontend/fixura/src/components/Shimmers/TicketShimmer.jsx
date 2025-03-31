


const TicketShimmer = () => {
    return (

        
        <div className="w-full border-collapse border border-gray-600">
          <div className="bg-gray-800 flex">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="border border-gray-600 p-4 w-1/5 h-6 bg-gray-600 rounded"></div>
            ))}
          </div>
          
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center text-center text-gray-100 border border-gray-600 p-4">
              {[...Array(5)].map((_, subIndex) => (
                <div key={subIndex} className="w-1/5 h-6 bg-gray-600 rounded m-2"></div>
              ))}
            </div>
          ))}
        </div>
    );
  };
  
  export default TicketShimmer;
  