console.log('mh.js loaded');

// Tus listas de canciones
const playlists = [
  {
    name: 'Relaxing me',
    coverImage: 'images/image1.jpg',
    songs: [
      { title: 'Symptoms', artist: 'Ashley Tisdale', audioSrc: 'songs/Symptoms.mp3' },
      { title: 'Please Be Mine', artist: 'Jonas Brothers', audioSrc: 'songs/Please Be Mine.mp3' },
      { title: 'Shape Of My Heart', artist: 'Backstreet Boys', audioSrc: 'songs/Shape Of My Heart.mp3' },
      { title: 'Sidi Mansour', artist: 'Saber Rebai', audioSrc: 'songs/Sidi Mansour.mp3' }
    ]
  },
  {
    name: 'Thinking of you',
    coverImage: 'images/image2.jpg',
    songs: [
      { title: 'Mood', artist: 'DPR IAN', audioSrc: 'songs/Mood.mp3' },
      { title: 'Judas', artist: 'Lady Gaga', audioSrc: 'songs/Judas.mp3' },
      { title: 'Tabú', artist: 'Pablo Alborán & Ava Max', audioSrc: 'songs/Tabú.mp3' },
      { title: 'Savage', artist: 'VIXX', audioSrc: 'songs/SAVAGE.mp3' }
    ]
  },
  {
    name: 'Party night',
    coverImage: 'images/image3.png',
    songs: [
      { title: 'Tusa', artist: 'Karol G ft. Nicki Minaj', audioSrc: 'songs/Tusa.mp3' },
      { title: 'Livin la Vida Loca', artist: 'Ricky Martin', audioSrc: 'songs/Livin la Vida Loca.mp3' },
      { title: 'Ven Conmigo', artist: 'Daddy Yankee ft. Prince Royce', audioSrc: 'songs/Ven Conmigo.mp3' },
      { title: 'El Taxi', artist: 'Pitbull ft. Sensato & Osmani Garcia', audioSrc: 'songs/Taxi.mp3' }
    ]
  }
];

// variables globales
let selectedPlaylistIndex = null;
let audio = new Audio();
let currentSongIndex = 0;
let countdownInterval = null;

// Helper: valida formato HH:MM:SS
function isValidTimerString(s) {
  return /^\d{2}:\d{2}:\d{2}$/.test(s);
}

function parseTimerToSeconds(str) {
  const parts = String(str).split(':').map(n => parseInt(n, 10));
  if (parts.length !== 3 || parts.some(isNaN)) return 0;
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

function formatSecondsToHHMMSS(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return [hh, mm, ss].map(n => String(n).padStart(2, '0')).join(':');
}

// Función para generar la interfaz
function displayPlaylists() {
  console.log('displayPlaylists running');
  const container = document.getElementById('container-playlists');
  if (!container) {
    console.warn('container-playlists not found');
    return; // seguridad si el DOM no existe
  }
  container.innerHTML = ''; // limpiar

  playlists.forEach((playlist, pIndex) => {
    const playlistWrapper = document.createElement('div');
    playlistWrapper.classList.add('container-playlist');

    const plDiv = document.createElement('div');
    plDiv.classList.add('playlist');

    // Cover Image
    const coverDiv = document.createElement('div');
    coverDiv.classList.add('cover-image');
    coverDiv.style.backgroundImage = `url(${playlist.coverImage})`;
    coverDiv.style.backgroundSize = 'cover';
    coverDiv.style.backgroundPosition = 'center';
    plDiv.appendChild(coverDiv);

    // Playlist name
    const plName = document.createElement('div');
    plName.classList.add('Pname');
    plName.textContent = playlist.name;
    plDiv.appendChild(plName);

    // Song list
    const songList = document.createElement('div');
    songList.classList.add('LSongs');

    playlist.songs.forEach((song, sIndex) => {
      const songBox = document.createElement('div');
      songBox.classList.add('Songbox');
      songBox.id = `song-${pIndex}-${sIndex}`;

      const titleDiv = document.createElement('div');
      titleDiv.classList.add('nameSong');
      titleDiv.textContent = song.title;

      const artistDiv = document.createElement('div');
      artistDiv.classList.add('authorSong');
      artistDiv.textContent = song.artist;

      songBox.appendChild(titleDiv);
      songBox.appendChild(artistDiv);
      songList.appendChild(songBox);
    });

    plDiv.appendChild(songList);

    // Counter
    const counterDiv = document.createElement('div');
    counterDiv.classList.add('counter');
    counterDiv.innerHTML = `
      <div>Time playlist played</div>
      <div id="counter-${pIndex}">00:00:00</div>
    `;
    plDiv.appendChild(counterDiv);

    playlistWrapper.appendChild(plDiv);
    container.appendChild(playlistWrapper);

    // click handler para seleccionar playlist
    playlistWrapper.addEventListener('click', () => {
      console.log('playlist clicked', pIndex);
      // quitar bordes previos
      document.querySelectorAll('.container-playlist').forEach(p => p.style.border = 'none');

      // marcar seleccionado
      playlistWrapper.style.border = '2px solid white';
      selectedPlaylistIndex = pIndex;

      // habilitar controles si existen
      const timerInput = document.getElementById('timerCount');
      const btnStart = document.getElementById('btnStart');
      const btnReset = document.getElementById('btnReset');
      if (timerInput) timerInput.disabled = false;
      if (btnReset) btnReset.disabled = false;

      // habilitar start solo si el timer tiene un valor válido distinto de 00:00:00
      if (btnStart && timerInput) {
        const valid = isValidTimerString(timerInput.value) && timerInput.value !== '00:00:00';
        btnStart.disabled = !valid;
      }
    });
  });
}

// Mostrar hora local
function updateLocalTime() {
  const currentTimeDiv = document.getElementById('currentTime');
  if (!currentTimeDiv) return;
  function tick() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    currentTimeDiv.textContent = `${hh}:${mm}:${ss}`;
  }
  tick();
  setInterval(tick, 1000);
}

// Reproducción
function playPlaylist(pIndex) {
  if (pIndex === null || typeof pIndex === 'undefined') return;
  console.log('playPlaylist', pIndex);
  const playlist = playlists[pIndex];
  currentSongIndex = 0;
  playSong(playlist.songs[currentSongIndex], playlist);
}

function playSong(song, playlist) {
  console.log('playSong', song.title);
  audio.src = song.audioSrc;
  audio.play().catch(err => {
    console.warn('Audio play failed:', err);
    // si el navegador bloqueó la reproducción, pedir un gesto del usuario
    alert('Playback blocked by browser. Click anywhere on the page to allow audio.');
    const resume = () => {
      audio.play().catch(e => console.warn('Retry play failed', e));
      window.removeEventListener('click', resume);
    };
    window.addEventListener('click', resume);
  });

  const cuSongEl = document.getElementById('cuSong');
  const cuArtistEl = document.getElementById('cuArtist');
  if (cuSongEl) cuSongEl.textContent = song.title;
  if (cuArtistEl) cuArtistEl.textContent = song.artist;

  // Actualizar progress bar
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.style.width = '0%';
    audio.ontimeupdate = () => {
      const percent = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = percent + '%';
    };
  }

  // Reset progress bar cuando termina la canción
  audio.onended = () => {
    if (progressBar) progressBar.style.width = '0%';
    currentSongIndex++;
    if (currentSongIndex < playlist.songs.length) {
      playSong(playlist.songs[currentSongIndex], playlist);
    } else {
      console.log('Playlist finished');
    }
  };
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded — init');
  const timerInput = document.getElementById('timerCount');
  const btnStart = document.getElementById('btnStart');
  const btnReset = document.getElementById('btnReset');
  const messageContainer = document.getElementById('container-messages');

  // Guardar texto por defecto de messageContainer
  const defaultMessage = messageContainer ? messageContainer.textContent : '';

  // estado inicial: deshabilitados
  if (timerInput) timerInput.disabled = true;
  if (btnStart) btnStart.disabled = true;
  if (btnReset) btnReset.disabled = true;

  // construir la UI dinámica
  displayPlaylists();

  // iniciar reloj local
  updateLocalTime();

  // habilitar boton start cuando el usuario introduce un tiempo válido
  if (timerInput) {
    timerInput.addEventListener('input', () => {
      const valid = isValidTimerString(timerInput.value) && timerInput.value !== '00:00:00';
      if (btnStart) btnStart.disabled = !(valid && selectedPlaylistIndex !== null);
    });
  }

  // Start
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      console.log('Start clicked — selectedPlaylistIndex =', selectedPlaylistIndex);
      if (selectedPlaylistIndex === null) {
        if (messageContainer) messageContainer.textContent = 'Choose a playlist';
        return;
      }
      if (!timerInput || !isValidTimerString(timerInput.value) || timerInput.value === '00:00:00') {
        if (messageContainer) messageContainer.textContent = 'Please enter the time in HH:MM:SS format';
        return;
      }

      // Show timer started message
      if (messageContainer) messageContainer.textContent = 'Time Started!';

      // Parsear tiempo del input HH:MM:SS
      const totalSecondsInitial = parseTimerToSeconds(timerInput.value);
      let remaining = totalSecondsInitial;

      // reproducir playlist
      playPlaylist(selectedPlaylistIndex);

      // deshabilitar controles mientras corre
      timerInput.disabled = true;
      btnStart.disabled = true;

      // limpiar cualquier countdown previo
      if (countdownInterval) clearInterval(countdownInterval);


// Recuperar tiempo acumulado de localStorage
let accumulatedSeconds = parseTimerToSeconds(
  localStorage.getItem('accumulated-' + selectedPlaylistIndex) || '00:00:00'
);

const counterEl = document.getElementById(`counter-${selectedPlaylistIndex}`);

// Intervalo cada segundo
countdownInterval = setInterval(() => {
  remaining--;

  // Actualizar timer (cuenta regresiva)
  timerInput.value = formatSecondsToHHMMSS(remaining);

  // Actualizar acumulado
  accumulatedSeconds++;
  if (counterEl) counterEl.textContent = formatSecondsToHHMMSS(accumulatedSeconds);
  localStorage.setItem('accumulated-' + selectedPlaylistIndex, counterEl.textContent);

  if (remaining <= 0) {
    clearInterval(countdownInterval);
    countdownInterval = null;
    audio.pause();
    if (messageContainer) messageContainer.textContent = 'Time Over!';

    // Reset del timer
    timerInput.disabled = false;
    timerInput.value = '00:00:00';
    btnStart.disabled = true;
  }
}, 1000);
    });
  }

  // Reset
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      document.querySelectorAll('[id^="counter-"]').forEach(el => el.textContent = '00:00:00');
      localStorage.clear();
      if (timerInput) {
        timerInput.value = '00:00:00';
        timerInput.disabled = true;
      }
      if (btnStart) btnStart.disabled = true;
      if (btnReset) btnReset.disabled = true;
      selectedPlaylistIndex = null;
      document.querySelectorAll('.container-playlist').forEach(p => p.style.border = 'none');
      if (countdownInterval) { clearInterval(countdownInterval); countdownInterval = null; }
      audio.pause();
      const cuSongEl = document.getElementById('cuSong');
      const cuArtistEl = document.getElementById('cuArtist');
      if (cuSongEl) cuSongEl.textContent = '';
      if (cuArtistEl) cuArtistEl.textContent = '';
      if (messageContainer) {
        messageContainer.textContent = 'All playlist were cleared!';
        setTimeout(() => {
          messageContainer.textContent = defaultMessage;
        }, 5000);
      }
    });
  }
});