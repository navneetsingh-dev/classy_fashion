import { BoutiqueProvider } from './context/BoutiqueContext';
import { DualViewLayout } from './components/DualViewLayout';
import './App.css';

function App() {
  return (
    <BoutiqueProvider>
      <DualViewLayout />
    </BoutiqueProvider>
  );
}

export default App;
