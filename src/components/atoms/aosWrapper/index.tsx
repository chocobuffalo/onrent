'use client'

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

type AOSWrapperProps = {
  children: React.ReactNode;
  animation?: string;
  duration?: number;
  delay?: number;
  offset?: number;
  easing?: string;
  once?: boolean;
  anchorPlacement?: string;
  className?: string;
};

const AOSWrapper = ({
  children,
  animation = 'fade-up',
  duration = 800,
  delay = 0,
  offset = 120,
  easing = 'ease-in-out',
  once = false,
  anchorPlacement = 'top-bottom',
  className = '',
}: AOSWrapperProps) => {
  useEffect(() => {
    AOS.init({
      duration,
      once,
      offset,
      delay,
    });
  }, [duration, easing, once, offset, delay, anchorPlacement]);

  return (
    <div 
      data-aos={animation}
      data-aos-duration={duration}
      data-aos-delay={delay}
      data-aos-offset={offset}
      data-aos-easing={easing}
      data-aos-once={once}
      data-aos-anchor-placement={anchorPlacement}
      className={className}
    >
      {children}
    </div>
  );
};

export default AOSWrapper;