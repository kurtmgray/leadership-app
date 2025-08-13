import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAssessment } from '../hooks/useAssessment';
import { questions, questionHeader, questionContext } from '../data/questions';
import { isAssessmentComplete } from '../utils/scoring';

const Question: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, setResponse } = useAssessment();

  const questionId = parseInt(id || '1');
  const question = questions.find((q) => q.id === questionId);
  const [score, setScore] = useState<string>('');

  useEffect(() => {
    if (questionId < 1 || questionId > 25 || !question) {
      navigate('/');
      return;
    }

    const existingResponse = state.responses.find(
      (r) => r.questionId === questionId
    );
    if (existingResponse) {
      setScore(existingResponse.score.toString());
    } else {
      setScore('');
    }
  }, [questionId, question, navigate, state.responses]);

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value === '') {
      setScore('');
      return;
    }

    if (/^([1-9]|10)$/.test(value)) {
      setScore(value);
    }
  };

  const handleSubmit = () => {
    const scoreNum = parseInt(score);
    if (scoreNum >= 1 && scoreNum <= 10) {
      setResponse(questionId, scoreNum);

      const updatedResponses = [
        ...state.responses.filter((r) => r.questionId !== questionId),
        { questionId, score: scoreNum },
      ];

      if (questionId === 25) {
        if (isAssessmentComplete(updatedResponses)) {
          navigate('/results');
        }
      } else {
        navigate(`/question/${questionId + 1}`);
      }
    }
  };

  const handleBack = () => {
    if (questionId === 1) {
      navigate('/name');
    } else {
      navigate(`/question/${questionId - 1}`);
    }
  };

  if (!question) {
    return <div>Question not found</div>;
  }

  const canSubmit =
    score !== '' && parseInt(score) >= 1 && parseInt(score) <= 10;

  return (
    <div className="question-page">
      <div className="container">
        <div className="header">
          <button className="back-btn" onClick={handleBack}>
            <ArrowLeft size={24} />
          </button>

          <div className="question-header-text">
            {questionHeader[state.language]}
          </div>

          <div className="progress-counter">{questionId}/25</div>
        </div>

        <div className="content">
          <div className="question-context">
            {questionContext[state.language]}
          </div>

          <div className="question-text">{question[state.language]}</div>

          <div className="score-input-section">
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={score}
              onChange={handleScoreChange}
              placeholder="1-10"
              className="score-input"
              maxLength={2}
            />

            <button
              onClick={handleSubmit}
              className="submit-btn"
              disabled={!canSubmit}
            >
              {questionId === 25
                ? state.language === 'en'
                  ? 'See Results'
                  : 'Ver Resultados'
                : state.language === 'en'
                ? 'Next'
                : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;
