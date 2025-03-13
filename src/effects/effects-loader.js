class EffectBase {
    constructor() {
        this.editor = document.getElementById('editor');
        this.maxHits = 1000;
        this.hitCount = 0;
        this.isActive = false;
    }

    playSound(soundElement, fallbackIndex = 0) {
        if (soundElement) {
            soundElement.volume = 0.3;
            soundElement.play().catch(e => {
                console.log("Error reproduciendo sonido local, intentando fallback", e);
                if (this.fallbackSoundUrls && this.fallbackSoundUrls[fallbackIndex]) {
                    const fallbackSound = new Audio(this.fallbackSoundUrls[fallbackIndex]);
                    fallbackSound.volume = 0.3;
                    fallbackSound.play().catch(err => console.log("No se pudo reproducir sonido", err));
                }
            });
        }
    }

    initialize() {
    }
    
    enable() {
        console.log(`Enabling effect: ${this.constructor.name}`);
        this.isActive = true;
    }
    
    disable() {
        console.log(`Disabling effect: ${this.constructor.name}`);
        this.isActive = false;
    }

    handleClick(e) {
        if (!this.isActive) return;
        console.error('handleClick method must be implemented by subclass');
    }
}

export { EffectBase };
