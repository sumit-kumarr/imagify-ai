
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export const useGSAPAnimations = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const promptInputRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  // Initialize animations
  useEffect(() => {
    // Hero section animation
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: 'power3.out'
        }
      );
    }

    // Heading animation
    if (headingRef.current) {
      const chars = headingRef.current.innerHTML.split('');
      headingRef.current.innerHTML = '';
      chars.forEach((char, i) => {
        const span = document.createElement('span');
        span.innerHTML = char === ' ' ? '&nbsp;' : char;
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        headingRef.current?.appendChild(span);

        gsap.to(span, {
          opacity: 1,
          duration: 0.05,
          delay: 0.5 + (i * 0.03),
          ease: 'power3.out'
        });
      });
    }

    // Prompt input animation
    if (promptInputRef.current) {
      gsap.fromTo(
        promptInputRef.current,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          delay: 0.8,
          ease: 'power2.out'
        }
      );
    }

    // Features section animation
    if (featuresRef.current) {
      ScrollTrigger.create({
        trigger: featuresRef.current,
        start: 'top bottom-=100',
        onEnter: () => {
          gsap.fromTo(
            featuresRef.current?.querySelectorAll('.feature-card'),
            { opacity: 0, y: 50 },
            { 
              opacity: 1, 
              y: 0, 
              stagger: 0.2,
              duration: 0.8,
              ease: 'power2.out'
            }
          );
        }
      });
    }

    // Clean up ScrollTrigger on component unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return { heroRef, headingRef, promptInputRef, featuresRef };
};
