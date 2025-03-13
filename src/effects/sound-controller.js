/**
 * Sound Controller - Manages sound state across the application
 */
class SoundController {
    constructor() {
        this.soundButton = document.getElementById('sound-control');
        this.soundIcon = this.soundButton.querySelector('.sound-icon');
        this.soundText = this.soundButton.querySelector('.sound-text');
        this.isMuted = false;
        
        // Initialize global mute state
        window.isSoundMuted = false;
        
        // Set up event listeners
        this.initialize();
    }
    
    initialize() {
        this.soundButton.addEventListener('click', () => this.toggleMute());
        
        // Check for stored preference
        const storedMuteState = localStorage.getItem('vscode-destroyer-muted');
        if (storedMuteState === 'true') {
            this.toggleMute();
        }
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        window.isSoundMuted = this.isMuted;
        
        // Update UI
        if (this.isMuted) {
            this.soundIcon.textContent = '🔇';
            this.soundText.textContent = 'Sound Off';
            this.soundButton.classList.add('muted');
        } else {
            this.soundIcon.textContent = '🔊';
            this.soundText.textContent = 'Sound On';
            this.soundButton.classList.remove('muted');
        }
        
        // Store preference
        localStorage.setItem('vscode-destroyer-muted', this.isMuted);
        
        // Stop any currently playing sounds
        if (this.isMuted) {
            document.querySelectorAll('audio').forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
        }
    }
}

// Initialize the sound controller when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.soundController = new SoundController();
});

export default SoundController;
