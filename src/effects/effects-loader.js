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
        if (window.isSoundMuted) {
            console.log("Sound is muted, skipping audio playback");
            return null;
        }
        
        if (soundElement) {
            const soundClone = soundElement.cloneNode(true);
            soundClone.volume = soundElement.volume || 0.3;
            soundClone.play();
            
            soundClone.onended = () => {
                soundClone.remove();
            };
            
            return soundClone;
        }
        return null;
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
