import { useState } from "react";
import "./App.css";
import Pool from "./components/Pool";
import Main from "./components/Main";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Warehouse App</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex px-4 py-6 sm:px-0 gap-4">
            <div className="w-full">
              <Main />
            </div>
            <div className="w-full border-4 border-dashed border-gray-200 rounded-lg h-96">
              <Pool />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
