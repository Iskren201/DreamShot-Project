import "./App.css";
import Vault from "./components/Vault";
import { VaultProvider } from "./context/VaultContext";
import ErrorBoundary from "./ErrorBoundary";

function App() {
  return (
    <VaultProvider>
      <ErrorBoundary>
        <div className="w-screen h-screen flex justify-center items-center overflow-hidden">
          <Vault />
        </div>
      </ErrorBoundary>
    </VaultProvider>
  );
}

export default App;