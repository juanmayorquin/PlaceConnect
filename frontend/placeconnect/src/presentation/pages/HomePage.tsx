import { useAuth } from "../../hooks/AuthContext";

const HomePage = () => {
  const { user } = useAuth();
  console.log(user);
  return <div>Bienvenido, {user?.name}!</div>;
};

export default HomePage;
