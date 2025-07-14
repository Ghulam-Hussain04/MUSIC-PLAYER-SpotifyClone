console.log("lets write javascript")
let Currentsong = new Audio();
let Currfolder;

let songs;

function secondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/Spotify/songs/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let cardContainer = document.querySelector(".cardContainer")
    let anchors = div.getElementsByTagName("a")
    let array = Array.from(anchors)

    for (let index = 0; index < array.length; index++) {
        const e = array[index];


        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0]

            let a = await fetch(`/Spotify/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response)

            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
            <div class="play">
                <img src="img/play.svg" width="32px" height="32px" alt="">
            </div>

            <img class="cover" src="songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
    }

    //Load playlist dynamically
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {

            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })
}

async function getSongs(folder) {
    Currfolder = folder;
    let a = await fetch(`/Spotify/${folder}/`);
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")


    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/Spotify/${folder}/`)[1])
        }


    }



    let songsul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songsul.innerHTML = ""
    for (const song of songs) {
        songsul.innerHTML = songsul.innerHTML + `<li>
                            <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Harry</div>
                            </div>

                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert items-center" src="img/play.svg" alt="">
                            </div>
                        </li>`;
    }


    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {


            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })

    return songs

}
const playMusic = (track, pause = false) => {
    Currentsong.src = `/Spotify/${Currfolder}/${track}`
    //console.log(`/Spotify/songs/${track}`)


    if (!pause) {
        Currentsong.play()
        play.src = "img/pause.svg"
    }


    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"

}





async function main() {

    await getSongs("songs/cs");

    playMusic(songs[0], true)

    /* var audio = new Audio(songs[0]);
     audio.play();
 */
    await displayAlbums()
    //attach an event listerner to play ,next and previous
    play.addEventListener("click", () => {
        if (Currentsong.paused) {
            Currentsong.play()
            play.src = "img/pause.svg"
        }
        else {
            Currentsong.pause()
            play.src = "img/play.svg"
        }

    })

    //listen for time update event
    Currentsong.addEventListener("timeupdate", () => {
        console.log(Currentsong.currentTime, Currentsong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutes(Currentsong.currentTime)
            }/${secondsToMinutes(Currentsong.duration)}`
        document.querySelector(".circle").style.left =
            (Currentsong.currentTime / Currentsong.duration) * 100 + "%";
    })


    //event listener for seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

        document.querySelector(".circle").style.left = percent + "%";
        Currentsong.currentTime = ((Currentsong.duration) * (percent / 100));
    })


    //event listener for hamburger

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    //event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })



    //event lsitener for previous and next

    previous.addEventListener("click", () => {
        Currentsong.pause()

        let index = songs.indexOf(Currentsong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {


            playMusic(songs[index - 1])

        }
    })

    next.addEventListener("click", () => {
        Currentsong.pause()

        let index = songs.indexOf(
            Currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {

            playMusic(songs[index + 1])
        }


    })


    //add event to volume

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        vol = parseInt(e.target.value) / 100;
        Currentsong.volume = vol;
        console.log(`setting voluume to ${vol}`)
    })

    //add event listener to mute the audio

    document.querySelector(".volume>img").addEventListener("click",e=>{
        console.log(e.target)
        if(e.target.src.includes("volume.svg")){
            e.target.src=e.target.src.replace("volume.svg","mute.svg")
            Currentsong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
        }
        else{
             e.target.src=e.target.src.replace("mute.svg","volume.svg")
            Currentsong.volume=.10;
            document.querySelector(".range").getElementsByTagName("input")[0].value=10;
   
        }
    })

}






main()