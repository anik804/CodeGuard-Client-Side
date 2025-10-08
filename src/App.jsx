// src/App.jsx
import React from "react";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router";
import Footer from "./components/Shared/Footer";

function App() {
  return (
    <div>
      <Navbar />
      <Outlet></Outlet>
      <Footer></Footer>
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
