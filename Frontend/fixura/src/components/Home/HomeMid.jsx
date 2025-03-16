import { gradients } from '../../styles/gradient';

const HomeMid = ({ setShowLogin }) => {

  
  return (
    <main className="flex-grow py-16 px-6 md:px-12" style={{ background: gradients.mainGradient }}>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 mb-10 md:mb-0 pr-0 md:pr-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              Effortless Support, Exceptional Service
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Fixura empowers you to manage support tickets seamlessly, ensuring quick resolutions and happier customers. 
              Simplify your workflow, enhance communication, and deliver outstanding customer service—every time, on every channel.
            </p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-3 rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
              onClick={() => setShowLogin(true)}
            >
              Let's Get Started
            </button>
          </div>

          {/* Image & Decorative Elements */}
          <div className="w-full md:w-1/2 h-64 md:h-96 relative flex items-center justify-center">
            <div className="w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden relative z-10">
              <img src="/images/home.jpg" alt="Fixura support" className="w-full h-full object-cover object-center" />
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-12 w-16 h-16 rounded-full bg-[#9898be] bg-opacity-20 z-0"></div>
            <div className="absolute bottom-12 left-12 grid grid-cols-3 gap-2 z-0">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-blue-300"></div>
              ))}
            </div>
            <div className="absolute top-20 left-8 w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center z-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div className="absolute bottom-16 right-8 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center z-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomeMid;
