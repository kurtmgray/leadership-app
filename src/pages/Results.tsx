import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { useAssessment } from '../hooks/useAssessment';
import { calculateScores, getSortedResults } from '../utils/scoring';
import { leadershipStyles } from '../data/leadershipStyles';

const Results: React.FC = () => {
  const navigate = useNavigate();
  const { state, resetAssessment } = useAssessment();
  const resultsRef = useRef<HTMLDivElement>(null);

  const scores = calculateScores(state.responses);
  const sortedResults = getSortedResults(scores);

  const handleBack = () => {
    navigate('/question/25');
  };

  const handleExport = async () => {
    if (resultsRef.current) {
      try {
        const canvas = await html2canvas(resultsRef.current, {
          backgroundColor: '#ffffff',
          scale: 2,
        });

        const isMobileDevice = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
        
        if (isMobileDevice) {
          // Mobile: Use JPEG and native sharing
          canvas.toBlob((blob) => {
            if (blob) {
              if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], `${state.userName}-leadership-results.jpg`, { type: 'image/jpeg' })] })) {
                const file = new File([blob], `${state.userName}-leadership-results.jpg`, { type: 'image/jpeg' });
                navigator.share({
                  files: [file],
                  title: 'Leadership Assessment Results'
                }).catch(() => {
                  saveAs(blob, `${state.userName}-leadership-results.jpg`);
                });
              } else {
                saveAs(blob, `${state.userName}-leadership-results.jpg`);
              }
            }
          }, 'image/jpeg', 0.9);
        } else {
          // Desktop: Use PNG
          canvas.toBlob((blob) => {
            if (blob) {
              saveAs(blob, `${state.userName}-leadership-results.png`);
            }
          }, 'image/png');
        }
      } catch (error) {
        console.error('Error exporting results:', error);
      }
    }
  };

  const handleRestart = () => {
    resetAssessment();
    navigate('/');
  };

  const getColorClass = (color: string) => {
    return `leadership-box ${color}`;
  };

  const getStyleForColor = (color: string) => {
    const style = leadershipStyles.find((s) => s.color === color);
    return style ? style[state.language] : null;
  };

  const getOrdinalRank = (rank: number) => {
    const ordinals = ['1st', '2nd', '3rd', '4th'];
    return ordinals[rank - 1] || `${rank}th`;
  };

  const text = {
    en: {
      title: `${
        state.userName
          ? `${state.userName}'s Leadership Style Results`
          : `Your Leadership Style Results`
      }`,
      export: 'Save Results',
      restart: 'Take Again',
      score: 'Score:',
    },
    es: {
      title: `${
        state.userName
          ? `Resultados de Estilo de Liderazgo de ${state.userName}`
          : 'Tus Resultados de Estilo de Liderazgo'
      }`,
      export: 'Guardar Resultados',
      restart: 'Tomar de Nuevo',
      score: 'Puntaje:',
    },
  };

  const t = text[state.language];

  return (
    <div className="results-page">
      <div className="container">
        <div className="header">
          <button className="back-btn" onClick={handleBack}>
            <ArrowLeft size={24} />
          </button>
          <button className="export-btn" onClick={handleExport}>
            <Download size={20} />
            {t.export}
          </button>
        </div>

        <div className="results-content" ref={resultsRef}>
          <h1>{t.title}</h1>

          <div className="leadership-results">
            {sortedResults.map((result, index) => {
              const styleInfo = getStyleForColor(result.color);
              return (
                <div key={result.color} className={getColorClass(result.color)}>
                  <div className="rank">{getOrdinalRank(index + 1)}</div>
                  <div className="score-display">
                    {t.score} {result.score}
                  </div>
                  {styleInfo && (
                    <div className="style-content">
                      <h3>{styleInfo.title}</h3>
                      <p>{styleInfo.description}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="actions">
          <button className="restart-btn" onClick={handleRestart}>
            {t.restart}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
