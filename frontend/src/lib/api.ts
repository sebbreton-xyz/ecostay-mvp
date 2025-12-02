import axios from "axios";

const DEFAULT_DEV_BASE_URL = "http://127.0.0.1:8000/api";

// On récupère la valeur fournie par Vite
let baseURL = import.meta.env.VITE_API_BASE_URL as string | undefined;

// Si on est en DEV et que rien n'est défini, on tombe sur le backend local
if (import.meta.env.DEV && !baseURL) {
  baseURL = DEFAULT_DEV_BASE_URL;
}

// Si la config est manquante  
if (import.meta.env.PROD && !baseURL) {
  
  console.warn(
    "[api] VITE_API_BASE_URL n'est pas défini en production. " +
      "Les appels axios risquent d'échouer."
  );
}

export const api = axios.create({
  baseURL,
  // optionnel :
  // timeout: 10000,
});
