class AudioManager {
    private sounds: Map<string, HTMLAudioElement> = new Map()
    private enabled: boolean = true

    constructor() {
        this.loadSound('menu-select', '/assets/audio/selezione.mp3')
        this.loadSound('menu-confirm', '/assets/audio/selezione.mp3')
        this.loadSound('menu-quit', '/assets/audio/esc.mp3')
        this.loadSound('card-open', '/assets/audio/selezione.mp3')
        this.loadSound('card-close', '/assets/audio/selezione.mp3')
        this.loadSound('sans-speak', '/assets/audio/sans-parla.mp3')
        this.loadSound('save', '/assets/audio/salvataggio.mp3')
    }

    private loadSound(name: string, path: string): void {
        const audio = new Audio(path)
        audio.volume = 0.5
        audio.preload = 'auto'
        audio.addEventListener('error', () => {
            console.warn(`Audio file not found: ${path}`)
        })
        this.sounds.set(name, audio)
    }

    play(name: string, volume: number = 0.5): void {
        if (!this.enabled) return

        const sound = this.sounds.get(name)
        if (!sound) {
            this.playBeep(volume)
            return
        }

        const clone = sound.cloneNode() as HTMLAudioElement
        clone.volume = volume
        clone.play().catch(err => {
            console.debug('Audio play prevented:', err)
        })
    }

    private playBeep(volume: number = 0.5): void {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)

            oscillator.frequency.value = 440
            oscillator.type = 'sine'
            gainNode.gain.value = volume * 0.1

            oscillator.start()
            oscillator.stop(audioContext.currentTime + 0.1)
        } catch (err) {
            console.debug('Web Audio API not available:', err)
        }
    }

    setEnabled(enabled: boolean): void {
        this.enabled = enabled
    }

    isEnabled(): boolean {
        return this.enabled
    }
}

export const audioManager = new AudioManager()

export const playMenuSelect = () => audioManager.play('menu-select', 0.4)
export const playMenuConfirm = () => audioManager.play('menu-confirm', 0.5)
export const playMenuQuit = () => audioManager.play('menu-quit', 0.5)
export const playCardOpen = () => audioManager.play('card-open', 0.5)
export const playCardClose = () => audioManager.play('card-close', 0.4)
export const playSansSpeak = () => audioManager.play('sans-speak', 0.6)
export const playSave = () => audioManager.play('save', 0.4)

