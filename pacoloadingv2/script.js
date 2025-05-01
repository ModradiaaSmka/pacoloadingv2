// Default music track - will play automatically when loading screen starts
const DEFAULT_MUSIC_TRACK = "music/track1.mp3"
const DEFAULT_MUSIC_TITLE = "Paco Vibes"

// Simulate loading progress
let progress = 0
const loadingBar = document.querySelector(".loading-bar")
const loadingPercentage = document.querySelector(".loading-percentage")
let musicStarted = false

// Function to update loading bar
function updateLoadingBar() {
  if (progress < 100) {
    // Simulate random progress increments
    const increment = Math.floor(Math.random() * 10) + 1
    progress = Math.min(progress + increment, 100)

    // Update loading bar width and text
    loadingBar.style.width = progress + "%"
    loadingPercentage.textContent = progress + "%"

    // Continue updating until 100%
    if (progress < 100) {
      setTimeout(updateLoadingBar, Math.random() * 1000 + 500)
    } else {
      // When loading is complete, you can trigger any final actions
      console.log("Loading complete")

      // For FiveM integration, you would typically use:
      // if (typeof DoPlayAnim === 'function') {
      //     DoPlayAnim();
      // }
    }
  }
}

// Function to attempt auto-play music
// This uses a user interaction event to trigger music playback
function attemptAutoPlayMusic() {
  if (musicStarted) return

  const musicPlayer = document.getElementById("music-player")
  const playPauseBtn = document.getElementById("play-pause-btn")

  // Check if we have a saved track or use the default
  const savedMusicPath = localStorage.getItem("pacoRoleplayMusic") || DEFAULT_MUSIC_TRACK
  const savedMusicTitle = localStorage.getItem("pacoRoleplayMusicTitle") || DEFAULT_MUSIC_TITLE

  // Set the music source
  musicPlayer.src = savedMusicPath
  document.getElementById("music-title").textContent = savedMusicTitle

  // Try to play the music
  const playPromise = musicPlayer.play()

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'
        musicStarted = true
        localStorage.setItem("pacoRoleplayMusicPlaying", "true")
        console.log("Auto-play music started successfully")
      })
      .catch((error) => {
        console.log("Auto-play prevented by browser:", error)
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'
      })
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const videoPath = localStorage.getItem("pacoRoleplayVideo") || "background.mp4"
  const videoElement = document.getElementById("background-video")

  if (!videoElement.querySelector("source")) {
    videoElement.src = videoPath
  }

  initMusicPlayer()

  setTimeout(updateLoadingBar, 1000)

  fetchPlayersData()
  loadStaffData()

  attemptAutoPlayMusic()

  document.addEventListener(
    "click",
    function onFirstClick() {
      attemptAutoPlayMusic()
      document.removeEventListener("click", onFirstClick)
    },
    { once: true },
  )

  document.addEventListener(
    "keydown",
    function onFirstKeyPress() {
      attemptAutoPlayMusic()
      document.removeEventListener("keydown", onFirstKeyPress)
    },
    { once: true },
  )
})

window.addEventListener("message", (e) => {
  if (e.data.eventName === "loadProgress") {
    progress = e.data.loadFraction * 100
    loadingBar.style.width = progress + "%"
    loadingPercentage.textContent = Math.floor(progress) + "%"
  }

  if (e.data.type === "autoPlayMusic") {
    attemptAutoPlayMusic()
  }
})

function fetchPlayersData() {
  const playersList = document.getElementById("players-list")

  playersList.innerHTML = ""

  window.addEventListener("message", (event) => {
    if (event.data.type === "playerData") {
      const players = event.data.players

      if (players && players.length > 0) {
        playersList.innerHTML = ""

        players.forEach((player) => {
          const li = document.createElement("li")
          li.innerHTML = `
            <span class="lightning"><i class="fas fa-bolt"></i></span>
            <span class="name">${player.name}</span>
            <span class="id">${player.id}</span>
          `
          playersList.appendChild(li)
        })
      } else {
        playersList.innerHTML = `
          <li>
            <span class="lightning"><i class="fas fa-bolt"></i></span>
            <span class="name">No players online</span>
            <span class="id">-</span>
          </li>
        `
      }
    }
  })

  const samplePlayers = [
    { name: "JohnDoe", id: 128 },
    { name: "CitySlick", id: 45 },
    { name: "PacoPro", id: 201 },
    { name: "Drifter", id: 177 },
    { name: "JetStream", id: 134 },
    { name: "Vortex", id: 56 },
    { name: "Ghostly", id: 187 },
    { name: "Omega", id: 94 },
    { name: "RAPIDWOLF", id: 143 },
    { name: "NOIR", id: 65 },
  ]

  samplePlayers.forEach((player) => {
    const li = document.createElement("li")
    li.innerHTML = `
      <span class="lightning"><i class="fas fa-bolt"></i></span>
      <span class="name">${player.name}</span>
      <span class="id">${player.id}</span>
    `
    playersList.appendChild(li)
  })
}

function loadStaffData() {
  const staffList = document.getElementById("staff-list")

  staffList.innerHTML = ""

  const staffMembers = [
    { name: "Paco Owner", role: "Owner" },
    { name: "Paco Admin", role: "Admin" },
    { name: "Paco Mod", role: "Moderator" },
  ]

  staffMembers.forEach((staff) => {
    const li = document.createElement("li")
    li.innerHTML = `
      <span class="lightning"><i class="fas fa-bolt"></i></span>
      <span class="name">${staff.name}</span>
      <span class="role">${staff.role}</span>
    `
    staffList.appendChild(li)
  })
}

function setCustomVideo(videoPath) {
  localStorage.setItem("pacoRoleplayVideo", videoPath)
  const videoElement = document.getElementById("background-video")
  videoElement.src = videoPath
  videoElement.load()
}

function initMusicPlayer() {
  const musicPlayer = document.getElementById("music-player")
  const playPauseBtn = document.getElementById("play-pause-btn")
  const volumeSlider = document.getElementById("volume-slider")
  const musicSettingsBtn = document.getElementById("music-settings-btn")
  const musicSettingsModal = document.getElementById("music-settings-modal")
  const closeModal = document.querySelector(".close-modal")
  const setMusicBtn = document.getElementById("set-music-btn")
  const defaultMusicSelect = document.getElementById("default-music-select")
  const customMusicUrl = document.getElementById("custom-music-url")
  const musicTitle = document.getElementById("music-title")

  const savedMusicPath = localStorage.getItem("pacoRoleplayMusic") || DEFAULT_MUSIC_TRACK
  const savedMusicTitle = localStorage.getItem("pacoRoleplayMusicTitle") || DEFAULT_MUSIC_TITLE
  const savedVolume = localStorage.getItem("pacoRoleplayMusicVolume")

  musicPlayer.src = savedMusicPath
  musicTitle.textContent = savedMusicTitle

  if (savedVolume) {
    volumeSlider.value = savedVolume
    musicPlayer.volume = savedVolume / 100
  } else {
    musicPlayer.volume = 0.7
    localStorage.setItem("pacoRoleplayMusicVolume", "70")
  }

  playPauseBtn.addEventListener("click", () => {
    if (musicPlayer.paused) {
      if (musicPlayer.src) {
        musicPlayer
          .play()
          .then(() => {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'
            localStorage.setItem("pacoRoleplayMusicPlaying", "true")
          })
          .catch((error) => {
            console.error("Error playing music:", error)
            alert("Could not play music. Please try again.")
          })
      } else {
        alert("Please select a music track first")
      }
    } else {
      musicPlayer.pause()
      playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'
      localStorage.setItem("pacoRoleplayMusicPlaying", "false")
    }
  })

  volumeSlider.addEventListener("input", () => {
    const volume = volumeSlider.value / 100
    musicPlayer.volume = volume
    localStorage.setItem("pacoRoleplayMusicVolume", volumeSlider.value)


    const volumeIcon = document.querySelector(".volume-control i")
    if (volume === 0) {
      volumeIcon.className = "fas fa-volume-mute"
    } else if (volume < 0.5) {
      volumeIcon.className = "fas fa-volume-down"
    } else {
      volumeIcon.className = "fas fa-volume-up"
    }
  })

  // Music settings modal
  musicSettingsBtn.addEventListener("click", () => {
    musicSettingsModal.style.display = "block"
  })

  closeModal.addEventListener("click", () => {
    musicSettingsModal.style.display = "none"
  })

  window.addEventListener("click", (event) => {
    if (event.target === musicSettingsModal) {
      musicSettingsModal.style.display = "none"
    }
  })

  setMusicBtn.addEventListener("click", () => {
    let musicPath = ""
    let title = ""

    if (defaultMusicSelect.value) {
      musicPath = defaultMusicSelect.value
      title = defaultMusicSelect.options[defaultMusicSelect.selectedIndex].text
    } else if (customMusicUrl.value) {
      musicPath = customMusicUrl.value
      const urlParts = customMusicUrl.value.split("/")
      title = urlParts[urlParts.length - 1].split(".")[0]
    }

    if (musicPath) {
      setMusic(musicPath, title)
      musicSettingsModal.style.display = "none"
    } else {
      alert("Please select a track or enter a custom URL")
    }
  })

  window.addEventListener("message", (event) => {
    if (event.data.type === "setMusic") {
      setMusic(event.data.path, event.data.title || "Custom Track")
    }
  })

  if (localStorage.getItem("pacoRoleplayMusicPlaying") === "true" && savedMusicPath) {
    musicPlayer.play().catch((e) => {
      console.log("Auto-play prevented by browser:", e)
    })
  }

  musicPlayer.addEventListener("play", () => {
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'
    localStorage.setItem("pacoRoleplayMusicPlaying", "true")
    musicStarted = true
  })

  musicPlayer.addEventListener("pause", () => {
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'
    localStorage.setItem("pacoRoleplayMusicPlaying", "false")
  })
}

function setMusic(musicPath, title) {
  const musicPlayer = document.getElementById("music-player")
  const musicTitle = document.getElementById("music-title")
  const wasPlaying = !musicPlayer.paused

  musicPlayer.src = musicPath
  musicTitle.textContent = title || "Custom Track"

  localStorage.setItem("pacoRoleplayMusic", musicPath)
  localStorage.setItem("pacoRoleplayMusicTitle", title)

  if (wasPlaying) {
    musicPlayer.play().catch((e) => console.log("Playback prevented:", e))
  }
}

window.setCustomVideo = setCustomVideo
window.setMusic = setMusic
window.attemptAutoPlayMusic = attemptAutoPlayMusic
