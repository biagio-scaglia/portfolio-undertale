export type Language = 'it' | 'en' | 'es'

export interface Translations {
    // Start Screen
    startScreen: {
        title: string
        explore: string
        quit: string
        language: string
        goodbye: string
        refreshToRestart: string
    }
    // Card Titles
    cards: {
        profile: string
        experience: string
        skills: string
        projects: string
        education: string
        contact: string
    }
    // Card Summaries
    cardSummaries: {
        profile: string
        experience: string
        skills: string
        projects: string
        education: string
        contact: string
    }
    // UI Hints
    ui: {
        readDetails: string
        talk: string
        skip: string
        select: string
        confirm: string
        close: string
        save: string
        character: string
    }
    // Dialogues
    dialogues: {
        sans: {
            greeting: string[]
            options: string[]
        }
        frisk: {
            swap: string[]
            options: string[]
        }
    }
    // Portfolio Data Labels
    labels: {
        programmingLanguages: string
        frameworkTechnologies: string
        database: string
        other: string
        tech: string
        lang: string
        db: string
        tools: string
    }
    // Save System
    save: {
        determination: string[]
        saveOption: string
        returnOption: string
        saved: string[]
        journeyContinues: string[]
    }
}

const translations: Record<Language, Translations> = {
    it: {
        startScreen: {
            title: 'PORTFOLIO DI BIAGIO',
            explore: 'ESPLORA',
            quit: 'QUIT',
            language: 'LINGUA',
            goodbye: 'ARRIVEDERCI.',
            refreshToRestart: '(Ricarica per riavviare)'
        },
        cards: {
            profile: 'PROFILE',
            experience: 'ESPERIENZA',
            skills: 'COMPETENZE',
            projects: 'PROGETTI',
            education: 'FORMAZIONE',
            contact: 'CONTATTI'
        },
        cardSummaries: {
            profile: 'Sviluppatore frontend e mobile con orientamento al prodotto. Esperienza in React, Astro, Flutter e Kotlin per creare soluzioni moderne e accessibili.',
            experience: 'Esperienze lavorative come Frontend Developer e Mobile Developer. Stage in sviluppo web con focus su qualità del codice e UX.',
            skills: 'Competenze in linguaggi di programmazione, framework moderni e strumenti di sviluppo. Esperienza con database, API e integrazione AI.',
            projects: 'Progetti personali e open source che dimostrano competenze tecniche. App mobile, tool CLI, dashboard web e integrazioni con API esterne.',
            education: 'Formazione in sviluppo web e mobile presso ITS Apulia Digital Maker. Diploma in Sistemi Informativi Aziendali con focus su programmazione.',
            contact: 'Contatti e profili social per rimanere in contatto. Disponibile per collaborazioni e opportunità lavorative nel settore tech.'
        },
        ui: {
            readDetails: '[Z] LEGGI DETTAGLI',
            talk: '[Z] PARLA',
            skip: '[Z] o [X] per SALTARE',
            select: '[↑↓] SELEZIONA',
            confirm: '[Z] CONFERMA',
            close: '[Z] o [ESC] per CHIUDERE',
            save: 'SALVA',
            character: 'PERSONAGGIO'
        },
        dialogues: {
            sans: {
                greeting: [
                    'ciao, che ci fai qui?',
                    'vuoi per caso scambiarti di posto con me',
                    'per interagire in questo portfolio?'
                ],
                options: ['SÌ', 'NO']
            },
            frisk: {
                swap: [
                    'Vuoi scambiarti di nuovo?'
                ],
                options: ['SCAMBIATI', 'ESCI']
            }
        },
        labels: {
            programmingLanguages: 'Linguaggi di Programmazione:',
            frameworkTechnologies: 'Framework & Tecnologie:',
            database: 'Database:',
            other: 'Altro:',
            tech: 'Tech:',
            lang: 'Lang:',
            db: 'DB:',
            tools: 'Tools:'
        },
        save: {
            determination: [
                '* Sei pieno di DETERMINAZIONE.',
                '',
                '  Vuoi salvare?'
            ],
            saveOption: 'SAVE',
            returnOption: 'RETURN',
            saved: [
                '* File salvato.'
            ],
            journeyContinues: [
                '* Il tuo viaggio continua.'
            ]
        }
    },
    en: {
        startScreen: {
            title: 'BIAGIO\'S PORTFOLIO',
            explore: 'EXPLORE',
            quit: 'QUIT',
            language: 'LANGUAGE',
            goodbye: 'GOODBYE.',
            refreshToRestart: '(Refresh to restart)'
        },
        cards: {
            profile: 'PROFILE',
            experience: 'EXPERIENCE',
            skills: 'SKILLS',
            projects: 'PROJECTS',
            education: 'EDUCATION',
            contact: 'CONTACT'
        },
        cardSummaries: {
            profile: 'Frontend and mobile developer with product-oriented mindset. Experience with React, Astro, Flutter and Kotlin to create modern and accessible solutions.',
            experience: 'Work experience as Frontend Developer and Mobile Developer. Internships in web development with focus on code quality and UX.',
            skills: 'Skills in programming languages, modern frameworks and development tools. Experience with databases, APIs and AI integration.',
            projects: 'Personal and open source projects demonstrating technical skills. Mobile apps, CLI tools, web dashboards and external API integrations.',
            education: 'Education in web and mobile development at ITS Apulia Digital Maker. Diploma in Business Information Systems with focus on programming.',
            contact: 'Contacts and social profiles to stay in touch. Available for collaborations and job opportunities in the tech sector.'
        },
        ui: {
            readDetails: '[Z] READ DETAILS',
            talk: '[Z] TALK',
            skip: '[Z] or [X] to SKIP',
            select: '[↑↓] SELECT',
            confirm: '[Z] CONFIRM',
            close: '[Z] or [ESC] to CLOSE',
            save: 'SAVE',
            character: 'CHARACTER'
        },
        dialogues: {
            sans: {
                greeting: [
                    'hey, what are you doing here?',
                    'do you want to swap places with me',
                    'to interact with this portfolio?'
                ],
                options: ['YES', 'NO']
            },
            frisk: {
                swap: [
                    'Do you want to swap again?'
                ],
                options: ['SWAP', 'EXIT']
            }
        },
        labels: {
            programmingLanguages: 'Programming Languages:',
            frameworkTechnologies: 'Framework & Technologies:',
            database: 'Database:',
            other: 'Other:',
            tech: 'Tech:',
            lang: 'Lang:',
            db: 'DB:',
            tools: 'Tools:'
        },
        save: {
            determination: [
                '* You are filled with DETERMINATION.',
                '',
                '  Do you want to save?'
            ],
            saveOption: 'SAVE',
            returnOption: 'RETURN',
            saved: [
                '* File saved.'
            ],
            journeyContinues: [
                '* Your journey continues.'
            ]
        }
    },
    es: {
        startScreen: {
            title: 'PORTFOLIO DE BIAGIO',
            explore: 'EXPLORAR',
            quit: 'SALIR',
            language: 'IDIOMA',
            goodbye: 'ADIÓS.',
            refreshToRestart: '(Recarga para reiniciar)'
        },
        cards: {
            profile: 'PERFIL',
            experience: 'EXPERIENCIA',
            skills: 'HABILIDADES',
            projects: 'PROYECTOS',
            education: 'EDUCACIÓN',
            contact: 'CONTACTO'
        },
        cardSummaries: {
            profile: 'Desarrollador frontend y mobile con mentalidad orientada al producto. Experiencia con React, Astro, Flutter y Kotlin para crear soluciones modernas y accesibles.',
            experience: 'Experiencia laboral como Frontend Developer y Mobile Developer. Prácticas en desarrollo web con enfoque en calidad del código y UX.',
            skills: 'Habilidades en lenguajes de programación, frameworks modernos y herramientas de desarrollo. Experiencia con bases de datos, APIs e integración AI.',
            projects: 'Proyectos personales y open source que demuestran habilidades técnicas. Apps móviles, herramientas CLI, dashboards web e integraciones con APIs externas.',
            education: 'Formación en desarrollo web y mobile en ITS Apulia Digital Maker. Diploma en Sistemas de Información Empresarial con enfoque en programación.',
            contact: 'Contactos y perfiles sociales para mantener el contacto. Disponible para colaboraciones y oportunidades laborales en el sector tecnológico.'
        },
        ui: {
            readDetails: '[Z] LEER DETALLES',
            talk: '[Z] HABLAR',
            skip: '[Z] o [X] para SALTAR',
            select: '[↑↓] SELECCIONAR',
            confirm: '[Z] CONFIRMAR',
            close: '[Z] o [ESC] para CERRAR',
            save: 'GUARDAR',
            character: 'PERSONAJE'
        },
        dialogues: {
            sans: {
                greeting: [
                    'hola, ¿qué haces aquí?',
                    '¿quieres intercambiar lugares conmigo',
                    'para interactuar con este portfolio?'
                ],
                options: ['SÍ', 'NO']
            },
            frisk: {
                swap: [
                    '¿Quieres intercambiar de nuevo?'
                ],
                options: ['INTERCAMBIAR', 'SALIR']
            }
        },
        labels: {
            programmingLanguages: 'Lenguajes de Programación:',
            frameworkTechnologies: 'Frameworks & Tecnologías:',
            database: 'Base de Datos:',
            other: 'Otros:',
            tech: 'Tech:',
            lang: 'Lang:',
            db: 'DB:',
            tools: 'Tools:'
        },
        save: {
            determination: [
                '* Estás lleno de DETERMINACIÓN.',
                '',
                '  ¿Quieres guardar?'
            ],
            saveOption: 'GUARDAR',
            returnOption: 'VOLVER',
            saved: [
                '* Archivo guardado.'
            ],
            journeyContinues: [
                '* Tu viaje continúa.'
            ]
        }
    }
}

export function getTranslations(lang: Language): Translations {
    return translations[lang]
}

export function getLanguageName(lang: Language): string {
    const names: Record<Language, string> = {
        it: 'ITALIANO',
        en: 'ENGLISH',
        es: 'ESPAÑOL'
    }
    return names[lang]
}

