import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquareQuote } from 'lucide-react';
import { useAssessment } from '../hooks/useAssessment';
import { questions, questionHeader, questionContext } from '../data/questions';

const Question: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, setResponse } = useAssessment();

  const questionId = parseInt(id || '1');
  const question = questions.find((q) => q.id === questionId);
  const [score, setScore] = useState<string>('');
  const inputRef = React.useRef<HTMLInputElement>(null);

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

    // Simplified focus logic with layout stability check
    const timer = setTimeout(() => {
      if (inputRef.current && document.hasFocus()) {
        inputRef.current.style.pointerEvents = 'auto';
        inputRef.current.style.touchAction = 'manipulation';
        inputRef.current.focus();
      }
    }, 300);

    return () => clearTimeout(timer);
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  const handleSubmit = () => {
    const scoreNum = parseInt(score);
    if (scoreNum >= 1 && scoreNum <= 10) {
      setResponse(questionId, scoreNum);

      if (questionId === 25) {
        navigate('/results');
      } else {
        navigate(`/question/${questionId + 1}`);
        // Auto-focus will be handled by the useEffect after navigation
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

  const handleContentClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
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

        <div className="content" onClick={handleContentClick}>
          <div className="question-context">
            <MessageSquareQuote className="quote-icon quote-start" size={20} />
            {questionContext[state.language]}
          </div>

          <div className="question-text">
            {question[state.language]}
            {/* <Quote className="quote-icon quote-end" size={20} /> */}
          </div>

          <form className="score-input-section" onSubmit={handleFormSubmit}>
            <input
              ref={inputRef}
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={score}
              onChange={handleScoreChange}
              placeholder="1-10"
              className="score-input"
              maxLength={2}
            />

            <button type="submit" className="submit-btn" disabled={!canSubmit}>
              {questionId === 25
                ? state.language === 'en'
                  ? 'See Results'
                  : 'Ver Resultados'
                : state.language === 'en'
                ? 'Next'
                : 'Siguiente'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Question;
