export type Language = 'it' | 'en' | 'es'

export interface CardData {
    id: string
    x: number
    y: number
    w: number
    h: number
    title: string
    lines: string[]
    iconClass?: string
}

export interface PortfolioData {
    profile: {
        name: string
        title: string
        subtitle: string
        description: string[]
        tech: string[]
    }
    experience: Array<{
        company: string
        role: string
        period: string
        location: string
        type: string
        details?: string[]
    }>
    skills: {
        languages: string[]
        frameworks: string[]
        databases: string[]
        other: string[]
    }
    projects: Array<{
        name: string
        description: string
        tech: string[]
        link?: string
        github?: string
        details?: string[]
    }>
    contact: {
        website?: string
        github: string
        linkedin: string
        instagram?: string
        email: string
        phone: string
        location: string
    }
}

export const portfolioData: PortfolioData = {
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
}

// Helper to generate card preview lines (short version for canvas)
export function getCardPreviewLines(data: PortfolioData, cardId: string, labels?: { lang: string; tech: string; db: string; tools: string }): string[] {
    switch (cardId) {
        case 'profile':
            return [
                data.profile.name,
                data.profile.title,
                data.profile.subtitle,
                '------------------',
                ...data.profile.tech.slice(0, 3).join(', ').split(',').map(s => s.trim())
            ]
        case 'experience':
            return [
                `${data.experience[0].company}`,
                `${data.experience[0].role}`,
                `${data.experience[0].period}`,
                '------------------',
                `${data.experience[1].company}`,
                `${data.experience[1].role}`
            ]
        case 'skills':
            return [
                `${labels?.lang || 'Lang'}: ${data.skills.languages.slice(0, 4).join(', ')}`,
                `${labels?.tech || 'Tech'}: ${data.skills.frameworks.slice(0, 4).join(', ')}`,
                `${labels?.db || 'DB'}: ${data.skills.databases.join(', ')}`,
                `${labels?.tools || 'Tools'}: ${data.skills.other.slice(0, 4).join(', ')}`
            ]
        case 'projects':
            return data.projects.slice(0, 5).map(p => p.name)
        case 'contact':
            return [
                data.contact.github,
                data.contact.linkedin,
                data.contact.instagram || '',
                data.contact.email
            ].filter(Boolean)
        default:
            return []
    }
}

// Helper to get full dialog content
export function getDialogContent(data: PortfolioData, cardId: string, labels?: { programmingLanguages: string; frameworkTechnologies: string; database: string; other: string; tech: string }): string[] {
    switch (cardId) {
        case 'profile':
            return [
                data.profile.name,
                data.profile.title,
                data.profile.subtitle,
                '',
                ...data.profile.description
            ]
        case 'experience':
            return data.experience.flatMap(exp => [
                `${exp.company} · ${exp.role}`,
                `${exp.period} · ${exp.location} · ${exp.type}`,
                '',
                ...(exp.details || []),
                ''
            ]).slice(0, -1) // Remove last empty line
        case 'skills':
            return [
                labels?.programmingLanguages || 'Programming Languages:',
                data.skills.languages.join(', '),
                '',
                labels?.frameworkTechnologies || 'Framework & Technologies:',
                data.skills.frameworks.join(', '),
                '',
                labels?.database || 'Database:',
                data.skills.databases.join(', '),
                '',
                labels?.other || 'Other:',
                data.skills.other.join(', ')
            ]
        case 'projects':
            return data.projects.flatMap(proj => [
                `${proj.name} – ${proj.description}`,
                `${labels?.tech || 'Tech'}: ${proj.tech.join(', ')}`,
                proj.github ? `GitHub: ${proj.github}` : '',
                ...(proj.details || []),
                ''
            ]).slice(0, -1)
        case 'contact':
            return [
                `GitHub: ${data.contact.github}`,
                `LinkedIn: ${data.contact.linkedin}`,
                data.contact.instagram ? `Instagram: ${data.contact.instagram}` : '',
                `Email: ${data.contact.email}`,
                `Phone: ${data.contact.phone}`,
                `Location: ${data.contact.location}`
            ].filter(Boolean)
        default:
            return []
    }
}

