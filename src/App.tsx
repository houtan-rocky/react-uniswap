import React from "react";
import Providers from "./components/Provider";
import SwapWidget from "./components/SwapWidget";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Providers>
        <SwapWidget />
      </Providers>
    </div>
  );
};

export default App;
