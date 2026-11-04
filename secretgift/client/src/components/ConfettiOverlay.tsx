import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useTheme } from '../context/ThemeContext.tsx';

interface ConfettiOverlayProps {
  active?: boolean;
  onComplete?: () => void;
  numberOfPieces?: number;
}

export const ConfettiOverlay: React.FC<ConfettiOverlayProps> = ({
  active = false,
  onComplete,
  numberOfPieces = 260,
}) => {
  const { confettiActive, activeThemeOption, stopConfetti } = useTheme();
  const isTriggered = active || confettiActive;

  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  const [recycle, setRecycle] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isTriggered) {
      setVisible(true);
      setRecycle(true);

      // Stop recycling particles after 3.8s so they float down cleanly
      const recycleTimer = setTimeout(() => {
        setRecycle(false);
      }, 3800);

      // Fade out/remove component after 8s total
      const hideTimer = setTimeout(() => {
        setVisible(false);
        if (onComplete) onComplete();
        stopConfetti();
      }, 8000);

      return () => {
        clearTimeout(recycleTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [isTriggered]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <Confetti
        width={windowDimensions.width}
        height={windowDimensions.height}
        recycle={recycle}
        numberOfPieces={numberOfPieces}
        gravity={0.16}
        colors={activeThemeOption.confettiColors}
        tweenDuration={5000}
        onConfettiComplete={() => {
          setVisible(false);
          if (onComplete) onComplete();
          stopConfetti();
        }}
      />
    </div>
  );
};
