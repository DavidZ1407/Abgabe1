// Zugriff auf HTML-Elemente über ID, Bilder (png).
const player = document.getElementById("player");
const spikes = document.getElementById("spikes");
const imageBackground = document.getElementById("image_background");
const jumpButton = document.getElementById("jumpButton");
const resetButton = document.getElementById("resetButton");
const scoreBoard = document.getElementById("scoreBoard");
const startScreen = document.getElementById("startScreen");
const endScreen = document.getElementById("endScreen");
const backgroundRandom = ['1.png', '2.png', '3.png', '4.png', '5.png'];

//Variablen für die Spielzustände, Spieler am leben, Interval vom Hintergrundbilder, Spielstand ob es vorbei ist oder nicht, Spielpunkte, Charakterbilder (Start und Verloren).
let playerAlive;
let backgroundInterval;
let gameActive = false;
let gameNotActive = false;
let score = 0;
let characterStart = 'url("Image/start.png")';
let characterLose = 'url("Image/lose.png")';
let statusArray = [characterStart, characterLose];

// Anfangs wird das Scoreboard ausgeblendet.
scoreBoard.style.display = "none";

//Funktion, um das Spiel zu starten, dabei wird der Spielstand als true angezeigt und es ist noch nicht vorbei. Zusätzlich wird alle 2000 Millisekunden das Hintergrundbild geändert. Einblendung von Objekt 'spikes'.
function startGame() {
    gameActive = true;
    gameNotActive = false;
    resetStart();
    changeBackground();
    backgroundInterval = setInterval(changeBackground, 2000);
    spikes.classList.remove("hidden");

    // Überprüfung vom Player, wenn er das Objekt 'Spikes' auf der horizontale Achse im Bereich zwischen 0 und 100 trifft und sich gleichzeitig auf der Vertikal Achse bei 210 oder größer. Das wird alle 10 millisekunden überprüft und wenn getrofen GameOver Funktion.
    playerAlive = setInterval(function () {
        let playerTop = parseInt(window.getComputedStyle(player).getPropertyValue("top"));
        let spikesLeft = parseInt(window.getComputedStyle(spikes).getPropertyValue("left"));
        console.log(spikesLeft);
        if (spikesLeft < 100 && spikesLeft > 0 && playerTop >= 210) {
            gameOver();
        } else {
            score++;
            updateScore();
        }
    }, 10);

    // Scoreboard, Hintergrund und Spieler werden sichtbar, Punktezahl ist 0 und Punktestand wird Aktualisiert.
    player.style.backgroundImage = statusArray[0];
    player.classList.remove("hidden");
    jumpButton.disabled = false;
    score = 0;
    updateScore();
}

// Funktion zum Springen des Spielers und zum Starten des Spiels. Zusätzlich sollte es nicht möglich sein, innerhalb von 300 Millisekunden erneut in der Luft zu springen, wenn Spiel nicht aktiv ist soll es aktiv werden. Verstecke das Startbildschirm.
function jump() {
    if (!gameActive && !gameNotActive) {
        startGame();
        startScreen.style.display = "none";
        return;
    }
    //Wenn das Spiel Active ist, soll die Animation vom Springen simuliert werden und alle 0,3 sekunden wieder entfernt. Damit das Springen nicht dauerhaft nutzen kann. 
    if (gameActive)
        player.classList.add("jump");
    setTimeout(function () {
        player.classList.remove("jump");
    }, 300);
}

// Funktion, um die Position beim Zurücksetzen des Spiels so wiederherzustellen, wie es beim Start des Spiels war.
function resetStart() {
    player.style.backgroundImage = statusArray[0];
    player.style.top = '220px';
    jumpButton.disabled = false;
    scoreBoard.style.display = "block";
}

// Funktion, die aufgerufen wird, wenn das Spiel verloren ist. Dabei wird das Spiel als beendet erklärt, das Wechseln der Hintergrundbilder gestoppt und der Game Over-Bildschirm angezeigt wird. Verstecken von Objekt 'spikes' und Deaktiviern des Jump-Button, Aktivierung Reset-Button. 
function gameOver() {
    console.log("Game Over");
    gameActive = false;
    gameNotActive = true;
    player.style.backgroundImage = statusArray[1];
    clearInterval(playerAlive);
    clearInterval(backgroundInterval);
    spikes.classList.add("hidden");
    toggleJumpButton(true); 
    toggleResetButton(false); 
    endScreen.style.display = "block";
    startScreen.style.display = "none";
}

// Funktion, zum Zurücksetzen des Spiels mithilfe des Reset-Buttons, wobei überprüft wird, ob das Spiel tatsächlich beendet ist damit ich während dem Spiel nicht den Reset-Button drücken kann. Verstecke den Endbildschirm und zeige den Startbildschirm.
function resetGame() {
    if (gameNotActive) {
        startGame();
        endScreen.style.display = "none";
        startScreen.style.display = "block";
        toggleResetButton(true); 
    }
}

// Das man den Jump-Button, Reset-Button anklicken kann.
jumpButton.addEventListener("click", jump);
resetButton.addEventListener("click", resetGame);

// Funktion, zur zufälligen Auswahl der Hintergrundbilder aus backgroundRandom.
function getRandomBackground() {
    const randomIndex = Math.floor(Math.random() * backgroundRandom.length);
    return backgroundRandom[randomIndex];
}

// Funktion, Hintergrundbild wird mit einem Intervall geändert.
function changeBackground() {
    const selectedBackground = getRandomBackground();
    imageBackground.src = `./Image/${selectedBackground}`;
}

// Funktion, um den Punktestand im Scoreboard zu aktualisieren.
function updateScore() {
    scoreBoard.innerText = `Score: ${score}`;
}
// Funktion um den Jump-Button Aktivierung und Deaktiviern.
function toggleJumpButton(disabled) {
    jumpButton.disabled = disabled;
}
// Funktion um den Reset-Button Aktivierung und Deaktiviern.
function toggleResetButton(disabled) {
    resetButton.disabled = disabled;
}