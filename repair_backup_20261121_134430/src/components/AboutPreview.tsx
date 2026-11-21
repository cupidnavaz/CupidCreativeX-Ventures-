import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Target, Eye, Heart, ArrowRight } from 'lucide-react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
}

function ParallaxImage({ src, alt, className = '' }: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);
  const y = useSpring(rawY, { stiffness: 120, damping: 25, restDelta: 0.001 });
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1.15]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden">
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale }}
        className={`absolute inset-0 w-full h-full object-cover object-center ${className}`}
      />
    </div>
  );
}

export function AboutPreview({
  aboutImage,
  settings,
  hf,
  primary,
  accent,
  navigate,
}: {
  aboutImage: string;
  settings: any;
  hf: string;
  primary: string;
  accent: string;
  navigate: (to: string) => void;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      text: settings?.about_mission || 'To transform ideas into impactful digital solutions.',
    },
    {
      icon: Eye,
      title: 'Our Vision',
      text: 'To be the most trusted digital partner for businesses worldwide, known for innovation and excellence.',
    },
    {
      icon: Heart,
      title: 'Our Values',
      text: 'Integrity, creativity, and a relentless commitment to client success drive everything we do.',
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="w-full px-8 md:px-12 lg:px-20">
        <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
          
          <div className={`grid grid-cols-1 ${aboutImage ? 'md:grid-cols-2' : ''} gap-12 items-center`}>
            {aboutImage && (
              <div 
                className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 transition-all duration-700 transform ${
                  visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
              >
                <ParallaxImage
                  src={aboutImage}
                  alt={`${settings?.brand_name || 'CupidCreativeX'} team and work`}
                />
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{ background: `linear-gradient(135deg, ${primary}15, transparent 55%, ${accent}20)` }}
                />
              </div>
            )}

            <div 
              className={`transition-all duration-700 delay-200 transform ${
                visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              } ${aboutImage ? '' : 'max-w-3xl mx-auto'}`}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: hf }}>
                {settings?.about_title || 'About Us'}
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                {settings?.about_text ||
                  'We are a team of passionate designers, developers, and strategists dedicated to helping businesses thrive in the digital age.'}
              </p>
              <button
                onClick={() => navigate('/about')}
                className="font-medium text-sm flex items-center gap-2 group"
                style={{ color: primary }}
              >
                Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {values.map(({ icon: Icon, title, text }, index) => (
              <article 
                key={title} 
                className={`glass glass-hover rounded-2xl p-8 transition-all duration-700 transform ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${300 + index * 150}ms` }}
              >
                <div
                  className="w-14 h-14 rounded-xl border border-white/10 flex items-center justify-center mb-6"
                  style={{ background: `linear-gradient(135deg, ${primary}20, ${accent}10)` }}
                >
                  <Icon className="w-7 h-7" style={{ color: primary }} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: hf }}>{title}</h3>
                <p className="text-gray-400 leading-relaxed">{text}</p>
              </article>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
