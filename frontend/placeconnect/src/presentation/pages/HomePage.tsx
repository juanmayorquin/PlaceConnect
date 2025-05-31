import { useAuth } from "../../hooks/AuthContext";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const { user } = useAuth();
  console.log(user);
  return (
    <div>
      <Navbar />
      Bienvenido, {user?.name}!
    </div>
  );
};

export default HomePage;
