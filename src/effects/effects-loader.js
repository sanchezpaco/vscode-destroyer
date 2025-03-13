class EffectBase {
    constructor() {
        this.editor = document.getElementById('editor');
        this.maxHits = 1000;
        this.hitCount = 0;
        this.isActive = false;
        this.isMuted = false; // Add muted state property
    }

    playSound(soundElement) {
        // Check for muted state before playing sound
        if (this.isMuted || window.isSoundMuted) {
            console.log("Sound is muted, skipping audio playback");
            return;
        }
        
        if (soundElement) {
            soundElement.volume = 0.3;
            soundElement.play()            
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
