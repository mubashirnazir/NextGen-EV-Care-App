'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface ScrollFadeProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Delay in milliseconds
  duration?: number; // Duration in milliseconds
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  threshold?: number; // 0.0 to 1.0
  once?: boolean; // Keep visible once animated
  distance?: number; // Pixel translation distance (default 16 = ~translate-y-4)
}

export const ScrollFade: React.FC<ScrollFadeProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 700,
  direction = 'up',
  threshold = 0.12,
  once = true,
  distance = 16
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Accessibility check: Detect user preference for reduced motion
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setPrefersReducedMotion(true);
        setIsVisible(true);
        return;
      }
    }

    const element = elementRef.current;
    if (!element) return;

    // Fallback if IntersectionObserver is not available
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px' // Slight offset so animation triggers naturally before element fully enters
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once]);

  // Compute translation transform based on direction
  const getTransform = () => {
    if (isVisible || prefersReducedMotion) return 'translate3d(0, 0, 0)';
    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}px, 0)`;
      case 'down':
        return `translate3d(0, -${distance}px, 0)`;
      case 'left':
        return `translate3d(${distance}px, 0, 0)`;
      case 'right':
        return `translate3d(-${distance}px, 0, 0)`;
      case 'none':
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  return (
    <div
      ref={elementRef}
      className={`transform-gpu ${className}`}
      style={{
        opacity: isVisible || prefersReducedMotion ? 1 : 0,
        transform: getTransform(),
        transitionProperty: prefersReducedMotion ? 'none' : 'opacity, transform',
        transitionDuration: prefersReducedMotion ? '0ms' : `${duration}ms`,
        transitionDelay: prefersReducedMotion ? '0ms' : `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' // Apple-style fluid deceleration curve
      }}
    >
      {children}
    </div>
  );
};

export default ScrollFade;
