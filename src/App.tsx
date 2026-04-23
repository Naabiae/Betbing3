import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useInterwovenKit } from '@initia/interwovenkit-react';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Pool from './pages/Pool';
import { Wallet } from 'lucide-react';

const truncateMiddle = (value: string, head = 6, tail = 4) => {
  if (!value) return '';
  if (value.length <= head + tail) return value;
  return `${value.slice(0, head)}...${value.slice(-tail)}`;
};

function Navigation() {
  const location = useLocation();
  const { isConnected, initiaAddress, username, openConnect, openWallet, openBridge, autoSign } =
    useInterwovenKit();

  const navItems = [
    { path: '/', label: 'MATCHES' },
    { path: '/portfolio', label: 'PORTFOLIO' },
    { path: '/pool', label: 'HOUSE POOL' },
  ];

  return (
    <nav className="border-b-4 border-black bg-white dark:bg-zinc-950 dark:border-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo & Links */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-black tracking-tighter uppercase shrink-0">
              <span className="text-black dark:text-white bg-green-400 dark:bg-green-500 px-2 py-1 border-2 border-black dark:border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)]">
                INIT
              </span>
              <span className="ml-1 text-black dark:text-white">BET</span>
            </Link>
            
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 font-bold uppercase transition-all duration-200 border-2 ${
                      isActive 
                        ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,1)] translate-x-[-2px] translate-y-[-2px]' 
                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Wallet Button */}
          <div className="flex items-center">
            <button 
              onClick={isConnected ? openWallet : openConnect}
              className="flex items-center space-x-2 bg-green-400 hover:bg-green-300 dark:bg-green-500 dark:hover:bg-green-400 text-black border-4 border-black px-4 py-2 font-bold uppercase transition-transform hover:-translate-y-1 hover:-translate-x-1 shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_rgba(255,255,255,1)] active:translate-y-0 active:translate-x-0 active:shadow-[0px_0px_0px_rgba(0,0,0,1)]"
            >
              <Wallet className="w-5 h-5" strokeWidth={3} />
              <span>
                {isConnected
                  ? truncateMiddle(username ?? initiaAddress)
                  : 'CONNECT WALLET'}
              </span>
            </button>
            <button
              onClick={() => openBridge()}
              className="ml-3 bg-white dark:bg-zinc-950 text-black dark:text-white border-4 border-black dark:border-white px-3 py-2 font-bold uppercase transition-transform hover:-translate-y-1 hover:-translate-x-1 shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_rgba(255,255,255,1)] active:translate-y-0 active:translate-x-0 active:shadow-[0px_0px_0px_rgba(0,0,0,1)]"
              type="button"
            >
              BRIDGE
            </button>
            <button
              onClick={() =>
                autoSign.isEnabledByChain['movegame-1']
                  ? autoSign.disable('movegame-1')
                  : autoSign.enable('movegame-1')
              }
              disabled={autoSign.isLoading}
              className="ml-3 bg-black dark:bg-white text-white dark:text-black border-4 border-black dark:border-white px-3 py-2 font-bold uppercase transition-transform hover:-translate-y-1 hover:-translate-x-1 shadow-[4px_4px_0px_rgba(0,255,102,1)] active:translate-y-0 active:translate-x-0 active:shadow-[0px_0px_0px_rgba(0,255,102,1)] disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              {autoSign.isEnabledByChain['movegame-1'] ? 'AUTOSIGN ON' : 'AUTOSIGN'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 font-sans selection:bg-green-400 selection:text-black transition-colors duration-200">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/pool" element={<Pool />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
