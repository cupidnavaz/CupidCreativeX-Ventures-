import { useEffect, useRef } from 'react';

type ParallaxImageProps = {
  src: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
};

export function ParallaxImage({ src, alt, className = '', loading = 'lazy' }: ParallaxImageProps) {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const updatePosition = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (reducedMotion.matches) {
          image.style.transform = '';
          image.style.willChange = 'auto';
          return;
        }

        const bounds = image.parentElement?.getBoundingClientRect();
        if (!bounds) return;
        const distanceFromCenter = bounds.top + bounds.height / 2 - window.innerHeight / 2;
        const offset = Math.max(-18, Math.min(18, distanceFromCenter * -0.06));
        image.style.transform = `translate3d(0, ${offset}px, 0) scale(1.12)`;
        image.style.willChange = 'transform';
      });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, { passive: true });
    window.addEventListener('resize', updatePosition);
    reducedMotion.addEventListener('change', updatePosition);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
      reducedMotion.removeEventListener('change', updatePosition);
      image.style.transform = '';
      image.style.willChange = 'auto';
    };
  }, []);

  return <img ref={imageRef} src={src} alt={alt} className={className} loading={loading} />;
}
