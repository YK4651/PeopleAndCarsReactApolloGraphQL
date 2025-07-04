import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import PersonShowPage from './components/PersonShowPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/people/:id" element={<PersonShowPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
