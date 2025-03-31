import Header from "../Home/Header";
import Footer from "../Home/Footer";

const TicketDetailShimmer = () => {
    return (

        <main className="flex-grow p-6">
          <div className="container mx-auto max-w-4xl">
            {/* Ticket Header Shimmer */}
            <div className="bg-[#161b22] bg-opacity-70 border border-[#30363d] rounded-md p-6 mb-6 shadow">
              <div className="flex justify-between items-center mb-4">
                <div className="h-8 bg-[#30363d] rounded w-3/4"></div>
                <div className="flex gap-2">
                  <div className="h-10 w-20 bg-[#30363d] rounded"></div>
                  <div className="h-10 w-20 bg-[#30363d] rounded"></div>
                </div>
              </div>
  
              <div className="flex gap-2 mb-4">
                <div className="h-6 w-24 bg-[#30363d] rounded"></div>
                <div className="h-6 w-32 bg-[#30363d] rounded"></div>
                <div className="h-6 w-20 bg-[#30363d] rounded"></div>
              </div>
  
              <hr className="border-t border-[#30363d] my-4" />
  
              {/* User Info & Description */}
              <div className="flex gap-4 items-start">
                <div className="h-12 w-12 bg-[#30363d] rounded-full"></div>
                <div className="flex-1">
                  <div className="h-6 w-40 bg-[#30363d] rounded mb-2"></div>
                  <div className="h-4 w-32 bg-[#30363d] rounded mb-2"></div>
                  <div className="h-4 w-52 bg-[#30363d] rounded mb-2"></div>
                  <div className="h-4 w-full bg-[#30363d] rounded"></div>
                </div>
              </div>
            </div>
  
            {/* Activity Section Shimmer */}
            <div className="bg-[#161b22] bg-opacity-70 border border-[#30363d] rounded-md p-6 shadow">
              <div className="h-6 w-48 bg-[#30363d] rounded mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="h-8 w-8 bg-[#30363d] rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 w-40 bg-[#30363d] rounded mb-2"></div>
                      <div className="h-3 w-32 bg-[#30363d] rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

    );
  };

  export default TicketDetailShimmer