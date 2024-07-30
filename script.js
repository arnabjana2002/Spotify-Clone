console.log("Hello World");

let currentSong = new Audio();
let songs;

function convertTimeToMMSS(currentTime, duration) {
  function formatTime(seconds) {
    const roundedSeconds = Math.round(seconds);
    const minutes = Math.floor(roundedSeconds / 60);
    const remainingSeconds = roundedSeconds % 60;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = remainingSeconds.toString().padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  const formattedCurrentTime = formatTime(currentTime);
  const formattedDuration = formatTime(duration);

  return {
    currentTime: formattedCurrentTime,
    duration: formattedDuration,
  };
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

playMusic = (track, pause = false) => {
  // let audio = new Audio("\Songs\\" + track +".mp3");
  currentSong.src = "Songs\\" + track + ".mp3";
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function main() {
  // Get the list of all songs
  songs = await getSongs();
  playMusic(songs[0].split(".")[0], true);
  // console.log(songs);

  // Show all the songs in the list
  let songUL = document
    .querySelector(".song-list")
    .getElementsByTagName("ul")[0];
  for (let song of songs) {
    song = song.split(".mp3")[0];
    song = song.replaceAll("%2C", ",");

    // songUL.innerHTML = songUL.innerHTML + `<li> ${song.replaceAll("%20"," ")} </li>`;
    songUL.innerHTML =
      songUL.innerHTML +
      `<li><img class="invert" src="muisc.svg" alt="">
                <div class="info">
                  <div>${song.replaceAll("%20", " ")}</div>
                  <div>${song.replaceAll("%20", " ").split(" - ")[1]}</div>
                  
                </div>
                <div class="playnow">
                  <img src="play.svg" alt="" class="">
                </div>
              </li>`;
  }

  // Add Event Listerner to Each Song in the List
  Array.from(
    document.querySelector(".song-list ul").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });

  // console.log(Array.from(document.querySelector(".song-list ul").getElementsByTagName("li")))

  // Add Event Listener to Previous, Play, Next
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });
  // Previous
  previous.addEventListener("click",()=>{
    let currentIndex = songs.indexOf(currentSong.src.split("/Songs/")[1]);
    if(currentIndex > 0){
      playMusic(songs[currentIndex-1].split(".")[0]);
    }
  })
  // Next
  next.addEventListener("click",()=>{
    let currentIndex = songs.indexOf(currentSong.src.split("/Songs/")[1]);
    if(currentIndex < songs.length-1){
      playMusic(songs[currentIndex+1].split(".")[0]);
    }
  })




  // Listen for Time Update Event
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${
      convertTimeToMMSS(currentSong.currentTime, currentSong.duration)
        .currentTime
    }/${
      convertTimeToMMSS(currentSong.currentTime, currentSong.duration).duration
    }`;
    document.querySelector(".circle").style.left = `${
      (currentSong.currentTime / currentSong.duration) * 100
    }%`;
  });

  // Add Event Listener to Seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    // console.log(e.target.getBoundingClientRect().width,e.offsetX) //-> total width & where I clicked
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = `${percent}%`;
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Add Event Listener for Hamburger
  document.querySelector(".hamburger").addEventListener("click",(e)=>{
    document.querySelector(".left-side").style.left = "0";
  })
  
  // Add Event Listener for Close Button
  document.querySelector(".close").addEventListener("click",(e)=>{
    document.querySelector(".left-side").style.left = "-100%";
  })

  /*
  // Play the first song
  var audio = new Audio(songs[0]);
  //   audio.play();

  audio.addEventListener("loadeddata", () => {
    let duration = audio.duration;
    console.log(audio.duration, audio.currentSrc, audio.currentTime);
  });
  */
}

main();
