import AppRoutes from "./routes/Routes";
import { AuthProvider } from "./hooks/AuthContext";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
