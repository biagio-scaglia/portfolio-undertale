import type { PortfolioData, Language } from './portfolioData'

export const portfolioTranslations: Record<Language, PortfolioData> = {
    it: {
        profile: {
            name: 'Biagio Scaglia',
            title: 'Frontend & Mobile Developer',
            subtitle: 'Product-Oriented | AI & UX/UI Mindset',
            description: [
                'Frontend e Mobile Developer con forte orientamento al prodotto,',
                'all\'esperienza utente e alla qualità del codice.',
                '',
                'Sviluppo applicazioni web e mobile moderne utilizzando React,',
                'Astro, Flutter e Kotlin, con un approccio pragmatico e orientato',
                'alla risoluzione di problemi reali.',
                '',
                'Ho esperienza nella realizzazione di landing page performanti,',
                'app mobile cross-platform, integrazione di API, sistemi AI e',
                'gestione di flussi di dati complessi.',
                '',
                'Mi contraddistingue una mentalità da product developer:',
                'considero il codice uno strumento per creare soluzioni',
                'accessibili, sostenibili e con impatto concreto.'
            ],
            tech: ['React', 'Astro', 'Flutter', 'Kotlin', 'TypeScript']
        },
        experience: [
            {
                company: 'Yumeverse Games',
                role: 'Frontend Web Developer',
                period: 'Dic 2025 – Presente',
                location: 'Da remoto',
                type: 'Remote',
                details: [
                    'Sviluppo landing page moderne e performanti con Astro,',
                    'ottimizzando UX, Core Web Vitals e SEO.',
                    '',
                    'Realizzo layout responsive per desktop, tablet e mobile,',
                    'integrando componenti interattivi con JavaScript minimale.',
                    '',
                    'Collaboro con designer UX/UI e implemento test',
                    'cross-browser per stabilità e compatibilità.'
                ]
            },
            {
                company: 'sgamapp',
                role: 'Mobile Application Developer',
                period: 'Set 2025 – Presente',
                location: 'Bari, Puglia, Italia',
                type: 'Ibrida',
                details: [
                    'Sviluppo app mobile in Kotlin e React Native per la',
                    'piattaforma sgamapp, presentata a JOB&Orienta.',
                    '',
                    'Creo soluzioni accessibili e sicure per ridurre il',
                    'digital gap e promuovere autonomia digitale.',
                    '',
                    'Demo: sgamapp.vercel.app'
                ]
            }
        ],
        skills: {
            languages: ['C', 'Java', 'JavaScript', 'TypeScript', 'PHP', 'Python', 'Ruby', 'Kotlin', 'Dart'],
            frameworks: ['Laravel', 'React', 'React Native', 'Astro', 'Flutter', 'Tailwind CSS', 'Express'],
            databases: ['MySQL', 'SQLite', 'PostgreSQL'],
            other: ['Git', 'REST API', 'AI Integration', 'Web Scraping', 'SEO', 'UX/UI Design', 'Responsive Design']
        },
        projects: [
            {
                name: 'Ruby Pulse',
                description: 'Expense Tracker CLI + Web Dashboard',
                tech: ['Ruby', 'OOP', 'Web'],
                github: 'github.com/biagio-scaglia/ruby-pulse',
                details: [
                    'Progetto intelligente per la gestione delle spese, con',
                    'interfaccia CLI e dashboard web. Permette di monitorare,',
                    'categorizzare e analizzare le spese in modo efficiente,',
                    'sfruttando Ruby per la logica backend e un\'interfaccia',
                    'web minimale per la visualizzazione dei dati.',
                    '',
                    'Ottimo esempio di integrazione OOP e web-app rapida.'
                ]
            },
            {
                name: 'Monster Hunter Compendium',
                description: 'Flutter App · Open Source',
                tech: ['Flutter', 'API', 'MHW DB'],
                github: 'github.com/biagio-scaglia/monster-hunter-compendium',
                details: [
                    'Compendium completo per Monster Hunter World, con API',
                    'ufficiali MHW DB, interfaccia pulita e navigazione intuitiva.',
                    '',
                    'Progettato per consultazione rapida e dati strutturati.'
                ]
            },
            {
                name: 'Nintendo AI',
                description: 'AI-Powered App · Flutter + Python',
                tech: ['Flutter', 'Python', 'AI', 'Scraping'],
                github: 'github.com/biagio-scaglia/Nintendo-AI',
                details: [
                    'App AI dedicata all\'universo Nintendo. Fornisce consigli',
                    'personalizzati sui giochi in base a mood e preferenze,',
                    'integra scraping da Fandom, agente Wikipedia, estrazione',
                    'immagini e sintesi AI.',
                    '',
                    'Frontend ottimizzato per mobile con card informative.'
                ]
            },
            {
                name: 'Game Price Tracker',
                description: 'Data Analysis Tool · Python',
                tech: ['Python', 'CheapShark API', 'Data Analysis'],
                github: 'github.com/biagio-scaglia/game-price-tracker',
                details: [
                    'Strumento avanzato per l\'analisi dei prezzi dei videogiochi',
                    'tramite CheapShark API, con visualizzazione grafica,',
                    'comparazioni tra store e analisi statistiche.'
                ]
            },
            {
                name: 'Japan Atlas',
                description: 'Flutter App · Travel & Culture',
                tech: ['Flutter', 'Wikipedia API', 'Travel'],
                github: 'github.com/biagio-scaglia/japan-atlas',
                details: [
                    'Guida tascabile per viaggiatori in Giappone, con dati',
                    'strutturati da Wikipedia, UX semplice e accesso rapido a',
                    'luoghi, cultura e itinerari.'
                ]
            }
        ],
        contact: {
            github: 'github.com/biagio-scaglia',
            linkedin: 'linkedin.com/in/biagioscaglia',
            instagram: 'instagram.com/biagigiosdevlog',
            email: 'biagioscaglia01@gmail.com',
            phone: '(+39) 351 315 0134',
            location: 'Bari, Puglia, Italia'
        }
    },
    en: {
        profile: {
            name: 'Biagio Scaglia',
            title: 'Frontend & Mobile Developer',
            subtitle: 'Product-Oriented | AI & UX/UI Mindset',
            description: [
                'Frontend and Mobile Developer with a strong product orientation,',
                'focus on user experience and code quality.',
                '',
                'I develop modern web and mobile applications using React,',
                'Astro, Flutter and Kotlin, with a pragmatic approach focused',
                'on solving real-world problems.',
                '',
                'I have experience in creating high-performance landing pages,',
                'cross-platform mobile apps, API integration, AI systems and',
                'complex data flow management.',
                '',
                'What sets me apart is a product developer mindset:',
                'I consider code a tool to create accessible, sustainable',
                'solutions with concrete impact.'
            ],
            tech: ['React', 'Astro', 'Flutter', 'Kotlin', 'TypeScript']
        },
        experience: [
            {
                company: 'Yumeverse Games',
                role: 'Frontend Web Developer',
                period: 'Dec 2025 – Present',
                location: 'Remote',
                type: 'Remote',
                details: [
                    'I develop modern and high-performance landing pages with Astro,',
                    'optimizing UX, Core Web Vitals and SEO.',
                    '',
                    'I create responsive layouts for desktop, tablet and mobile,',
                    'integrating interactive components with minimal JavaScript.',
                    '',
                    'I collaborate with UX/UI designers and implement',
                    'cross-browser testing for stability and compatibility.'
                ]
            },
            {
                company: 'sgamapp',
                role: 'Mobile Application Developer',
                period: 'Sep 2025 – Present',
                location: 'Bari, Puglia, Italy',
                type: 'Hybrid',
                details: [
                    'I develop mobile apps in Kotlin and React Native for the',
                    'sgamapp platform, presented at JOB&Orienta.',
                    '',
                    'I create accessible and secure solutions to reduce the',
                    'digital gap and promote digital autonomy.',
                    '',
                    'Demo: sgamapp.vercel.app'
                ]
            }
        ],
        skills: {
            languages: ['C', 'Java', 'JavaScript', 'TypeScript', 'PHP', 'Python', 'Ruby', 'Kotlin', 'Dart'],
            frameworks: ['Laravel', 'React', 'React Native', 'Astro', 'Flutter', 'Tailwind CSS', 'Express'],
            databases: ['MySQL', 'SQLite', 'PostgreSQL'],
            other: ['Git', 'REST API', 'AI Integration', 'Web Scraping', 'SEO', 'UX/UI Design', 'Responsive Design']
        },
        projects: [
            {
                name: 'Ruby Pulse',
                description: 'Expense Tracker CLI + Web Dashboard',
                tech: ['Ruby', 'OOP', 'Web'],
                github: 'github.com/biagio-scaglia/ruby-pulse',
                details: [
                    'Smart project for expense management, with',
                    'CLI interface and web dashboard. Allows monitoring,',
                    'categorizing and analyzing expenses efficiently,',
                    'using Ruby for backend logic and a minimal',
                    'web interface for data visualization.',
                    '',
                    'Great example of OOP integration and rapid web-app.'
                ]
            },
            {
                name: 'Monster Hunter Compendium',
                description: 'Flutter App · Open Source',
                tech: ['Flutter', 'API', 'MHW DB'],
                github: 'github.com/biagio-scaglia/monster-hunter-compendium',
                details: [
                    'Complete compendium for Monster Hunter World, with',
                    'official MHW DB APIs, clean interface and intuitive navigation.',
                    '',
                    'Designed for quick consultation and structured data.'
                ]
            },
            {
                name: 'Nintendo AI',
                description: 'AI-Powered App · Flutter + Python',
                tech: ['Flutter', 'Python', 'AI', 'Scraping'],
                github: 'github.com/biagio-scaglia/Nintendo-AI',
                details: [
                    'AI app dedicated to the Nintendo universe. Provides',
                    'personalized game recommendations based on mood and preferences,',
                    'integrates scraping from Fandom, Wikipedia agent, image',
                    'extraction and AI synthesis.',
                    '',
                    'Mobile-optimized frontend with informative cards.'
                ]
            },
            {
                name: 'Game Price Tracker',
                description: 'Data Analysis Tool · Python',
                tech: ['Python', 'CheapShark API', 'Data Analysis'],
                github: 'github.com/biagio-scaglia/game-price-tracker',
                details: [
                    'Advanced tool for video game price analysis',
                    'via CheapShark API, with graphical visualization,',
                    'store comparisons and statistical analysis.'
                ]
            },
            {
                name: 'Japan Atlas',
                description: 'Flutter App · Travel & Culture',
                tech: ['Flutter', 'Wikipedia API', 'Travel'],
                github: 'github.com/biagio-scaglia/japan-atlas',
                details: [
                    'Pocket guide for travelers to Japan, with',
                    'structured data from Wikipedia, simple UX and quick access to',
                    'places, culture and itineraries.'
                ]
            }
        ],
        contact: {
            github: 'github.com/biagio-scaglia',
            linkedin: 'linkedin.com/in/biagioscaglia',
            instagram: 'instagram.com/biagigiosdevlog',
            email: 'biagioscaglia01@gmail.com',
            phone: '(+39) 351 315 0134',
            location: 'Bari, Puglia, Italy'
        }
    },
    es: {
        profile: {
            name: 'Biagio Scaglia',
            title: 'Desarrollador Frontend & Mobile',
            subtitle: 'Orientado al Producto | Mentalidad AI & UX/UI',
            description: [
                'Desarrollador Frontend y Mobile con fuerte orientación al producto,',
                'enfoque en la experiencia de usuario y calidad del código.',
                '',
                'Desarrollo aplicaciones web y móviles modernas utilizando React,',
                'Astro, Flutter y Kotlin, con un enfoque pragmático orientado',
                'a la resolución de problemas reales.',
                '',
                'Tengo experiencia en la creación de landing pages de alto rendimiento,',
                'aplicaciones móviles multiplataforma, integración de API, sistemas AI y',
                'gestión de flujos de datos complejos.',
                '',
                'Me distingue una mentalidad de product developer:',
                'considero el código una herramienta para crear soluciones',
                'accesibles, sostenibles y con impacto concreto.'
            ],
            tech: ['React', 'Astro', 'Flutter', 'Kotlin', 'TypeScript']
        },
        experience: [
            {
                company: 'Yumeverse Games',
                role: 'Desarrollador Web Frontend',
                period: 'Dic 2025 – Presente',
                location: 'Remoto',
                type: 'Remoto',
                details: [
                    'Desarrollo landing pages modernas y de alto rendimiento con Astro,',
                    'optimizando UX, Core Web Vitals y SEO.',
                    '',
                    'Creo diseños responsivos para desktop, tablet y móvil,',
                    'integrando componentes interactivos con JavaScript mínimo.',
                    '',
                    'Colaboro con diseñadores UX/UI e implemento pruebas',
                    'cross-browser para estabilidad y compatibilidad.'
                ]
            },
            {
                company: 'sgamapp',
                role: 'Desarrollador de Aplicaciones Móviles',
                period: 'Sep 2025 – Presente',
                location: 'Bari, Puglia, Italia',
                type: 'Híbrida',
                details: [
                    'Desarrollo aplicaciones móviles en Kotlin y React Native para la',
                    'plataforma sgamapp, presentada en JOB&Orienta.',
                    '',
                    'Creo soluciones accesibles y seguras para reducir la',
                    'brecha digital y promover la autonomía digital.',
                    '',
                    'Demo: sgamapp.vercel.app'
                ]
            }
        ],
        skills: {
            languages: ['C', 'Java', 'JavaScript', 'TypeScript', 'PHP', 'Python', 'Ruby', 'Kotlin', 'Dart'],
            frameworks: ['Laravel', 'React', 'React Native', 'Astro', 'Flutter', 'Tailwind CSS', 'Express'],
            databases: ['MySQL', 'SQLite', 'PostgreSQL'],
            other: ['Git', 'REST API', 'AI Integration', 'Web Scraping', 'SEO', 'UX/UI Design', 'Responsive Design']
        },
        projects: [
            {
                name: 'Ruby Pulse',
                description: 'Expense Tracker CLI + Web Dashboard',
                tech: ['Ruby', 'OOP', 'Web'],
                github: 'github.com/biagio-scaglia/ruby-pulse',
                details: [
                    'Proyecto inteligente para la gestión de gastos, con',
                    'interfaz CLI y dashboard web. Permite monitorear,',
                    'categorizar y analizar gastos de manera eficiente,',
                    'utilizando Ruby para la lógica backend y una interfaz',
                    'web mínima para la visualización de datos.',
                    '',
                    'Excelente ejemplo de integración OOP y web-app rápida.'
                ]
            },
            {
                name: 'Monster Hunter Compendium',
                description: 'Flutter App · Open Source',
                tech: ['Flutter', 'API', 'MHW DB'],
                github: 'github.com/biagio-scaglia/monster-hunter-compendium',
                details: [
                    'Compendio completo para Monster Hunter World, con API',
                    'oficiales MHW DB, interfaz limpia y navegación intuitiva.',
                    '',
                    'Diseñado para consulta rápida y datos estructurados.'
                ]
            },
            {
                name: 'Nintendo AI',
                description: 'AI-Powered App · Flutter + Python',
                tech: ['Flutter', 'Python', 'AI', 'Scraping'],
                github: 'github.com/biagio-scaglia/Nintendo-AI',
                details: [
                    'App AI dedicada al universo Nintendo. Proporciona',
                    'recomendaciones personalizadas de juegos según el estado de ánimo',
                    'y preferencias, integra scraping de Fandom, agente Wikipedia,',
                    'extracción de imágenes y síntesis AI.',
                    '',
                    'Frontend optimizado para móvil con tarjetas informativas.'
                ]
            },
            {
                name: 'Game Price Tracker',
                description: 'Data Analysis Tool · Python',
                tech: ['Python', 'CheapShark API', 'Data Analysis'],
                github: 'github.com/biagio-scaglia/game-price-tracker',
                details: [
                    'Herramienta avanzada para el análisis de precios de videojuegos',
                    'mediante CheapShark API, con visualización gráfica,',
                    'comparaciones entre tiendas y análisis estadísticos.'
                ]
            },
            {
                name: 'Japan Atlas',
                description: 'Flutter App · Travel & Culture',
                tech: ['Flutter', 'Wikipedia API', 'Travel'],
                github: 'github.com/biagio-scaglia/japan-atlas',
                details: [
                    'Guía de bolsillo para viajeros a Japón, con datos',
                    'estructurados de Wikipedia, UX simple y acceso rápido a',
                    'lugares, cultura e itinerarios.'
                ]
            }
        ],
        contact: {
            github: 'github.com/biagio-scaglia',
            linkedin: 'linkedin.com/in/biagioscaglia',
            instagram: 'instagram.com/biagigiosdevlog',
            email: 'biagioscaglia01@gmail.com',
            phone: '(+39) 351 315 0134',
            location: 'Bari, Puglia, Italia'
        }
    }
}

