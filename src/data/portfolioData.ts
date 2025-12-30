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
    education: Array<{
        institution: string
        degree: string
        period: string
        description?: string[]
    }>
}

// Helper to generate card preview lines (short version for canvas)
export function getCardPreviewLines(data: PortfolioData, cardId: string, labels?: { lang: string; tech: string; db: string; tools: string }, summary?: string): string[] {
    if (summary) {
        // Split summary into lines that fit the card width (approximately 40 chars per line)
        const words = summary.split(' ')
        const lines: string[] = []
        let currentLine = ''
        
        for (const word of words) {
            if ((currentLine + word).length <= 40) {
                currentLine += (currentLine ? ' ' : '') + word
            } else {
                if (currentLine) lines.push(currentLine)
                currentLine = word
            }
        }
        if (currentLine) lines.push(currentLine)
        
        return lines
    }
    
    // Fallback to old behavior if no summary provided
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
                `${data.experience[1].role}`,
                '------------------',
                `${data.experience[2].company}`,
                `${data.experience[2].role}`
            ]
        case 'education':
            return [
                `${data.education[0].institution}`,
                `${data.education[0].degree}`,
                `${data.education[0].period}`,
                '------------------',
                `${data.education[1].institution}`,
                `${data.education[1].degree}`
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
                data.contact.website ? `Website: ${data.contact.website}` : '',
                `GitHub: ${data.contact.github}`,
                `LinkedIn: ${data.contact.linkedin}`,
                data.contact.instagram ? `Instagram: ${data.contact.instagram}` : '',
                `Email: ${data.contact.email}`,
                `Phone: ${data.contact.phone}`,
                `Location: ${data.contact.location}`
            ].filter(Boolean)
        case 'education':
            return data.education.flatMap(edu => [
                `${edu.institution} · ${edu.degree}`,
                `${edu.period}`,
                '',
                ...(edu.description || []),
                ''
            ]).slice(0, -1)
        default:
            return []
    }
}

