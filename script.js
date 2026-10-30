const noButton = document.getElementById("noButton");
const yesButton = document.getElementById("yesButton");
const page = document.querySelector(".page");

let attempts = 0;
let lastEscapeTime = 0;

const messages = [
    "Sûre ? 😳",
    "T'abuses… 🥺",
    "J'espère que c'est pour tester 😶",
    "Bon... 😈",
    "T'as pas trop le choix en vrai ❤️"
];

function clamp(value, minimum, maximum) {
    return Math.min(Math.max(value, minimum), maximum);
}

function moveButton() {
    if (!noButton) {
        return;
    }

    const margin = 12;

    const buttonWidth = noButton.offsetWidth;
    const buttonHeight = noButton.offsetHeight;

    const maximumX = Math.max(
        margin,
        window.innerWidth - buttonWidth - margin
    );

    const maximumY = Math.max(
        margin,
        window.innerHeight - buttonHeight - margin
    );

    const randomX =
        margin + Math.random() * (maximumX - margin);

    const randomY =
        margin + Math.random() * (maximumY - margin);

    const x = clamp(randomX, margin, maximumX);
    const y = clamp(randomY, margin, maximumY);

    const rotation = Math.random() * 24 - 12;

    noButton.style.left = `${x}px`;
    noButton.style.top = `${y}px`;
    noButton.style.right = "auto";
    noButton.style.bottom = "auto";
    noButton.style.transform = `rotate(${rotation}deg)`;
}

function escapeButton(event) {
    if (event) {
        event.preventDefault();
    }

    const currentTime = Date.now();

    /*
     * Empêche un même toucher mobile de déclencher
     * plusieurs événements successifs.
     */
    if (currentTime - lastEscapeTime < 220) {
        return;
    }

    lastEscapeTime = currentTime;
    attempts += 1;

    if (yesButton) {
        const scale = Math.min(1 + attempts * 0.055, 1.28);

        yesButton.style.transform = `scale(${scale})`;
        yesButton.style.boxShadow =
            "0 11px 25px rgba(104, 134, 90, 0.32)";
    }

    const messageIndex = Math.min(
        attempts - 1,
        messages.length - 1
    );

    noButton.textContent = messages[messageIndex];

    moveButton();

    if (
        "vibrate" in navigator &&
        typeof navigator.vibrate === "function"
    ) {
        navigator.vibrate(15);
    }
}

function openPlanPage() {
    if (!page) {
        window.location.href = "plandesoiree.html";
        return;
    }

    page.classList.add("page-exit");

    /*
     * Le bouton Non disparaît proprement pendant
     * la transition vers la page suivante.
     */
    if (noButton) {
        noButton.style.opacity = "0";
        noButton.style.pointerEvents = "none";
    }

    window.setTimeout(function () {
        window.location.href = "plandesoiree.html";
    }, 330);
}

if (noButton) {
    noButton.addEventListener("mouseenter", escapeButton);

    noButton.addEventListener(
        "touchstart",
        escapeButton,
        {
            passive: false
        }
    );

    noButton.addEventListener("click", escapeButton);
}

if (yesButton) {
    yesButton.addEventListener("click", openPlanPage);
}

/*
 * Replace correctement le bouton si le téléphone
 * passe du mode portrait au mode paysage.
 */
window.addEventListener("resize", function () {
    if (attempts > 0) {
        moveButton();
    }
});
