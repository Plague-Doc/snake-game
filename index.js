const game = {
    canvas: document.getElementById("canvas"),
    ctx: canvas.getContext("2d"),
    drawSize: 25,
    running: true,
    tickDelay: 200,
    score: 0,
};

const snake = {
    userInputs: ["", ""],
    inputExecuted: false,
    xVel: game.drawSize,
    yVel: 0,
    apple: [],
    body: [
        [game.drawSize * 3, game.drawSize],
        [game.drawSize * 2, game.drawSize],
        [game.drawSize, game.drawSize],
    ],
    prevBody: [],
};

function play() {
    if (game.running) {
        setTimeout(() => {
            clearCanvas();
            moveSnake();
            drawSnake(snake.body);
            spawnApple();
            drawApple();
            checkGameOver();
            play();
        }, game.tickDelay);
    } else {
        clearCanvas();
        drawSnake(snake.prevBody);
        drawApple();
        drawGameOver();
    }
}

function clearCanvas() {
    game.ctx.beginPath();
    game.ctx.fillStyle = "#f2f3f4";
    game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
}

function moveSnake() {
    switch (true) {
        case (snake.userInputs[0] === "arrowup" || snake.userInputs[0] === "w") && snake.yVel === 0:
            snake.xVel = 0;
            snake.yVel = -game.drawSize;
            break;
        case (snake.userInputs[0] === "arrowdown" || snake.userInputs[0] === "s") && snake.yVel === 0:
            snake.xVel = 0;
            snake.yVel = game.drawSize;
            break;
        case (snake.userInputs[0] === "arrowleft" || snake.userInputs[0] === "a") && snake.xVel === 0:
            snake.xVel = -game.drawSize;
            snake.yVel = 0;
            break;
        case (snake.userInputs[0] === "arrowright" || snake.userInputs[0] === "d") && snake.xVel === 0:
            snake.xVel = game.drawSize;
            snake.yVel = 0;
            break;
        default:
            break;
    }

    snake.userInputs[0] = "";
    snake.userInputs[0] = snake.userInputs[1];
    snake.userInputs[1] = "";

    snake.prevBody = snake.body.slice();
    snake.body.unshift([snake.body[0][0] + snake.xVel, snake.body[0][1] + snake.yVel]);

    if (snake.body[0][0] === snake.apple[0] && snake.body[0][1] === snake.apple[1]) {
        updateState();
        updateText();
        snake.apple = [];
    } else {
        snake.body.pop();
    }

    snake.inputExecuted = true;
}

function checkGameOver() {
    if (snake.body[0][0] >= game.canvas.width || snake.body[0][0] < 0) {
        game.running = false;
    } else if (snake.body[0][1] >= game.canvas.height || snake.body[0][1] < 0) {
        game.running = false;
    }

    const checkSet = new Set(snake.body.map((x) => `${x[0]},${x[1]}`));
    if (checkSet.size !== snake.body.length) {
        game.running = false;
    }
}

function drawSnake(snakeBody) {
    game.ctx.beginPath();
    for (const part of snakeBody) {
        if (part === snakeBody[0]) {
            game.ctx.fillStyle = "#7ccf00";
            game.ctx.fillRect(part[0], part[1], game.drawSize, game.drawSize);
            game.ctx.fillStyle = "black";
            if (snake.xVel > 0) {
                game.ctx.fillRect(part[0] + game.drawSize / 2 + 5, part[1] + game.drawSize / 2 - 7, 3, 3);
                game.ctx.fillRect(part[0] + game.drawSize / 2 + 5, part[1] + game.drawSize / 2 + 4, 3, 3);
            } else if (snake.xVel < 0) {
                game.ctx.fillRect(part[0] + game.drawSize / 2 - 8, part[1] + game.drawSize / 2 - 7, 3, 3);
                game.ctx.fillRect(part[0] + game.drawSize / 2 - 8, part[1] + game.drawSize / 2 + 4, 3, 3);
            } else if (snake.yVel > 0) {
                game.ctx.fillRect(part[0] + game.drawSize / 2 + 4, part[1] + game.drawSize / 2 + 5, 3, 3);
                game.ctx.fillRect(part[0] + game.drawSize / 2 - 7, part[1] + game.drawSize / 2 + 5, 3, 3);
            } else if (snake.yVel < 0) {
                game.ctx.fillRect(part[0] + game.drawSize / 2 + 4, part[1] + game.drawSize / 2 - 8, 3, 3);
                game.ctx.fillRect(part[0] + game.drawSize / 2 - 7, part[1] + game.drawSize / 2 - 8, 3, 3);
            }
            game.ctx.strokeStyle = "black";
            game.ctx.lineWidth = 1;
            game.ctx.strokeRect(part[0], part[1], game.drawSize, game.drawSize);
        } else {
            game.ctx.fillStyle = "#7ccf00";
            game.ctx.fillRect(part[0], part[1], game.drawSize, game.drawSize);
            game.ctx.strokeStyle = "black";
            game.ctx.lineWidth = 1;
            game.ctx.strokeRect(part[0], part[1], game.drawSize, game.drawSize);
        }
    }
}

function spawnApple() {
    if (snake.apple.length) return;

    let allTiles = new Set();
    for (let i = 0; i < game.canvas.width / game.drawSize; i++) {
        for (let j = 0; j < game.canvas.height / game.drawSize; j++) {
            allTiles.add(`${i * game.drawSize},${j * game.drawSize}`);
        }
    }

    for (const part of snake.body) {
        allTiles.delete(`${part[0]},${part[1]}`);
    }

    const freeTiles = Array.from(allTiles);

    if (!freeTiles.length) return;
    snake.apple = freeTiles[Math.floor(Math.random() * freeTiles.length)].split(",").map(Number);
}

function drawApple() {
    game.ctx.beginPath();
    game.ctx.fillStyle = "#fb2c36";
    game.ctx.arc(
        snake.apple[0] + game.drawSize / 2,
        snake.apple[1] + game.drawSize / 2,
        game.drawSize / 2,
        0,
        2 * Math.PI
    );
    game.ctx.fill();
    game.ctx.strokeStyle = "black";
    game.ctx.lineWidth = 1;
    game.ctx.stroke();
}

function drawGameOver() {
    game.ctx.beginPath();
    game.ctx.font = "42px monospace";
    game.ctx.fillStyle = "black";
    game.ctx.textAlign = "center";
    game.ctx.fillText("GAME OVER!", game.canvas.width / 2, game.canvas.height / 2);
}

window.addEventListener("keydown", changeDirection);
document.getElementById("reset").addEventListener("click", () => location.reload());
window.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "r") location.reload();
});

function changeDirection(keydownEvent) {
    if (snake.inputExecuted === true) {
        snake.userInputs[0] = keydownEvent.key.toLowerCase();
        snake.inputExecuted = false;
    } else {
        snake.userInputs[1] = keydownEvent.key.toLowerCase();
    }
}

function updateText() {
    if (!localStorage.getItem("high") || localStorage.getItem("high") < game.score) {
        localStorage.setItem("high", game.score);
    }

    document.getElementById("high").textContent = `high: ${localStorage.getItem("high")}`;
    document.getElementById("score").textContent = `score: ${game.score}`;
    document.getElementById("speed").textContent = `speed: ${200 - game.tickDelay + 100}%`;
}

function updateState() {
    game.score += 100;
    if (game.tickDelay > 100) game.tickDelay -= 2;
}

updateText();
play();
