import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAssessment } from '../hooks/useAssessment';

const NameEntry: React.FC = () => {
  const navigate = useNavigate();
  const { state, setUserName } = useAssessment();
  const [name, setName] = useState(state.userName || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setUserName(name.trim());
      navigate('/question/1');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const text = {
    en: {
      title: 'What\'s your name?',
      placeholder: 'Enter your name',
      button: 'Start Assessment',
      required: 'Name is required'
    },
    es: {
      title: '¿Cuál es tu nombre?',
      placeholder: 'Ingresa tu nombre',
      button: 'Comenzar Evaluación',
      required: 'El nombre es requerido'
    }
  };

  const t = text[state.language];

  return (
    <div className="name-entry">
      <div className="container">
        <div className="header">
          <button className="back-btn" onClick={handleBack}>
            <ArrowLeft size={24} />
          </button>
        </div>

        <div className="content">
          <h1>{t.title}</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.placeholder}
                className="name-input"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={!name.trim()}
            >
              {t.button}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NameEntry;