import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Intro() {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      router.push('/home');
    }, 4000); // Totale duur van de intro

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <motion.div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden">
      {/* Achtergrond animatie lagen */}
      <motion.div
        initial={{ scale: 1.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 bg-[url('/vercel.svg')] bg-cover bg-center opacity-20 blur-xl"
      />
      
      {/* Gouden overlay */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 bg-gradient-to-b from-[#B0926A]/20 to-transparent transform origin-bottom"
      />

      {/* Hoofdtekst animatie */}
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="overflow-hidden"
        >
          <motion.h1 
            className="text-[8vw] font-bold text-white tracking-tighter mb-4"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            BOP
          </motion.h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="overflow-hidden"
        >
          <motion.p 
            className="text-[3vw] text-[#B0926A] tracking-widest"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            BOUW OP PERFECTIE
          </motion.p>
        </motion.div>

        {/* Animerende lijn */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1.5 }}
          className="h-[1px] bg-white/30 mt-8 transform origin-left"
        />

        {/* Subtekst */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 1, delay: 2 }}
          className="text-white/70 mt-4 text-sm tracking-wider"
        >
          LUXE RENOVATIES & VERBOUWINGEN
        </motion.p>
      </div>

      {/* Uitgaande animatie */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isAnimating ? 0 : 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 3 }}
        className="absolute inset-0 bg-[#F5F5F0] transform origin-bottom"
      />
    </motion.div>
  );
} 