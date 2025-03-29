import { GoogleSheetData } from "./components/GoogleSheets";
import { BrowserRouter } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <BrowserRouter basename="/">
      <GoogleSheetData />
    </BrowserRouter>
  );
}

export default App;
