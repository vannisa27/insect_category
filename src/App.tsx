// import "./App.css";
import { GoogleLoginApiProvider } from "./components/GoogleLoginApiProvider";
import RouteManagement from "./RouteManagement";

function App() {
  return (
    <GoogleLoginApiProvider>
      <RouteManagement />
    </GoogleLoginApiProvider>
  );
}

export default App;
