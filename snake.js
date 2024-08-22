// Get the canvas element and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Get the score display and control buttons elements
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resumeButton = document.getElementById('resumeButton');

// Define the size of each box in the grid
const box = 20;

// Initialize the snake as an array of objects
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box }; // Initial position of the snake

// Generate initial food position
let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};

// Initialize direction and score
let direction;
let score = 0;
let game;
let isPaused = false;

// Add event listener for keyboard input to set the direction
document.addEventListener('keydown', setDirection);

// Add event listeners for the control buttons
startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', pauseGame);
resumeButton.addEventListener('click', resumeGame);

// Function to start the game
function startGame() {
    // Reset game variables
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = null;
    score = 0;
    updateScore();
    // Hide the start button and show the pause button
    startButton.style.display = 'none';
    pauseButton.style.display = 'inline-block';
    resumeButton.style.display = 'none';
    // Start the game loop
    game = setInterval(draw, 100);
}

// Function to pause the game
function pauseGame() {
    clearInterval(game);
    isPaused = true;
    pauseButton.style.display = 'none';
    resumeButton.style.display = 'inline-block';
}

// Function to resume the game
function resumeGame() {
    if (isPaused) {
        game = setInterval(draw, 100);
        isPaused = false;
        pauseButton.style.display = 'inline-block';
        resumeButton.style.display = 'none';
    }
}

// Function to set the direction based on keyboard input
function setDirection(event) {
    if (event.keyCode === 37 && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (event.keyCode === 38 && direction !== 'DOWN') {
        direction = 'UP';
    } else if (event.keyCode === 39 && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if (event.keyCode === 40 && direction !== 'UP') {
        direction = 'DOWN';
    }
}

// Function to check for collision with the snake itself
function collision(newHead, array) {
    for (let i = 0; i < array.length; i++) {
        if (newHead.x === array[i].x && newHead.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Function to update the score display
function updateScore() {
    scoreDisplay.textContent = 'Score: ' + score;
}

// Function to draw the game elements on the canvas
function draw() {
    // Clear the canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the snake
    for (let i = 0; i < snake.length; i++) {
        let gradient = ctx.createLinearGradient(snake[i].x, snake[i].y, snake[i].x + box, snake[i].y + box);
        gradient.addColorStop(0, '#00FF00');
        gradient.addColorStop(1, '#006400');
        ctx.fillStyle = gradient;
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw the food
    let foodGradient = ctx.createRadialGradient(food.x + box / 2, food.y + box / 2, box / 4, food.x + box / 2, food.y + box / 2, box / 2);
    foodGradient.addColorStop(0, '#FF0000');
    foodGradient.addColorStop(1, '#8B0000');
    ctx.fillStyle = foodGradient;
    ctx.fillRect(food.x, food.y, box, box);

    // Get the current head position of the snake
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Update snake's position based on the current direction
    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    // Wrap snake position on edge collision
    if (snakeX < 0) snakeX = canvas.width - box;
    if (snakeY < 0) snakeY = canvas.height - box;
    if (snakeX >= canvas.width) snakeX = 0;
    if (snakeY >= canvas.height) snakeY = 0;

    // Check if snake has eaten the food
    if (snakeX === food.x && snakeY === food.y) {
        score++; // Increase score
        updateScore(); // Update the score display
        // Generate new food position
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop(); // Remove the last part of the snake if no food is eaten
    }

    // Create new head for the snake
    let newHead = {
        x: snakeX,
        y: snakeY
    };

    // Check for collision with itself
    if (collision(newHead, snake)) {
        clearInterval(game); // End the game if collision occurs
        startButton.style.display = 'block'; // Show the start button
        pauseButton.style.display = 'none'; // Hide the pause button
        resumeButton.style.display = 'none'; // Hide the resume button
    }

    // Add new head to the snake
    snake.unshift(newHead);
}