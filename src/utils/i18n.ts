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
            contact: 'CONTATTI'
        },
        ui: {
            readDetails: '[Z] LEGGI DETTAGLI',
            talk: '[Z] PARLA',
            skip: '[Z] o [X] per SALTARE',
            select: '[↑↓] SELEZIONA',
            confirm: '[Z] CONFERMA',
            close: '[Z] o [ESC] per CHIUDERE'
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
            contact: 'CONTACT'
        },
        ui: {
            readDetails: '[Z] READ DETAILS',
            talk: '[Z] TALK',
            skip: '[Z] or [X] to SKIP',
            select: '[↑↓] SELECT',
            confirm: '[Z] CONFIRM',
            close: '[Z] or [ESC] to CLOSE'
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
            contact: 'CONTACTO'
        },
        ui: {
            readDetails: '[Z] LEER DETALLES',
            talk: '[Z] HABLAR',
            skip: '[Z] o [X] para SALTAR',
            select: '[↑↓] SELECCIONAR',
            confirm: '[Z] CONFIRMAR',
            close: '[Z] o [ESC] para CERRAR'
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

