import { portfolioTranslations } from '../data/portfolioTranslations'
import { getCardPreviewLines, type CardData, type Language } from '../data/portfolioData'
import { getTranslations } from './i18n'
import { CARD_WIDTH, CARD_HEIGHT, CARD_SPACING, TITLE_HEIGHT, TITLE_SPACING } from '../constants/gameConstants'

export function calculateCardPositions(canvasWidth: number, _canvasHeight: number, language: Language): CardData[] {
    const portfolioData = portfolioTranslations[language]
    const t = getTranslations(language)
    const cardsPerRow = 2
    const totalWidth = cardsPerRow * CARD_WIDTH + (cardsPerRow - 1) * CARD_SPACING
    const startX = (canvasWidth - totalWidth) / 2
    const startY = TITLE_HEIGHT + TITLE_SPACING
    
    const cards: CardData[] = [
        {
            id: 'profile',
            x: startX,
            y: startY,
            w: CARD_WIDTH,
            h: CARD_HEIGHT,
            title: t.cards.profile,
            lines: getCardPreviewLines(portfolioData, 'profile', t.labels, t.cardSummaries.profile),
            iconClass: 'fa-solid fa-user'
        },
        {
            id: 'experience',
            x: startX + CARD_WIDTH + CARD_SPACING,
            y: startY,
            w: CARD_WIDTH,
            h: CARD_HEIGHT - 20,
            title: t.cards.experience,
            lines: getCardPreviewLines(portfolioData, 'experience', t.labels, t.cardSummaries.experience),
            iconClass: 'fa-solid fa-briefcase'
        },
        {
            id: 'skills',
            x: startX,
            y: startY + CARD_HEIGHT + CARD_SPACING,
            w: CARD_WIDTH,
            h: CARD_HEIGHT - 20,
            title: t.cards.skills,
            lines: getCardPreviewLines(portfolioData, 'skills', t.labels, t.cardSummaries.skills),
            iconClass: 'fa-solid fa-code'
        },
        {
            id: 'projects',
            x: startX + CARD_WIDTH + CARD_SPACING,
            y: startY + CARD_HEIGHT + CARD_SPACING,
            w: CARD_WIDTH,
            h: CARD_HEIGHT,
            title: t.cards.projects,
            lines: getCardPreviewLines(portfolioData, 'projects', t.labels, t.cardSummaries.projects),
            iconClass: 'fa-solid fa-rocket'
        },
        {
            id: 'education',
            x: startX,
            y: startY + (CARD_HEIGHT + CARD_SPACING) * 2,
            w: CARD_WIDTH,
            h: CARD_HEIGHT - 20,
            title: t.cards.education,
            lines: getCardPreviewLines(portfolioData, 'education', t.labels, t.cardSummaries.education),
            iconClass: 'fa-solid fa-graduation-cap'
        },
        {
            id: 'contact',
            x: startX + CARD_WIDTH + CARD_SPACING,
            y: startY + (CARD_HEIGHT + CARD_SPACING) * 2,
            w: CARD_WIDTH,
            h: CARD_HEIGHT - 40,
            title: t.cards.contact,
            lines: getCardPreviewLines(portfolioData, 'contact', t.labels, t.cardSummaries.contact),
            iconClass: 'fa-solid fa-envelope'
        }
    ]
    
    return cards
}

