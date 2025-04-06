document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const operationEl = document.getElementById('operation');
    const optionsEl = document.getElementById('options');
    const feedbackEl = document.getElementById('feedback');
    const timeEl = document.getElementById('time');
    const scoreEl = document.getElementById('score');
    const startBtn = document.getElementById('start-btn');
    const messageEl = document.getElementById('message');
    const timerProgressEl = document.getElementById('timer-progress');
    const streakEl = document.getElementById('streak');
    const highScoreEl = document.getElementById('high-score');
    const levelIndicatorEl = document.getElementById('level-indicator');
    const comboMultiplierEl = document.getElementById('combo-multiplier');
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    
    // Variables del juego
    let score = 0;
    let time = 60;
    let maxTime = 60;
    let timer;
    let currentOperation = {};
    let streak = 0;
    let level = 1;
    let highScore = localStorage.getItem('mathGameHighScore') || 0;
    let difficulty = 'easy';
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let totalOperations = 0;
    let comboMultiplier = 1;
    let gameActive = false;
    
    // Mostrar récord guardado
    highScoreEl.textContent = highScore;
    
    // Operadores posibles por dificultad
    const operatorsByDifficulty = {
        'easy': ['+', '-'],
        'medium': ['+', '-', '*'],
        'hard': ['+', '-', '*', '/']
    };
    
    // Mensajes motivadores según puntaje
    const motivationalMessages = {
        negative: ["¡Sigue intentando!", "¡Tú puedes hacerlo!", "¡No te rindas!", "¡La práctica hace al maestro!"],
        low: ["¡Buen comienzo!", "¡Vas mejorando!", "¡Sigue así!", "¡Cada vez lo harás mejor!"],
        medium: ["¡Buen trabajo!", "¡Excelente!", "¡Lo estás haciendo genial!", "¡Eres un crack!"],
        high: ["¡Increíble!", "¡Eres un genio!", "¡Matemático profesional!", "¡Perfecto!", "¡Impresionante!"]
    };
    
    // Configurar dificultad
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (gameActive) return; // No cambiar dificultad durante el juego
            
            // Quitar clase activa de todos los botones
            difficultyBtns.forEach(b => b.classList.remove('active'));
            
            // Añadir clase activa al botón seleccionado
            this.classList.add('active');
            
            // Actualizar dificultad
            difficulty = this.dataset.difficulty;
        });
    });
    
    // Generar mensaje motivador
    function getMotivationalMessage() {
        if (score <= 0) {
            return motivationalMessages.negative[Math.floor(Math.random() * motivationalMessages.negative.length)];
        } else if (score <= 30) {
            return motivationalMessages.low[Math.floor(Math.random() * motivationalMessages.low.length)];
        } else if (score <= 70) {
            return motivationalMessages.medium[Math.floor(Math.random() * motivationalMessages.medium.length)];
        } else {
            return motivationalMessages.high[Math.floor(Math.random() * motivationalMessages.high.length)];
        }
    }
    
    // Actualizar nivel según puntuación
    function updateLevel() {
        const newLevel = Math.floor(score / 50) + 1;
        if (newLevel > level) {
            level = newLevel;
            levelIndicatorEl.textContent = `Nivel ${level}`;
            levelIndicatorEl.classList.add('animate__animated', 'animate__pulse');
            setTimeout(() => {
                levelIndicatorEl.classList.remove('animate__animated', 'animate__pulse');
            }, 1000);
        }
    }
    
    // Generar operación aleatoria basada en la dificultad
    function generateOperation() {
        // Limpiar feedback al generar nueva operación
        feedbackEl.textContent = '';
        feedbackEl.className = 'feedback';
        
        // Mostrar mensaje motivador
        messageEl.textContent = getMotivationalMessage();
        
        // Seleccionar operadores según dificultad
        const operators = operatorsByDifficulty[difficulty];
        const operator = operators[Math.floor(Math.random() * operators.length)];
        
        let num1, num2, answer;
        
        switch(operator) {
            case '+':
                if (difficulty === 'easy') {
                    num1 = Math.floor(Math.random() * 20) + 1;
                    num2 = Math.floor(Math.random() * 20) + 1;
                } else if (difficulty === 'medium') {
                    num1 = Math.floor(Math.random() * 50) + 1;
                    num2 = Math.floor(Math.random() * 50) + 1;
                } else {
                    num1 = Math.floor(Math.random() * 100) + 1;
                    num2 = Math.floor(Math.random() * 100) + 1;
                }
                answer = num1 + num2;
                break;
            case '-':
                if (difficulty === 'easy') {
                    num2 = Math.floor(Math.random() * 10) + 1;
                    num1 = Math.floor(Math.random() * 10) + num2; // Asegurar resultado positivo
                } else if (difficulty === 'medium') {
                    num2 = Math.floor(Math.random() * 20) + 1;
                    num1 = Math.floor(Math.random() * 30) + num2;
                } else {
                    num2 = Math.floor(Math.random() * 50) + 1;
                    num1 = Math.floor(Math.random() * 50) + num2;
                }
                answer = num1 - num2;
                break;
            case '*':
                if (difficulty === 'medium') {
                    num1 = Math.floor(Math.random() * 10) + 1;
                    num2 = Math.floor(Math.random() * 10) + 1;
                } else {
                    num1 = Math.floor(Math.random() * 12) + 1;
                    num2 = Math.floor(Math.random() * 12) + 1;
                }
                answer = num1 * num2;
                break;
            case '/':
                // Para división, aseguramos que sea exacta
                num2 = Math.floor(Math.random() * 9) + 2; // Divisor entre 2 y 10
                answer = Math.floor(Math.random() * 10) + 1; // Resultado entre 1 y 10
                num1 = num2 * answer; // Garantiza división exacta
                break;
        }
        
        currentOperation = {
            num1,
            num2,
            operator,
            answer
        };
        
        operationEl.innerHTML = `${num1} <span style="color:#e74a3b">${operator}</span> ${num2} = ?`;
        totalOperations++;
        
        generateOptions(answer);
    }
    
    // Generar opciones de respuesta
    function generateOptions(answer) {
        optionsEl.innerHTML = '';
        const options = [];
        options.push(answer);
        
        // Generar 3 respuestas incorrectas adaptadas a la dificultad
        while(options.length < 4) {
            let wrongAnswer;
            do {
                if(currentOperation.operator === '+' || currentOperation.operator === '-') {
                    // Ajustar el rango de error según la dificultad
                    const errorRange = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 20;
                    wrongAnswer = answer + (Math.floor(Math.random() * (errorRange * 2 + 1)) - errorRange);
                } else if(currentOperation.operator === '*') {
                    // Para multiplicación, más cercano en dificultades altas
                    const errorRange = difficulty === 'medium' ? 5 : 10;
                    wrongAnswer = answer + (Math.floor(Math.random() * (errorRange * 2 + 1)) - errorRange);
                } else {
                    // Para división
                    wrongAnswer = answer + (Math.floor(Math.random() * 5) - 2);
                }
                
                // Asegurarnos de que no sea la respuesta correcta y sea positivo
                if(wrongAnswer === answer || wrongAnswer < 0) {
                    wrongAnswer = null;
                }
            } while(!wrongAnswer);
            
            if(wrongAnswer && !options.includes(wrongAnswer)) {
                options.push(wrongAnswer);
            }
        }
        
        // Mezclar opciones
        options.sort(() => Math.random() - 0.5);
        
        // Crear botones de opciones
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-btn animate__animated animate__fadeIn';
            button.textContent = option;
            button.addEventListener('click', () => checkAnswer(option));
            optionsEl.appendChild(button);
        });
    }
    
    // Mostrar efecto visual en puntuación
    function showScoreEffect(amount, isCorrect) {
        const effect = document.createElement('span');
        effect.className = 'answer-effect';
        effect.style.position = 'absolute';
        effect.style.left = `${Math.random() * 80 + 10}%`;
        effect.style.top = `${Math.random() * 40 + 30}%`;
        effect.style.color = isCorrect ? '#1cc88a' : '#e74a3b';
        effect.textContent = isCorrect ? `+${amount}` : `${amount}`;
        document.querySelector('.game-container').appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 1000);
    }
    
    // Mostrar multiplicador de combo
    function showComboMultiplier() {
        if (comboMultiplier > 1) {
            comboMultiplierEl.textContent = `x${comboMultiplier}`;
            comboMultiplierEl.classList.add('show');
            setTimeout(() => {
                comboMultiplierEl.classList.remove('show');
                comboMultiplierEl.classList.add('hide');
                setTimeout(() => {
                    comboMultiplierEl.classList.remove('hide');
                }, 500);
            }, 1000);
        }
    }
    
    // Verificar respuesta
    function checkAnswer(selectedAnswer) {
        if (!gameActive) return;
        
        const isCorrect = selectedAnswer == currentOperation.answer;
        let pointsChange;
        
        if(isCorrect) {
            // Aumentar racha y actualizar multiplicador
            streak++;
            streakEl.textContent = streak;
            
            // Actualizar multiplicador según racha
            if (streak >= 10) {
                comboMultiplier = 3;
            } else if (streak >= 5) {
                comboMultiplier = 2;
            } else {
                comboMultiplier = 1;
            }
            
            // Calcular puntos según dificultad y multiplicador
            let basePoints = 10;
            if (difficulty === 'medium') basePoints = 15;
            if (difficulty === 'hard') basePoints = 20;
            
            pointsChange = basePoints * comboMultiplier;
            
            feedbackEl.textContent = `¡Correcto! +${pointsChange} puntos`;
            feedbackEl.className = 'feedback correct';
            
            // Mostrar multiplicador si es relevante
            showComboMultiplier();
            
            // Añadir puntos
            score += pointsChange;
            correctAnswers++;
            
            // Añadir tiempo extra según dificultad
            if (difficulty === 'easy') {
                time += 2;
            } else if (difficulty === 'medium') {
                time += 3;
            } else {
                time += 4;
            }
            
            // Limitar el tiempo máximo
            time = Math.min(time, maxTime);
            timeEl.textContent = time;
            
            // Actualizar barra de progreso
            updateTimerBar();
        } else {
            // Resetear racha y multiplicador
            streak = 0;
            streakEl.textContent = streak;
            comboMultiplier = 1;
            
            // Calcular puntos a restar según dificultad
            let basePoints = -5;
            if (difficulty === 'medium') basePoints = -8;
            if (difficulty === 'hard') basePoints = -10;
            
            pointsChange = basePoints;
            
            feedbackEl.textContent = `Incorrecto. ${pointsChange} puntos. Respuesta: ${currentOperation.answer}`;
            feedbackEl.className = 'feedback incorrect';
            
            // Restar puntos (no permitir menos de 0)
            score = Math.max(0, score + pointsChange);
            incorrectAnswers++;
            
            // Restar tiempo según dificultad
            if (difficulty === 'easy') {
                time -= 1;
            } else if (difficulty === 'medium') {
                time -= 2;
            } else {
                time -= 3;
            }
        }
        
        // Mostrar efecto visual
        showScoreEffect(pointsChange, isCorrect);
        
        // Actualizar puntuación
        scoreEl.textContent = score;
        
        // Actualizar nivel
        updateLevel();
        
        // Nueva operación después de un breve retraso
        setTimeout(generateOperation, 1000);
    }
    
    // Actualizar barra de progreso del temporizador
    function updateTimerBar() {
        const percentage = (time / maxTime) * 100;
        timerProgressEl.style.width = `${percentage}%`;
        
        // Cambiar color según tiempo restante
        if (percentage > 60) {
            timerProgressEl.style.backgroundColor = '#1cc88a';
        } else if (percentage > 30) {
            timerProgressEl.style.backgroundColor = '#f6c23e';
        } else {
            timerProgressEl.style.backgroundColor = '#e74a3b';
        }
    }
    
    // Iniciar juego
    function startGame() {
        // Configurar tiempo según dificultad
        if (difficulty === 'easy') {
            time = maxTime = 60;
        } else if (difficulty === 'medium') {
            time = maxTime = 50;
        } else {
            time = maxTime = 40;
        }
        
        // Reiniciar variables
        score = 0;
        streak = 0;
        level = 1;
        correctAnswers = 0;
        incorrectAnswers = 0;
        totalOperations = 0;
        comboMultiplier = 1;
        gameActive = true;
        
        // Actualizar interfaz
        scoreEl.textContent = score;
        streakEl.textContent = streak;
        timeEl.textContent = time;
        levelIndicatorEl.textContent = `Nivel ${level}`;
        
        // Ocultar botón de inicio
        startBtn.style.display = 'none';
        
        // Reiniciar elementos visuales
        feedbackEl.textContent = '';
        feedbackEl.style.display = 'block';
        messageEl.textContent = '¡Comencemos!';
        messageEl.style.display = 'block';
        
        // Iniciar barra de progreso
        updateTimerBar();
        
        // Iniciar temporizador
        timer = setInterval(() => {
            time--;
            timeEl.textContent = time;
            updateTimerBar();
            
            if(time <= 0) {
                endGame();
            }
        }, 1000);
        
        // Generar primera operación
        generateOperation();
        
        // Animación inicial
        operationEl.classList.add('animate__animated', 'animate__fadeInDown');
        setTimeout(() => {
            operationEl.classList.remove('animate__animated', 'animate__fadeInDown');
        }, 1000);
    }
    
    // Finalizar juego
    function endGame() {
        clearInterval(timer);
        gameActive = false;
        
        // Deshabilitar botones de opciones
        const optionButtons = document.querySelectorAll('.option-btn');
        optionButtons.forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.5';
            button.style.cursor = 'not-allowed';
        });
        
        // Actualizar récord si corresponde
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('mathGameHighScore', highScore);
            highScoreEl.textContent = highScore;
        }
        
        // Calcular precisión
        const accuracy = totalOperations > 0 ? Math.round((correctAnswers / totalOperations) * 100) : 0;
        
        // Limpiar área de juego
        operationEl.innerHTML = '';
        feedbackEl.textContent = '';
        messageEl.textContent = '';
        
        // Crear pantalla de fin de juego
        const endGameScreen = document.createElement('div');
        endGameScreen.className = 'animate__animated animate__fadeIn';
        
        // Mensaje según puntuación
        let endMessage;
        if (score < 30) {
            endMessage = '¡Sigue practicando, lo harás mejor la próxima vez!';
        } else if (score < 100) {
            endMessage = '¡Buen trabajo! Vas mejorando tus habilidades matemáticas.';
        } else if (score < 200) {
            endMessage = '¡Excelente! Tienes grandes habilidades matemáticas.';
        } else {
            endMessage = '¡Increíble! Eres un verdadero genio matemático.';
        }
        
        // Construir HTML de pantalla final
        endGameScreen.innerHTML = `
            <h2 class="final-score animate__animated animate__bounceIn">Puntuación Final: ${score}</h2>
            <p class="optimistic-message">${endMessage}</p>
            
            <div class="stats-container">
                <div class="stat-box">
                    <div class="stat-label">Operaciones</div>
                    <div class="stat-value">${totalOperations}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Correctas</div>
                    <div class="stat-value">${correctAnswers}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Incorrectas</div>
                    <div class="stat-value">${incorrectAnswers}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Precisión</div>
                    <div class="stat-value">${accuracy}%</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Nivel</div>
                    <div class="stat-value">${level}</div>
                </div>
            </div>
            
            <button class="start-btn mt-4">¡Jugar de Nuevo!</button>
        `;
        
        // Añadir la pantalla de fin de juego
        operationEl.parentNode.insertBefore(endGameScreen, operationEl);
        
        // Configurar botón de reinicio
        const restartBtn = endGameScreen.querySelector('.start-btn');
        restartBtn.addEventListener('click', () => {
            // Eliminar pantalla de fin de juego
            endGameScreen.remove();
            
            // Mostrar botón de inicio
            startBtn.style.display = 'block';
            
            // Habilitar selectores de dificultad
            difficultyBtns.forEach(btn => {
                btn.disabled = false;
            });
        });
    }
    
    // Evento para botón de inicio
    startBtn.addEventListener('click', startGame);
});