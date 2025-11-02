// index.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import router from "./router.jsx";
import AuthProvider from "./provider/AuthProvider.jsx";
import { Toaster } from "./components/ui/sonner.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <>
        {/* RouterProvider কে wrap করবে */}
        <RouterProvider router={router} />
        
        {/* Globally toast enable */}
        <Toaster position="top-right" richColors />
      </>
    </AuthProvider>
  </StrictMode>
);
