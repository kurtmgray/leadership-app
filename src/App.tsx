import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AssessmentProvider } from './hooks/useAssessment';
import LanguageSelection from './pages/LanguageSelection';
import NameEntry from './pages/NameEntry';
import Question from './pages/Question';
import Results from './pages/Results';
import './App.css';

function App() {
  return (
    <AssessmentProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LanguageSelection />} />
            <Route path="/name" element={<NameEntry />} />
            <Route path="/question/:id" element={<Question />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </div>
      </Router>
    </AssessmentProvider>
  );
}

export default App
