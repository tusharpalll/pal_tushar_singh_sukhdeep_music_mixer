document.addEventListener('DOMContentLoaded', () => {
    let audioContext;
    let audioSources = {};
    let analyser;
    let isPlaying = false;
    let visualizerAnimationId;
    
    const soundItems = document.querySelectorAll('.sound-item');
    const dropZones = document.querySelectorAll('.drop-zone');
    const playBtn = document.getElementById('play-btn');
    const stopBtn = document.getElementById('stop-btn');
    const resetBtn = document.getElementById('reset-btn');
    const visualizer = document.getElementById('visualizer');
    const visualizerCtx = visualizer.getContext('2d');
    const audioContainer = document.getElementById('audio-container');
    
    const audioFiles = {
        drums: 'drums.mp3',
        bass: 'bass.mp3',
        melody: 'melody.mp3',
        vocals: 'vocals.mp3',
        effects: 'effects.mp3'
    };
    
    function createPlaceholderAudio() {
        for (const sound in audioFiles) {
            const audio = document.createElement('audio');
            audio.id = `audio-${sound}`;
            audio.loop = true;
            audio.src = `audio/${audioFiles[sound]}`;
            audioContainer.appendChild(audio);
        }
    }


    // Draw audio visualizer
    



      
    
    function initAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyser.connect(audioContext.destination);
        }
    }
    
    function playAllTracks() {
        if (!audioContext) initAudioContext();
        else if (audioContext.state === 'suspended') audioContext.resume();
        isPlaying = true;
        Object.values(audioSources).forEach(audio => audio.play());
        drawVisualizer();
    }
    
    function stopAllTracks() {
        Object.values(audioSources).forEach(audio => audio.pause());
        isPlaying = false;
        cancelAnimationFrame(visualizerAnimationId);
    }
    
    function resetMixer() {
        stopAllTracks();
        dropZones.forEach(zone => {
            zone.textContent = 'Drop here';
            zone.classList.remove('has-sound');
            zone.removeAttribute('data-sound');
        });
        audioSources = {};
    }
    
    function playSound(sound) {
        if (!audioContext) initAudioContext();
        const audioElement = document.getElementById(`audio-${sound}`);
        if (audioElement) {
            audioElement.currentTime = 0;
            audioElement.play();
            audioSources[sound] = audioElement;
        }
    }
    
    function initDragAndDrop() {
        soundItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.getAttribute('data-sound'));
            });
        });
        
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => e.preventDefault());
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                const sound = e.dataTransfer.getData('text/plain');
                if (sound) {
                    zone.setAttribute('data-sound', sound);
                    zone.textContent = sound;
                    zone.classList.add('has-sound');
                    playSound(sound);
                }
            });
        });
    }
    
    playBtn.addEventListener('click', playAllTracks);
    stopBtn.addEventListener('click', stopAllTracks);
    resetBtn.addEventListener('click', resetMixer);
    
    createPlaceholderAudio();
    initDragAndDrop();
    console.log('Music Mixer initialized successfully');
});
