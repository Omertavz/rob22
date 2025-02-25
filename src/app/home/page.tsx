'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import Lenis from '@studio-freight/lenis';
import { useRouter } from 'next/navigation';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
}

const projects = [
  {
    id: 1,
    title: 'BOP Project',
    category: 'Luxe Renovatie',
    description: 'Complete renovatie met focus op duurzaamheid en modern design',
    image: 'https://i.imgur.com/CL4OhQE.jpeg'
  },
  {
    id: 2,
    title: 'Penthouse Rotterdam',
    category: 'Modern Interieur',
    description: 'High-end interieur voor exclusief penthouse',
    image: '/next.svg'
  },
  {
    id: 3,
    title: 'Herenhuis Amsterdam',
    category: 'Restauratie',
    description: 'Historische renovatie met moderne touch',
    image: '/next.svg'
  },
  {
    id: 4,
    title: 'Loft Den Haag',
    category: 'Transformatie',
    description: 'Industrieel pand omgetoverd tot loft',
    image: '/next.svg'
  },
  {
    id: 5,
    title: 'Villa Wassenaar',
    category: 'Nieuwbouw',
    description: 'Moderne villa met duurzame materialen',
    image: '/next.svg'
  },
  {
    id: 6,
    title: 'Kantoor Utrecht',
    category: 'Commercieel',
    description: 'Transformatie van industrieel erfgoed',
    image: '/next.svg'
  }
];

// Menu categorieën
const categories = [
  { name: 'Space', count: 'all' },
  { name: 'Furniture', count: '18' },
  { name: 'Interiors', count: '36' },
  { name: 'Living', count: '22' },
  { name: 'Offices', count: '35' },
  { name: 'Public Spaces', count: '15' },
  { name: 'Recognitions', count: '13' },
  { name: 'Towers', count: '7' },
  { name: 'Transformations', count: '1' },
  { name: 'Sustainability', count: '1' },
  { name: 'Books', count: '1' }
];

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useRef(null);
  const projectsRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  // Scroll animatie voor projecten sectie
  const { scrollYProgress: projectsScrollProgress } = useScroll({
    target: projectsRef,
    offset: ["start end", "end start"]
  });

  const projectsY = useTransform(projectsScrollProgress, [0, 1], ['200px', '-200px']);
  const projectsScale = useTransform(projectsScrollProgress, [0, 0.5, 1], [0.8, 1.1, 0.9]);
  const projectsRotate = useTransform(projectsScrollProgress, [0, 0.5, 1], [-10, 0, 10]);
  const projectsOpacity = useTransform(projectsScrollProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const router = useRouter();

  // Hero sectie met 3D wereldbol effect
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 1.3]);
  const heroRotate = useTransform(heroScrollProgress, [0, 1], [0, -5]);
  const heroBlur = useTransform(heroScrollProgress, [0, 1], [0, '10px']);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedImagePosition, setSelectedImagePosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Menu animatie varianten
  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 0.8,
      y: -20,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1],
        staggerChildren: 0.1,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1],
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const menuItemVariants = {
    closed: {
      opacity: 0,
      x: 40,
      transition: {
        duration: 0.4
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const handleProjectClick = async (project: Project, e: React.MouseEvent) => {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    
    setSelectedProject(project);
    setSelectedImagePosition({
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    });
    setIsTransitioning(true);
    
    // Wacht op de animatie voordat we navigeren
    await new Promise(resolve => setTimeout(resolve, 2000));
    router.push(`/projecten/${project.id}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Hero animatie
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 1.5, ease: 'power4.out' }
    );

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      lenis.destroy();
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      <main className="relative min-h-screen bg-[#0C0C0C]">
        {/* Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Achtergrond Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                onClick={() => setIsMenuOpen(false)}
              />
              
              {/* Menu Container */}
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={menuVariants}
                className="fixed inset-0 flex items-center justify-center z-50"
              >
                <div className="w-[280px] bg-black rounded-lg p-6">
                  {/* Menu Header */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-white/90 text-sm">Find a project</h2>
                    <motion.button
                      variants={menuItemVariants}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-base text-white/60 hover:text-white hover:rotate-90 transition-all duration-300"
                    >
                      ×
                    </motion.button>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-[6px]">
                    {categories.map((category, index) => (
                      <motion.div
                        key={category.name}
                        variants={menuItemVariants}
                        className="group cursor-pointer"
                        whileHover={{ x: 6 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-[22px] font-light text-white/90 group-hover:font-normal transition-all duration-300">
                            {category.name}
                          </h3>
                          <span className="text-[9px] text-white/40 group-hover:text-white/90 transition-colors duration-300 translate-y-[2px]">
                            {category.count}
                          </span>
                        </div>
                        <motion.div
                          initial={{ scaleX: 0 }}
                          whileHover={{ scaleX: 1 }}
                          transition={{ duration: 0.2 }}
                          className="h-[0.5px] bg-white/10 origin-left mt-[2px]"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Nieuwe Image Transition */}
        <AnimatePresence>
          {isTransitioning && selectedProject && (
            <>
              {/* Achtergrond Overlay */}
              <motion.div
                className="fixed inset-0 z-[100] bg-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ duration: 0.5 }}
              />

              {/* Transformerende Afbeelding */}
              <motion.div
                className="fixed z-[101] overflow-hidden"
                initial={{
                  x: selectedImagePosition.x,
                  y: selectedImagePosition.y,
                  width: selectedImagePosition.width,
                  height: selectedImagePosition.height,
                  borderRadius: "16px"
                }}
                animate={{
                  x: 0,
                  y: 0,
                  width: "100vw",
                  height: "100vh",
                  borderRadius: "0px"
                }}
                transition={{
                  duration: 0.7,
                  ease: [0.645, 0.045, 0.355, 1]
                }}
              >
                <motion.div
                  className="w-full h-full relative"
                  initial={{ scale: 1, rotateY: 0 }}
                  animate={{
                    scale: [1, 1.2, 1],
                    rotateY: [0, 180, 360],
                    z: [0, 500, 0]
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut"
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                    transformOrigin: "center center"
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url(${selectedProject.image})`,
                      backfaceVisibility: "hidden"
                    }}
                    initial={{ filter: "brightness(1)" }}
                    animate={{
                      filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
                    }}
                    transition={{ duration: 2 }}
                  />
                  
                  {/* Glans Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/50 to-white/0"
                    initial={{ opacity: 0, x: "-100%" }}
                    animate={{
                      opacity: [0, 1, 0],
                      x: ["100%", "-100%"],
                    }}
                    transition={{
                      duration: 1,
                      delay: 0.5,
                    }}
                  />
                </motion.div>
              </motion.div>

              {/* Project Titel Animatie */}
              <motion.div
                className="fixed z-[102] inset-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.h2
                  className="text-white text-6xl font-bold"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{
                    scale: [0.5, 1.2, 1],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    times: [0, 0.5, 1]
                  }}
                >
                  {selectedProject.title}
                </motion.h2>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Nieuwe Page Transition */}
        <AnimatePresence>
          {isTransitioning && (
            <>
              {/* Split Layers */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="fixed inset-0 z-[100] bg-[#F5F5F0] origin-left"
                  initial={{ 
                    scaleX: 0,
                    filter: 'brightness(1)',
                  }}
                  animate={{ 
                    scaleX: 1,
                    filter: `brightness(${1 - i * 0.15})`,
                    transition: {
                      duration: 0.8,
                      delay: i * 0.1,
                      ease: [0.645, 0.045, 0.355, 1]
                    }
                  }}
                >
                  {/* Animated Content Inside Each Layer */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                  >
                    <motion.div
                      className="relative"
                      animate={{
                        rotateY: [0, 90, 180],
                        scale: [1, 1.2, 1],
                        z: [0, 100, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.1,
                        ease: "easeInOut"
                      }}
                      style={{ 
                        transformStyle: 'preserve-3d',
                        transformOrigin: `${mousePosition.x}px ${mousePosition.y}px`
                      }}
                    >
                      <motion.div 
                        className="text-[#B0926A] text-[20vw] font-bold opacity-5"
                        animate={{
                          x: [0, 50, -50, 0],
                          y: [0, -30, 30, 0]
                        }}
                        transition={{
                          duration: 2,
                          delay: i * 0.1,
                          ease: "easeInOut"
                        }}
                      >
                        BOP
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}

              {/* Center Content */}
              <motion.div
                className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="relative"
                  animate={{
                    rotateX: [0, 360],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity
                  }}
                >
                  <motion.div
                    className="w-32 h-32 rounded-full border-4 border-[#B0926A] relative"
                    animate={{
                      rotate: 360,
                      borderWidth: ["4px", "2px", "4px"]
                    }}
                    transition={{
                      duration: 3,
                      ease: "linear",
                      repeat: Infinity
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.5, 1]
                      }}
                      transition={{
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Infinity
                      }}
                    >
                      <span className="text-[#B0926A] text-2xl font-bold tracking-widest">BOP</span>
                    </motion.div>
                  </motion.div>

                  {/* Orbital Particles */}
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-[#B0926A] rounded-full"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${i * 30}deg) translateX(60px)`
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.1,
                        repeat: Infinity
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>

              {/* Magnetic Lines Effect */}
              <motion.div
                className="fixed inset-0 z-[99] pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ delay: 0.3 }}
              >
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-[1px] w-full bg-[#B0926A]"
                    style={{ top: `${i * 5}%` }}
                    animate={{
                      scaleX: [1, 1.5, 1],
                      opacity: [0.2, 1, 0.2],
                      filter: ['blur(0px)', 'blur(2px)', 'blur(0px)']
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      repeat: Infinity
                    }}
                  />
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Premium Navigatie */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: [0.6, 0.05, -0.01, 0.9] }}
          className={`fixed w-full z-50 transition-all duration-500 ${
            isScrolled 
            ? 'bg-gradient-to-r from-[#0C0C0C]/95 via-[#1C1C1C]/95 to-[#0C0C0C]/95 backdrop-blur-md text-white shadow-2xl' 
            : 'bg-transparent text-white'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-24">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center space-x-12"
              >
                <motion.img 
                  src="https://i.imgur.com/0WkodUP.png"
                  alt="BOP Logo"
                  className={`w-48 transition-all duration-300 ${isScrolled ? 'brightness-100' : 'brightness-100'}`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
              <div className="hidden md:flex items-center space-x-12">
                <motion.button
                  onClick={() => setIsMenuOpen(true)}
                  className={`text-[32px] font-extralight tracking-tight hover:text-[#B0926A] transition-all duration-300`}
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  transition={{ duration: 0.3 }}
                >
                  +
                </motion.button>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Hero Sectie met 3 luxe foto's */}
        <section ref={heroRef} className="relative h-screen overflow-hidden bg-gradient-to-br from-[#0C0C0C] to-[#1C1C1C]">
          {/* Foto Container met 3D effect */}
          <div className="absolute inset-0 flex perspective-[2000px]">
            {/* Eerste foto met diagonale clip */}
            <motion.div 
              className="w-1/3 h-full relative overflow-hidden cursor-pointer"
              initial={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)' }}
              animate={{ clipPath: 'polygon(0 0, 100% 20%, 100% 100%, 0% 80%)' }}
              transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
              whileHover={{ scale: 1.02, zIndex: 10 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url(https://i.imgur.com/CL4OhQE.jpeg)' }}
                initial={{ scale: 1.5, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] }
                }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.4}
              />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"
                whileHover={{ opacity: 0.4 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                style={{ background: 'radial-gradient(circle at center, rgba(176,146,106,0.2) 0%, transparent 70%)' }}
              >
                <motion.div
                  className="text-white text-xl tracking-wider"
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  Sleep om te verkennen
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Tweede foto met omgekeerde diagonale clip */}
            <motion.div 
              className="w-1/3 h-full relative overflow-hidden cursor-pointer"
              initial={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)' }}
              animate={{ clipPath: 'polygon(0 20%, 100% 0, 100% 80%, 0% 100%)' }}
              transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.4 }}
              whileHover={{ scale: 1.02, zIndex: 10 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url(https://i.imgur.com/CL4OhQE.jpeg)' }}
                initial={{ scale: 1.5, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] }
                }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.4}
              />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"
                whileHover={{ opacity: 0.4 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                style={{ background: 'radial-gradient(circle at center, rgba(176,146,106,0.2) 0%, transparent 70%)' }}
              >
                <motion.div
                  className="text-white text-xl tracking-wider"
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  Sleep om te verkennen
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Derde foto met diagonale clip */}
            <motion.div 
              className="w-1/3 h-full relative overflow-hidden cursor-pointer"
              initial={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)' }}
              animate={{ clipPath: 'polygon(0 0, 100% 20%, 100% 100%, 0% 80%)' }}
              transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.6 }}
              whileHover={{ scale: 1.02, zIndex: 10 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url(https://i.imgur.com/CL4OhQE.jpeg)' }}
                initial={{ scale: 1.5, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] }
                }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.4}
              />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"
                whileHover={{ opacity: 0.4 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                style={{ background: 'radial-gradient(circle at center, rgba(176,146,106,0.2) 0%, transparent 70%)' }}
              >
                <motion.div
                  className="text-white text-xl tracking-wider"
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  Sleep om te verkennen
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Gouden overlay lijnen met verbeterde animatie */}
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <motion.div 
              className="absolute left-1/3 top-0 bottom-0 w-[1px]"
              style={{
                background: 'linear-gradient(to bottom, transparent, #B0926A 20%, #B0926A 80%, transparent)'
              }}
              animate={{
                height: ["0%", "100%"],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <motion.div 
              className="absolute right-1/3 top-0 bottom-0 w-[1px]"
              style={{
                background: 'linear-gradient(to bottom, transparent, #B0926A 20%, #B0926A 80%, transparent)'
              }}
              animate={{
                height: ["0%", "100%"],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                delay: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </motion.div>

          {/* Content Container met verbeterde animaties */}
          <div className="relative z-30 h-full flex items-center">
            <div className="container mx-auto px-4">
              <motion.div 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="max-w-4xl relative"
              >
                {/* Achtergrond tekst effect */}
                <motion.div
                  className="absolute -left-20 -top-20 text-[20vw] font-bold text-[#B0926A]/5 pointer-events-none whitespace-nowrap"
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.05, 0.1, 0.05],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  BOP
                </motion.div>

                <motion.h1 
                  className="text-[8vw] font-bold text-white leading-none mb-6 relative mix-blend-difference"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.7 }}
                >
                  BOP
                </motion.h1>

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                  className="h-1 bg-gradient-to-r from-[#B0926A] via-[#8B7355] to-[#B0926A] mb-8 relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-white/30"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.div>

                <motion.p 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1 }}
                  className="text-2xl text-white max-w-2xl relative mix-blend-difference"
                >
                  <motion.span
                    className="block"
                    animate={{
                      textShadow: [
                        '0 0 0px rgba(176,146,106,0)',
                        '0 0 10px rgba(176,146,106,0.5)',
                        '0 0 0px rgba(176,146,106,0)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    Van concept tot realisatie, wij zijn er om uw droomwoning werkelijkheid te maken
                  </motion.span>
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1.2 }}
                  className="mt-12"
                >
                  <motion.a
                    href="#contact"
                    className="inline-block px-8 py-4 bg-[#B0926A] text-white hover:bg-[#9A815C] transition-all duration-300 tracking-wider text-sm relative overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">VRAAG OFFERTE AAN</span>
                    <motion.div
                      className="absolute inset-0 bg-[#0C0C0C]"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '0%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Luxe Project Slider Sectie */}
        <section ref={projectsRef} className="relative min-h-screen bg-[#0C0C0C] overflow-hidden">
          {/* Achtergrond effect */}
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
            style={{
              backgroundImage: 'radial-gradient(circle at center, #B0926A 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}
          />

          {/* Grote titel op de achtergrond */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <motion.h2 
              className="text-[25vw] font-bold text-white/5 whitespace-nowrap tracking-tighter"
              animate={{
                y: [0, -20, 0],
                opacity: [0.05, 0.08, 0.05]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              BOP BOUW OP PERFECTIE
            </motion.h2>
          </div>

          {/* Projecten Container */}
          <div className="relative max-w-[2000px] mx-auto px-4 md:px-8 py-32">
            {/* Sectie titel */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center mb-24"
            >
              <h3 className="text-[#B0926A] text-sm tracking-[0.3em] mb-4">ONZE PROJECTEN</h3>
              <h2 className="text-4xl md:text-5xl text-white font-light">Ontdek onze <span className="font-bold">meesterwerken</span></h2>
            </motion.div>

            {/* Projecten Slider */}
            <motion.div
              className="relative h-[70vh] flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {projects.map((project, index) => {
                  const position = (index - activeIndex + projects.length) % projects.length;
                  const isActive = position === 0;
                  const xPosition = position * 800 - (position > projects.length / 2 ? projects.length * 800 : 0);

                  return (
                    <motion.div
                      key={project.id}
                      className="absolute w-[600px] h-[400px]"
                      animate={{ 
                        x: xPosition,
                        scale: isActive ? 1 : 0.8,
                        opacity: isActive ? 1 : 0.2,
                        rotateY: isActive ? 0 : position > 0 ? 60 : -60,
                        rotateX: isActive ? 0 : -15,
                        z: isActive ? 0 : -200,
                        zIndex: isActive ? 10 : 0
                      }}
                      transition={{
                        duration: 1,
                        ease: [0.6, 0.01, -0.05, 0.9],
                        opacity: { duration: 0.8 }
                      }}
                      style={{
                        transformStyle: 'preserve-3d',
                        perspective: '1500px'
                      }}
                    >
                      {/* Project Card */}
                      <motion.div
                        className="relative w-full h-full rounded-2xl overflow-hidden cursor-pointer"
                        whileHover={{
                          scale: 1.05,
                          rotateY: 0,
                          rotateX: 5,
                          z: 50,
                          transition: { 
                            duration: 0.4,
                            ease: "easeOut"
                          }
                        }}
                        onClick={(e) => handleProjectClick(project, e)}
                      >
                        {/* Achtergrond Afbeelding */}
                        <motion.div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${project.image})` }}
                          whileHover={{
                            scale: 1.15,
                            transition: { 
                              duration: 1.2,
                              ease: [0.33, 1, 0.68, 1]
                            }
                          }}
                        />

                        {/* Gradient Overlay */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"
                          initial={{ opacity: 0.7 }}
                          whileHover={{
                            opacity: 0.4,
                            transition: { 
                              duration: 0.6,
                              ease: "easeOut"
                            }
                          }}
                        />

                        {/* Content */}
                        <motion.div
                          className="absolute inset-0 p-12 flex flex-col justify-end"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            duration: 0.8,
                            ease: [0.33, 1, 0.68, 1],
                            delay: isActive ? 0.2 : 0
                          }}
                        >
                          <motion.p
                            className="text-[#B0926A] text-sm tracking-[0.2em] mb-4"
                            whileHover={{ 
                              x: 15,
                              transition: { duration: 0.3, ease: "easeOut" }
                            }}
                          >
                            {project.category}
                          </motion.p>
                          <motion.h3
                            className="text-3xl font-bold text-white mb-4"
                            whileHover={{ 
                              x: 15,
                              scale: 1.02,
                              transition: { duration: 0.3, ease: "easeOut" }
                            }}
                          >
                            {project.title}
                          </motion.h3>
                          <motion.p
                            className="text-white/80 max-w-md mb-8"
                            whileHover={{ 
                              x: 15,
                              transition: { duration: 0.3, ease: "easeOut" }
                            }}
                          >
                            {project.description}
                          </motion.p>

                          {/* Call to Action */}
                          <motion.div
                            className="flex items-center space-x-4 cursor-pointer group"
                            whileHover={{ 
                              x: 25,
                              transition: { duration: 0.3, ease: "easeOut" }
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProjectClick(project, e);
                            }}
                          >
                            <motion.span 
                              className="h-[1px] w-12 bg-[#B0926A]"
                              whileHover={{
                                width: "60px",
                                transition: { duration: 0.3 }
                              }}
                            />
                            <motion.span 
                              className="text-[#B0926A] text-sm tracking-wider relative"
                              whileHover={{
                                x: 5,
                                transition: { duration: 0.3 }
                              }}
                            >
                              BEKIJK PROJECT
                              <motion.span
                                className="absolute bottom-0 left-0 w-full h-[1px] bg-[#B0926A]"
                                initial={{ scaleX: 0 }}
                                whileHover={{
                                  scaleX: 1,
                                  transition: { duration: 0.3 }
                                }}
                                style={{ originX: 0 }}
                              />
                            </motion.span>
                          </motion.div>
                        </motion.div>

                        {/* Hover Effect Overlay */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-[#B0926A]/30 to-transparent opacity-0"
                          whileHover={{
                            opacity: 1,
                            transition: { 
                              duration: 0.6,
                              ease: [0.33, 1, 0.68, 1]
                            }
                          }}
                        />
                        
                        {/* Shine Effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0"
                          whileHover={{
                            opacity: 0.5,
                            x: ["100%", "-100%"],
                            transition: { 
                              opacity: { duration: 0.3 },
                              x: { duration: 1.5, ease: "linear" }
                            }
                          }}
                          style={{
                            rotate: 35,
                            scale: 2
                          }}
                        />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Navigatie Knoppen */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center space-x-8">
                <motion.button
                  onClick={prevSlide}
                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#B0926A] transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ←
                </motion.button>
                <motion.button
                  onClick={nextSlide}
                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#B0926A] transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  →
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Over Ons Sectie met aangepaste kleuren */}
        <section id="over-ons" className="py-32 px-4 md:px-8 bg-[#2C2C2C] text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-16 tracking-tight">Zorgeloos van idee<br />naar realisatie</h2>
            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <p className="text-xl font-light leading-relaxed">
                  Bij Bouw Op Perfectie streven we naar uitmuntendheid in elk detail.
                  Onze passie voor vakmanschap en innovatie resulteert in projecten die
                  de verwachtingen overtreffen.
                </p>
                <motion.button
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="mt-8 flex items-center space-x-4 text-sm tracking-wider group text-[#B0926A]"
                >
                  <span>LEES MEER OVER ONS</span>
                  <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                </motion.button>
              </div>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-2">Visie</h3>
                  <p className="text-gray-400">Het creëren van tijdloze ruimtes die emotie en functionaliteit verenigen.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Expertise</h3>
                  <p className="text-gray-400">Meer dan 15 jaar ervaring in high-end renovaties en verbouwingen.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Services Sectie met aangepaste kleuren */}
        <section id="services" className="py-32 px-4 md:px-8 bg-[#F5F5F0]">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto"
          >
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-[#2C2C2C]">Onze diensten</h2>
              <p className="text-[#666666] max-w-2xl mx-auto">
                Van concept tot realisatie, wij bieden een complete service voor uw project
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Architectuur',
                  description: 'Innovatieve ontwerpen die functionaliteit en esthetiek perfect combineren.',
                  icon: '◆'
                },
                {
                  title: 'Interieur Design',
                  description: 'Luxueuze interieurs die perfect aansluiten bij uw levensstijl.',
                  icon: '◇'
                },
                {
                  title: 'Project Management',
                  description: 'Volledige begeleiding van uw project, van start tot oplevering.',
                  icon: '○'
                }
              ].map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group p-8 bg-gray-50 hover:bg-black hover:text-white transition-all duration-500"
                >
                  <div className="text-3xl mb-6 group-hover:scale-110 transition-transform duration-500">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-4">{service.title}</h3>
                  <p className="text-gray-600 group-hover:text-gray-300 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  <motion.div
                    whileHover={{ x: 10 }}
                    className="mt-8 flex items-center space-x-4 text-sm tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  >
                    <span>ONTDEK MEER</span>
                    <span>→</span>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Contact Sectie met aangepaste kleuren */}
        <section id="contact" className="py-32 px-4 md:px-8 bg-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight text-[#2C2C2C]">
                  Vraag een vrijblijvende<br />offerte aan
                </h2>
                <p className="text-[#666666] mb-8">
                  Bent u geïnteresseerd in een samenwerking? Neem contact met ons op voor een vrijblijvend gesprek.
                </p>
                <div className="space-y-4">
                  <p className="flex items-center space-x-4">
                    <span className="text-[#B0926A]">→</span>
                    <span>info@bop.nl</span>
                  </p>
                  <p className="flex items-center space-x-4">
                    <span className="text-[#B0926A]">→</span>
                    <span>+31 (0)20 000 0000</span>
                  </p>
                  <p className="flex items-center space-x-4">
                    <span className="text-[#B0926A]">→</span>
                    <span>Rotterdam, Nederland</span>
                  </p>
                </div>
              </div>
              <div>
                <form className="space-y-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Naam"
                      className="w-full p-4 bg-[#F5F5F0] border-none focus:ring-2 focus:ring-[#B0926A] transition-all duration-300"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full p-4 bg-[#F5F5F0] border-none focus:ring-2 focus:ring-[#B0926A] transition-all duration-300"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Bericht"
                      rows={4}
                      className="w-full p-4 bg-[#F5F5F0] border-none focus:ring-2 focus:ring-[#B0926A] transition-all duration-300"
                    ></textarea>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="w-full p-4 bg-[#B0926A] text-white text-sm tracking-wider hover:bg-[#9A815C] transition-colors duration-300"
                  >
                    VERSTUUR BERICHT
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Luxe Process Section */}
        <section className="relative py-32 bg-[#0C0C0C]">
          <div className="max-w-7xl mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-24"
            >
              <h3 className="text-[#B0926A] text-sm tracking-[0.3em] mb-4">ONS PROCES</h3>
              <h2 className="text-4xl md:text-5xl text-white font-light">Van <span className="font-bold">Concept</span> tot <span className="font-bold">Realisatie</span></h2>
            </motion.div>

            <div className="grid grid-cols-4 gap-8">
              {[
                { number: "01", title: "Concept", description: "Vertaling van uw wensen naar een uniek ontwerp" },
                { number: "02", title: "Planning", description: "Gedetailleerde planning en materiaalselectie" },
                { number: "03", title: "Uitvoering", description: "Vakkundige realisatie met oog voor detail" },
                { number: "04", title: "Oplevering", description: "Perfecte afwerking en nazorg" }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div className="absolute -left-4 -top-4 text-6xl font-light text-[#B0926A]/10 group-hover:text-[#B0926A]/20 transition-colors duration-300">
                    {step.number}
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-white text-xl font-medium mb-4">{step.title}</h3>
                    <p className="text-white/60">{step.description}</p>
                  </div>
                  <motion.div
                    className="absolute bottom-0 left-0 h-[1px] bg-[#B0926A]"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Luxe Team Section */}
        <section className="relative py-32 bg-[#0C0C0C]">
          <div className="max-w-7xl mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-24"
            >
              <h3 className="text-[#B0926A] text-sm tracking-[0.3em] mb-4">ONS TEAM</h3>
              <h2 className="text-4xl md:text-5xl text-white font-light">De <span className="font-bold">Experts</span> achter BOP</h2>
            </motion.div>

            <div className="grid grid-cols-3 gap-12">
              {[
                { name: "Jan de Vries", role: "Hoofdarchitect", image: "https://i.imgur.com/CL4OhQE.jpeg" },
                { name: "Peter van Dijk", role: "Senior Projectmanager", image: "https://i.imgur.com/CL4OhQE.jpeg" },
                { name: "Emma Bakker", role: "Interieur Designer", image: "https://i.imgur.com/CL4OhQE.jpeg" }
              ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <motion.div
                  className="relative h-[400px] overflow-hidden mb-6"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${member.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-300" />
                </motion.div>
                <h3 className="text-white text-xl font-medium mb-2">{member.name}</h3>
                <p className="text-[#B0926A]">{member.role}</p>
              </motion.div>
            ))}
            </div>
          </div>
        </section>

        {/* Luxe Values Section */}
        <section className="relative py-32 bg-[#0C0C0C]">
          <div className="max-w-7xl mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-24"
            >
              <h3 className="text-[#B0926A] text-sm tracking-[0.3em] mb-4">ONZE WAARDEN</h3>
              <h2 className="text-4xl md:text-5xl text-white font-light">Waar wij voor <span className="font-bold">Staan</span></h2>
            </motion.div>

            <div className="grid grid-cols-3 gap-16">
              {[
                { 
                  title: "Kwaliteit", 
                  description: "Wij streven naar perfectie in elk detail van uw project",
                  icon: "◆"
                },
                { 
                  title: "Innovatie", 
                  description: "Moderne oplossingen met respect voor traditie",
                  icon: "◇"
                },
                { 
                  title: "Duurzaamheid", 
                  description: "Toekomstbestendige keuzes voor uw investering",
                  icon: "○"
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group text-center"
                >
                  <div className="text-[#B0926A] text-4xl mb-6 group-hover:scale-110 transition-transform duration-500">
                    {value.icon}
                  </div>
                  <h3 className="text-white text-xl font-medium mb-4">{value.title}</h3>
                  <p className="text-white/60">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Luxe Testimonials Section */}
        <section className="relative py-32 bg-[#0C0C0C]">
          <div className="max-w-7xl mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-24"
            >
              <h3 className="text-[#B0926A] text-sm tracking-[0.3em] mb-4">TESTIMONIALS</h3>
              <h2 className="text-4xl md:text-5xl text-white font-light">Wat onze <span className="font-bold">Klanten</span> zeggen</h2>
            </motion.div>

            <div className="grid grid-cols-2 gap-12">
              {[
                {
                  quote: "BOP heeft onze visie perfect vertaald naar realiteit. Een geweldige ervaring.",
                  author: "Familie van der Berg",
                  project: "Villa Wassenaar"
                },
                {
                  quote: "Professionaliteit en perfectie in elk detail. Zeer tevreden met het eindresultaat.",
                  author: "M. de Groot",
                  project: "Penthouse Rotterdam"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/5 p-12 relative group"
                >
                  <div className="text-[#B0926A] text-6xl absolute -top-6 left-8 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                    "
                  </div>
                  <p className="text-white text-xl font-light mb-8 relative z-10">
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{testimonial.author}</p>
                      <p className="text-[#B0926A] text-sm">{testimonial.project}</p>
                    </div>
                    <motion.div
                      className="w-12 h-[1px] bg-[#B0926A]"
                      whileHover={{ width: 64 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Luxe Awards Section */}
        <section className="relative py-32 bg-[#0C0C0C]">
          <div className="max-w-7xl mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-24"
            >
              <h3 className="text-[#B0926A] text-sm tracking-[0.3em] mb-4">ERKENNINGEN</h3>
              <h2 className="text-4xl md:text-5xl text-white font-light">Onze <span className="font-bold">Awards</span></h2>
            </motion.div>

            <div className="grid grid-cols-4 gap-8">
              {[
                "Best Luxury Home 2023",
                "Sustainable Design Award",
                "Architecture Excellence",
                "Innovation in Construction"
              ].map((award, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="text-[#B0926A] text-4xl mb-4 group-hover:scale-110 transition-transform duration-500">
                    ★
                  </div>
                  <p className="text-white text-sm tracking-wider">{award}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </AnimatePresence>
  );
} 