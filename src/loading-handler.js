(function() {
    const loadingMessages = [
        "Loading guns...",
        "Calibrating weapons...",
        "Preparing destruction sequence...",
        "Warming up flamethrower...",
        "Sharpening hammer...",
        "Counting bullets...",
        "Polishing explosives...",
        "Installing chaos module...",
        "Setting destruction level to maximum...",
        "Loading evil laugh...",
        "Disabling mercy protocols...",
        "Converting coffee to destruction energy...",
        "Initializing mayhem...",
        "Downloading destruction patterns...",
        "Breaking physics engine...",
        "Bypassing safety features..."
    ];

    function cycleMessages() {
        const messageElement = document.getElementById('loading-message');
        let currentIndex = 0;
        
        setInterval(() => {
            messageElement.textContent = loadingMessages[currentIndex];
            currentIndex = (currentIndex + 1) % loadingMessages.length;
        }, 1500);
    }

    cycleMessages();

    window.addEventListener('load', () => {
        setTimeout(() => {
            const loadingOverlay = document.getElementById('loading-overlay');
            loadingOverlay.classList.add('hidden');
            
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 300);
        }, 2000);
    });
})();
