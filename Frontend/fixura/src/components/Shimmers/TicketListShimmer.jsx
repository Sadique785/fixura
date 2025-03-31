

const TicketListShimmer = () => {
    return (
      <div className="divide-y divide-[#30363d]">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="p-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="pt-1">
                  <span className="inline-block w-4 h-4 rounded-full bg-[#30363d]"></span>
                </div>
                <div className="ml-2">
                  <div className="w-40 h-5 bg-[#30363d] rounded mb-2"></div>
                  <div className="w-24 h-3 bg-[#30363d] rounded"></div>
                </div>
              </div>
              <div className="w-20 h-3 bg-[#30363d] rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default TicketListShimmer;
  