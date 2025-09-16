// import { useQuery } from '@tanstack/react-query'
// import { api } from './lib/api'

// function App() {
//   const { data, isLoading, error } = useQuery({
//     queryKey: ['stays'],
//     queryFn: async () => (await api.get('/stays/')).data,
//   })

//   if (isLoading) {
//     return <p className="p-4">Chargement...</p>
//   }

//   if (error) {
//     return <p className="p-4 text-red-500">Erreur lors du chargement</p>
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-2xl font-bold mb-4">Liste des séjours</h1>
//       <ul className="space-y-2">
//         {data?.map((stay: any) => (
//           <li key={stay.id} className="p-4 bg-white shadow rounded">
//             {stay.name} — {stay.city} (Score éco : {stay.eco_score})
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }

// export default App

export default function App() { return null }
// App.tsx n’est plus utilisé : le point d’entrée est routes.tsx.
// Le vrai layout global est MainLayout.tsx (Header + Outlet).
