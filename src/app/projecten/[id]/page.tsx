'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const projectData = {
  1: {
    title: 'BOP Project',
    category: 'Luxe Renovatie',
    description: 'Een state-of-the-art renovatieproject waarbij duurzaamheid en modern design centraal staan. Dit project toont onze expertise in het creëren van eigentijdse leefruimtes met behoud van functionaliteit en comfort. De renovatie omvatte een complete transformatie van het interieur en exterieur.',
    details: {
      type: 'Residentieel',
      oppervlakte: '450m²',
      locatie: 'Rotterdam',
      status: 'Opgeleverd',
      doorlooptijd: '12 maanden',
      oplevering: '2023'
    },
    images: ['https://i.imgur.com/CL4OhQE.jpeg', 'https://i.imgur.com/CL4OhQE.jpeg', 'https://i.imgur.com/CL4OhQE.jpeg']
  },
  2: {
    title: 'Penthouse Rotterdam',
    category: 'Modern Interieur',
    description: 'Een high-end interieurproject voor een exclusief penthouse in het centrum van Rotterdam. De focus lag op het creëren van een luxueuze leefruimte met panoramisch uitzicht over de stad. Modern design werd gecombineerd met warme materialen voor een tijdloos resultaat.',
    details: {
      type: 'Residentieel',
      oppervlakte: '280m²',
      locatie: 'Rotterdam',
      status: 'Opgeleverd',
      doorlooptijd: '8 maanden',
      oplevering: '2023'
    },
    images: ['/next.svg', '/vercel.svg', '/next.svg']
  },
  3: {
    title: 'Herenhuis Amsterdam',
    category: 'Restauratie',
    description: 'Een zorgvuldige restauratie van een monumentaal herenhuis in Amsterdam, waarbij historische details in ere zijn hersteld en gecombineerd met hedendaags comfort. De originele ornamenten en glas-in-loodramen werden vakkundig gerestaureerd.',
    details: {
      type: 'Residentieel',
      oppervlakte: '320m²',
      locatie: 'Amsterdam',
      status: 'In uitvoering',
      doorlooptijd: '16 maanden',
      oplevering: '2024'
    },
    images: ['/next.svg', '/vercel.svg', '/next.svg']
  },
  4: {
    title: 'Loft Den Haag',
    category: 'Transformatie',
    description: 'Een industrieel pand in het hart van Den Haag werd getransformeerd tot een ruimtelijke loft. De industriële elementen zoals de stalen spanten en betonnen vloeren werden behouden en geïntegreerd in het nieuwe ontwerp.',
    details: {
      type: 'Residentieel',
      oppervlakte: '200m²',
      locatie: 'Den Haag',
      status: 'Opgeleverd',
      doorlooptijd: '10 maanden',
      oplevering: '2023'
    },
    images: ['/next.svg', '/vercel.svg', '/next.svg']
  }
};

// Vereenvoudigde transitie varianten
const pageTransition = {
  initial: {
    opacity: 0,
    scale: 1.1
  },
  enter: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.33, 1, 0.68, 1]
    }
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: [0.33, 1, 0.68, 1]
    }
  }
};

const contentAnimation = {
  initial: {
    opacity: 0,
    y: 20
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.33, 1, 0.68, 1]
    }
  }
};

export default function ProjectDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const projectId = parseInt(params.id);
  const project = projectData[projectId as keyof typeof projectData];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  const handleSlideChange = (index: number) => {
    setIsSliding(true);
    setCurrentImageIndex(index);
    setTimeout(() => setIsSliding(false), 400);
  };

  if (!project) {
    return null;
  }

  return (
    <motion.main
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageTransition}
      className="relative min-h-screen bg-[#0C0C0C]"
    >
      {/* Luxe Header */}
      <motion.header
        variants={contentAnimation}
        className="fixed top-0 left-0 right-0 z-40 p-8 bg-gradient-to-b from-black/80 to-transparent"
      >
        <div className="max-w-[1920px] mx-auto flex justify-between items-center">
          <motion.button
            onClick={() => router.push('/')}
            className="text-[#B0926A] flex items-center space-x-3 group"
            whileHover={{ x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-3xl">←</span>
            <span className="text-sm tracking-[0.3em] opacity-80 group-hover:opacity-100">TERUG</span>
          </motion.button>
          <div className="text-[#B0926A] text-sm tracking-[0.3em]">
            {project.category}
          </div>
        </div>
      </motion.header>

      {/* Project Intro Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${project.images[0]})` }}
          />
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(12,12,12,0.8) 0%, rgba(12,12,12,0.4) 50%, rgba(12,12,12,0.9) 100%)'
            }}
          />
        </motion.div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-8 w-full">
            <motion.div
              variants={contentAnimation}
              className="max-w-3xl"
            >
              <motion.h1 
                className="text-7xl font-bold text-white leading-tight mb-8"
                animate={{ y: isSliding ? 100 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {project.title}
              </motion.h1>
              
              <motion.div
                className="h-[2px] w-32 mb-8 overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: 128 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <div className="h-full w-full bg-gradient-to-r from-[#B0926A] via-[#D4AF37] to-[#B0926A]" />
              </motion.div>

              <motion.p
                className="text-xl text-white/80 leading-relaxed max-w-2xl"
                variants={contentAnimation}
              >
                {project.description}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Project Details Grid */}
      <motion.section
        variants={contentAnimation}
        className="bg-[#0C0C0C] py-24"
      >
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-4 gap-8">
            {Object.entries(project.details).map(([key, value], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group border border-[#B0926A]/10 p-6 hover:border-[#B0926A]/30 transition-colors duration-300"
              >
                <p className="text-[#B0926A] text-sm tracking-wider mb-2">{key}</p>
                <p className="text-white text-xl font-light">{value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Premium Image Slider */}
      <motion.section
        variants={contentAnimation}
        className="bg-[#0C0C0C] py-24"
      >
        <div className="max-w-[1920px] mx-auto">
          <div className="flex space-x-8 px-8">
            <div className="w-1/2">
              <motion.h2 
                className="text-3xl font-light text-white mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                Project <span className="font-bold">Beelden</span>
              </motion.h2>
              <motion.p
                className="text-white/60 max-w-xl leading-relaxed mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Bekijk de verschillende fases van dit project en ontdek hoe we deze transformatie
                hebben gerealiseerd met oog voor detail en kwaliteit.
              </motion.p>
              
              <div className="flex items-center space-x-4">
                {project.images.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleSlideChange(index)}
                    className={`h-1 transition-all duration-500 ${
                      currentImageIndex === index 
                        ? 'w-24 bg-[#B0926A]' 
                        : 'w-12 bg-white/30 hover:bg-[#B0926A]/50'
                    }`}
                    whileHover={{ width: 96 }}
                  />
                ))}
              </div>
            </div>
            
            <div className="w-1/2 relative h-[600px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center rounded-lg"
                    style={{ backgroundImage: `url(${project.images[currentImageIndex]})` }}
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 rounded-lg"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Project Timeline */}
      <motion.section
        variants={contentAnimation}
        className="bg-[#0C0C0C] py-24"
      >
        <div className="max-w-7xl mx-auto px-8">
          <motion.h2 
            className="text-3xl font-light text-white mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Project <span className="font-bold">Proces</span>
          </motion.h2>

          <div className="grid grid-cols-3 gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="text-[#B0926A] text-5xl font-light mb-6">01</div>
              <h3 className="text-white text-xl font-medium mb-4">Ontwerp & Planning</h3>
              <p className="text-white/60 leading-relaxed">
                Zorgvuldige planning en gedetailleerd ontwerp om de visie van de klant perfect te vertalen.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="text-[#B0926A] text-5xl font-light mb-6">02</div>
              <h3 className="text-white text-xl font-medium mb-4">Uitvoering</h3>
              <p className="text-white/60 leading-relaxed">
                Vakkundige uitvoering met focus op kwaliteit en duurzaamheid in elk detail.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="text-[#B0926A] text-5xl font-light mb-6">03</div>
              <h3 className="text-white text-xl font-medium mb-4">Oplevering</h3>
              <p className="text-white/60 leading-relaxed">
                Perfecte afwerking en persoonlijke oplevering voor maximale klanttevredenheid.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        variants={contentAnimation}
        className="bg-[#0C0C0C] py-24 border-t border-[#B0926A]/10"
      >
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-center">
            <div>
              <motion.h2 
                className="text-3xl font-light text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                Interesse in dit <span className="font-bold">Project?</span>
              </motion.h2>
              <motion.p
                className="text-white/60"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Neem contact met ons op voor meer informatie
              </motion.p>
            </div>
            
            <motion.button
              className="px-8 py-4 bg-[#B0926A] text-white text-sm tracking-wider hover:bg-[#8B7355] transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              CONTACT OPNEMEN
            </motion.button>
          </div>
        </div>
      </motion.section>
    </motion.main>
  );
} 