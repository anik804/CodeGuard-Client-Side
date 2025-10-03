// src/App.jsx
import React from "react";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router";

function App() {
  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1>Welcome to My Codeguard App</h1>
        <Outlet></Outlet>
      </div>
    </div>
  );
}

export default App;
// src/App.jsx
// import React from "react";
// import AppRouter from "./router";

// function App() {
//   return <AppRouter />;  // AppRouter er moddhe Navbar already ache
// }

// export default App;
