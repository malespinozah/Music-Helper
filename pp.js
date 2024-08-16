window.onload = function() {
    
    /* COVER-IMAGE */
    // Array of image URLs
    var images = [
    'url(images/image1.jpg)',
    'url(images/image2.jpg)',
    'url(images/image3.png)'];
        
    // Selecting all cImages with the class name 'imageDiv'
    var cImages = document.getElementsByClassName('cover-image');
    
    // Looping through each div and assign a background image from the array
    for (var i = 0; i < cImages.length; i++) {
        
        // Make sure the index is within the bounds of the images array
        if (i < images.length) {
            cImages[i].style.backgroundImage = images[i];
            cImages[i].style.backgroundSize = 'cover';  // Cover the entire div
            cImages[i].style.backgroundPosition = 'center'; // Center the background image
        }
    }
    
    /* ____________________________________________*/
    
    /* VARIABLES - getElementById */
    var playlist1 = document.getElementById('container-plist1');
    var playlist2 = document.getElementById('container-plist2');
    var playlist3 = document.getElementById('container-plist3');
    var progressBar = document.getElementById("progressBar");
    var starTime = document.getElementById("startTime");
    var endTime = document.getElementById("endTime");
    var cuSong = document.getElementById("cuSong");
    var cuArtist = document.getElementById("cuArtist");
    var btnStart = document.getElementById("btnStart");
    var btnReset = document.getElementById("btnReset");
    var counter1 = document.getElementById("counter1");
    var counter2 = document.getElementById("counter2");
    var counter3 = document.getElementById("counter3");
    var timerInput = document.getElementById("timerCount");

    /* GLOBAL VARIABLES */
    var audio;
    var currentTitle;
    var currentArtist;
    
    /* SONG PLAYLIST ARRAYS*/
    // This will group the songs in each playlist respectively
    
    var list1 = [
        { title: 'Symptoms', artist: 'Ashley Tisdale', audioSrc: 'songs/Symptoms.mp3' },
        { title: 'Please Be Mine', artist: 'Jonas Brothers', audioSrc: 'songs/Please Be Mine.mp3' },
        { title: 'Shape Of My Heart', artist: 'Backstreet Boys', audioSrc: 'songs/Shape Of My Heart.mp3' },
        { title: 'Sidi Mansour', artist: 'Saber Rebai', audioSrc: 'songs/Sidi Mansour.mp3' },
    ];
    
    var list2 = [
        { title: 'Mood', artist: 'DPR IAN', audioSrc: 'songs/Mood.mp3'},
        { title: 'Judas', artist: 'Lady Gaga', audioSrc: 'songs/Judas.mp3'},
        { title: 'Tabú', artist: 'Pablo Alborán & Ava Max', audioSrc: 'songs/Tabú.mp3'},
        { title: 'Savage', artist: 'VIXX', audioSrc: 'songs/SAVAGE.mp3'},
    ];
    
    var list3 = [
        { title: 'Tusa', artist: 'Karol G ft. Nicki Minaj', audioSrc: 'songs/Tusa.mp3'},
        { title: 'Livin la Vida Loca', artist: 'Ricky Martin', audioSrc: 'songs/Livin la Vida Loca.mp3'},
        { title: 'Ven Conmigo', artist: 'Daddy Yankee ft. Prince Royce', audioSrc: 'songs/Ven Conmigo.mp3'},
        { title: 'El Taxi', artist: 'Pitbull ft. Sensato & Osmani Garcia', audioSrc: 'songs/Taxi.mp3'}
    ];
    
    /* DISPLAY INFO */
    // Shows song info into the songBox container for each playList
    function displayInfo() {
        list1.forEach(
            function(song, index) {
            
            // Get the container element for the current song
            var songBox = document.getElementById('song' + (index + 1));
    
            // Create elements for song title and artist
            var songTitle = document.createElement('div');
            songTitle.classList.add('nameSong');
            songTitle.innerHTML = song.title;
    
            var songArtist = document.createElement('div');
            songArtist.classList.add('authorSong');
            songArtist.innerHTML = song.artist;
        
            // Append the elements to the songBox
            songBox.appendChild(songTitle);
            songBox.appendChild(songArtist);
        });
    
        list2.forEach(
            function(song, index) {
            
            var songBox = document.getElementById('song' + (index + 5));
    
            var songTitle = document.createElement('div');
            songTitle.classList.add('nameSong');
            songTitle.innerHTML = song.title;
    
            var songArtist = document.createElement('div');
            songArtist.classList.add('authorSong');
            songArtist.innerHTML = song.artist;
        
            songBox.appendChild(songTitle);
            songBox.appendChild(songArtist);
        });
    
        list3.forEach(
            function(song, index) {
            
            var songBox = document.getElementById('song' + (index + 9));
    
            var songTitle = document.createElement('div');
            songTitle.classList.add('nameSong');
            songTitle.innerHTML = song.title;
    
            var songArtist = document.createElement('div');
            songArtist.classList.add('authorSong');
            songArtist.innerHTML = song.artist;
        
            songBox.appendChild(songTitle);
            songBox.appendChild(songArtist);
        });
    }
    
    /* SELECT PLAYLIST AND PLAY */
    // Deselects all containers
    function deselectAll() {
        playlist1.classList.remove('selected');
        playlist2.classList.remove('selected');
        playlist3.classList.remove('selected');
    }
    
    /* FUNCTION PLAYSONG */
    // Each current song with their info showing in the player
    function playSong(song, index, startIndex) {     
        
        if (index >= 0 && index < song.length) {

        // Variables for info songs
        audio = new Audio(song[index].audioSrc);
        currentTitle = song[index].title;
        currentArtist = song[index].artist;
    
        console.log('Current song:', currentTitle);
        console.log('Current artist:', currentArtist);
    
        // Updates song boxes to reflect which song is currently playing
        song.forEach((songItem, index) => {
            var songBox = document.getElementById('song' + (index + 1 + startIndex));
            if (songBox) {
                if (songItem.title === currentTitle) {
                    songBox.style.background = "#1d021a";
                } else {
                    songBox.style.background = ""; // Reset the background for non-matching songs
                }
            }
        });
        
        // Defines the event listener function separately
        function onSongEnd() {
        
            // Removes event listener to avoid memory leaks
            audio.removeEventListener('ended', onSongEnd);
            
            // Plays the next song
            playSong(song, index + 1, startIndex);
        }
    
        // Event listener to play the next song when the current one ends
        audio.addEventListener('ended', onSongEnd);
    
        // Event listener to update song box style when song is paused
        audio.addEventListener('pause', function() {
            song.forEach((songItem, i) => {
                var songBox = document.getElementById('song' + (i + 1 + startIndex));
                if (songBox) {
                    songBox.style.background = ""; // Resets the background for all song boxes
                }
            });

            // Resets all information from current song playing
            progressBar.style.width = '0%';
            starTime.innerHTML = "00:00";
            endTime.innerHTML = "00:00";
            cuArtist.innerHTML = "";
            cuSong.innerHTML = "";
            deselectAll();
        });
        
        // Updates progress bar as the song progresses
        audio.addEventListener('timeupdate', function() {
            var progress = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = progress + '%';
            starTime.innerHTML = formatTime1(audio.currentTime);
            endTime.innerHTML = formatTime1(audio.duration - audio.currentTime);
        });
    
        // Play the audio and current info
        audio.play();
        cuSong.innerHTML = currentTitle;
        cuArtist.innerHTML = currentArtist;
    }
    else {
        console.log("Invalid song index.");}
    }
    
    /* LISTENERS FOR SELECTING PLAYLIST */
    // Click event listeners for each container
    playlist1.addEventListener('click', function() {
        deselectAll();
        playPlaylist(list1);
    });
    
    playlist2.addEventListener('click', function() {
        deselectAll();
        playPlaylist(list2);
    });
    
    playlist3.addEventListener('click', function() {
        deselectAll();
        playPlaylist(list3);
    });
        
    /* FUNCTION PLAYLIST */
    // Each list playing when selected
    function playPlaylist(list) {
        var selectedPlaylist;
        var selectedContainer;
        var selectedCounter;
        
        if (list === list1) {
            selectedPlaylist = list1;
            selectedContainer = playlist1;
            selectedCounter = counter1;
        } else if (list === list2) {
            selectedPlaylist = list2;
            selectedContainer = playlist2;
            selectedCounter = counter2;
        } else {
            selectedPlaylist = list3;
            selectedContainer = playlist3;
            selectedCounter = counter3;
        }
    
        // Adds 'selected' class to the selected playlist container
        selectedContainer.classList.add('selected');

        // Logs debug information for checking playlist is correctly selected
        console.log("Selected playlist:", selectedPlaylist);
        console.log("Selected counter:", selectedCounter);
    
        // Starts the timer when the "Start" button is clicked
        btnStart.onclick = function() {

            // Gets the input value
            var input = timerInput.value.trim();
            var timePattern = /^\d{2}:\d{2}:\d{2}$/;

            // Validation for input 
            if (!input.match(timePattern)) {
                alert("Please enter the time in HH:MM:SS format.");
                // Clears the input field
                timerInput.value = "00:00:00";
                // Prevents further execution
                return;
            }
            
            // Starts the timer
            startTimer(selectedCounter);

            // Plays the playlist after timer is started
            playSong(selectedPlaylist, 0, calculateStartingIndex(list));
        };
    }

    /* FUNCTION CALCULATE STARTING INDEX */
    // Function to calculate the starting index for the playlists
    function calculateStartingIndex(list) {

        // It will store the computed starting index based on the input list.
        var startingIndex = 0;
        
        if (list === list2) {
        startingIndex = list1.length;
        } 
        else if (list === list3) {
        startingIndex = list1.length + list2.length;
        }
        return startingIndex;
    }
    
    /* FUNCTION START TIMER */
    // The timer will run
    function startTimer(selectedCounter) {

        // Disables the input field
        timerInput.disabled = true;

        // Gets the current time
        var currentTime = new Date();
    
        // Formats the current time
        var formattedCurrentTime =  formatTime2(currentTime.getHours(),currentTime.getMinutes(), currentTime.getSeconds())
    
        // Gets the input value
        var input = timerInput.value.trim();

        // Formats the time when the timer will finish
        var [hours, minutes, seconds] = input.split(":").map(Number);
        var totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        var endTime = new Date(currentTime.getTime() + totalTimeInSeconds * 1000);
        var formattedEndTime = formatTime2(endTime.getHours(), endTime.getMinutes(), endTime.getSeconds());

        // Show alert with current time and end time
        alert("Timer Started!\nCurrent Time: " + formattedCurrentTime + "\nThis timer will end: " + formattedEndTime);
    
        // Log to console to check if timer started
        console.log("Timer started.");

        /* LOCAL STORAGE */
        // Retrieves the previously accumulated time from localStorage
        var accumulatedTime = localStorage.getItem('accumulatedTime' + selectedCounter.id) || '00:00:00';

        // Splits the accumulated time to extract hours, minutes, and seconds
        var [accumulatedHours, accumulatedMinutes, accumulatedSeconds] = accumulatedTime.split(":").map(Number); //map(Number) serves to convert each string element in the array into an integer. 

        // Calculates the total accumulated seconds
        var totalAccumulatedSeconds = accumulatedHours * 3600 + accumulatedMinutes * 60 + accumulatedSeconds;
         
        // Calculates the total input seconds
        var totalInputSeconds = hours * 3600 + minutes * 60 + seconds;
         
        // Adds the total input seconds to the total accumulated seconds
        var newTotalSeconds = totalInputSeconds + totalAccumulatedSeconds;
         
        // Convert the new total seconds back to hours, minutes, and seconds
        var newHours = Math.floor(newTotalSeconds / 3600);
        var newMinutes = Math.floor((newTotalSeconds % 3600) / 60);
        var newSeconds = newTotalSeconds % 60;
         
        // Formats the new time
        var newTime = formatTime2(newHours, newMinutes, newSeconds);
         
        // Saves the new accumulated time to localStorage
        localStorage.setItem('accumulatedTime' + selectedCounter.id, newTime);
         
        // Updates the counter with the new accumulated time in playlist selected
        selectedCounter.innerHTML = newTime;
         
        /* COUNTING TIMER */
        // Updates input field every second
        var timerInterval = setInterval(function() {
            
            // Calculates remaining hours, minutes, and seconds
            var remainingHours = Math.floor(totalTimeInSeconds / 3600);
            var remainingMinutes = Math.floor((totalTimeInSeconds % 3600) / 60);
            var remainingSeconds = totalTimeInSeconds % 60;
    
            // Updates input value
            timerInput.value = formatTime2(remainingHours, remainingMinutes, remainingSeconds);

            // Decrements total time
            totalTimeInSeconds--;

            // Plays voice message one second before the timer ends
            if (totalTimeInSeconds === 0) {
                voiceMessage("Your time has finished.");
                pauseCurrentSong();
                
                // Enables the input field
                timerInput.disabled = false;
            }

            // Checks if timer has reached 0
            if (totalTimeInSeconds < 0) {
                clearInterval(timerInterval);
                console.log("Timer Finished!");
                alert("Time is over!");

                 // Enables the input field
                 timerInput.disabled = false;
            }
        }, 1000);
    }

    /* FUNCTION PAUSE CURRENT SONG */
    // This will stop the current song
    function pauseCurrentSong() {

        // Pause the audio
        if (audio) {
            audio.pause();
        }
    }

   /* FUNCTION FORMAT TIME 1 - SECONDS */
   // Finding the seconds-min while music plays and ends
   function formatTime1(seconds) {
        var minutes = Math.floor(seconds / 60);
        var remainingSeconds = Math.floor(seconds % 60);
        return minutes + ':' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
    }

   /* FUNCTION FORMAT TIME 2 - HOURS:MINUTES:SECONDS*/
   // Standardizes the time - the output will always be in a uniform "HH:MM:SS" format
   function formatTime2(hours, minutes, seconds) {

        /*-- hours < 10 ? "0" : "" --*/
        // This expression checks if hours is less than 10
        // If true, it prepends a "0" to make it two digits (e.g., 9 becomes 09)
        // If false (i.e., hours is 10 or greater), it adds nothing

        // minutes < 10 ? "0" : "" --> same logic as hours

        /*-- seconds < 10 ? "0" : "" --*/
        // This checks if seconds is less than 10
        // If true, a "0" is prepended to make the seconds two digits 

        return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }

    /* FUNCTION VOICE MESSAGE */
    // This will play a text-to-speech (TTS) 
    function voiceMessage(text) {

        // Checks whether the speechSynthesis property exists in the window object
        // This is a feature provided by modern browsers to convert text into speech
        if ('speechSynthesis' in window) {

            // If the browser supports speech synthesis, a new instance of SpeechSynthesisUtterance is created
            const speech = new SpeechSynthesisUtterance(text);

            // Sets the language for the speech synthesis
            speech.lang = 'en-US';

            // This initiates the process of speaking the text using the browser's speech synthesis capabilities
            window.speechSynthesis.speak(speech);
        } else {

            // Alert message indicating that the browser doesn't support text-to-speech functionality
            alert("Sorry, your browser does not support text to speech!");
        }
    }
    
    /* FUNCTION UPDATETIME */
    // Updates the current time
    function updateTime() {
        var now = new Date();
        var options = { hour: 'numeric', minute: 'numeric' };
        var timeString = now.toLocaleTimeString([], options); // Gets time in user's local setting without seconds
        document.getElementById('currentTime').innerHTML = timeString;
    }
    
    // Update time every second
    setInterval(updateTime, 1000);
    
    /* FUNTION RESET */
    // Resets counters from all playlists
    function resetPlaylistTimes() {

        // Clears local storage
        localStorage.clear();

        // Resets counters
        counter1.innerHTML = "00:00:00";
        counter2.innerHTML = "00:00:00";
        counter3.innerHTML = "00:00:00";
        alert("All playlist were cleared!");
    }
    
    /* CALLING FUNCTIONS */
    displayInfo();
    updateTime();

    /* RESET BUTTON */
    btnReset.onclick = resetPlaylistTimes;

}
    