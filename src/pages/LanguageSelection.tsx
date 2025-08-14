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
        <div className="title">
          <h1>Evaluación de Cuatro Estilos de Liderazgo</h1>
          <h1>Four Leadership Styles Assessment</h1>
        </div>
        <p>Por favor seleccione su idioma preferido:</p>
        <p>Please select your preferred language:</p>

        <div className="language-buttons">
          <button
            className="language-btn spanish"
            onClick={() => handleLanguageSelect('es')}
          >
            Español
          </button>
          <button
            className="language-btn english"
            onClick={() => handleLanguageSelect('en')}
          >
            English
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
