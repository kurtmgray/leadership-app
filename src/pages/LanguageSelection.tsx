import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../hooks/useAssessment';
import type { Language } from '../types';

const LanguageSelection: React.FC = () => {
  const navigate = useNavigate();
  const { setLanguage } = useAssessment();

  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
    navigate('/name');
  };

  return (
    <div className="language-selection">
      <div className="container">
        <h1>Four Leadership Styles Assessment</h1>
        <h2>Evaluación de Cuatro Estilos de Liderazgo</h2>
        
        <p>Please select your preferred language:</p>
        <p>Por favor selecciona tu idioma preferido:</p>

        <div className="language-buttons">
          <button 
            className="language-btn english"
            onClick={() => handleLanguageSelect('en')}
          >
            English
          </button>
          <button 
            className="language-btn spanish"
            onClick={() => handleLanguageSelect('es')}
          >
            Español
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;