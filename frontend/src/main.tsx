// import React from "react"
// import ReactDOM from "react-dom/client"
// import "./index.css"

// import { RouterProvider } from "react-router-dom"
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
// import { router } from "@/routes/routes"

// const qc = new QueryClient()

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <QueryClientProvider client={qc}>
//       <RouterProvider router={router} />
//     </QueryClientProvider>
//   </React.StrictMode>
// )


// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/routes"; // adapte à ta config
import "./index.css";
import "leaflet/dist/leaflet.css";


const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
