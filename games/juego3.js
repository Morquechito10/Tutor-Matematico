document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const questionEl = document.getElementById('question');
    const shapeContainerEl = document.getElementById('shape-container');
    const measurementsEl = document.getElementById('measurements');
    const optionsEl = document.getElementById('options');
    const feedbackEl = document.getElementById('feedback');
    const scoreEl = document.getElementById('score');
    const timeEl = document.getElementById('time');
    const messageEl = document.getElementById('message');
    const startBtn = document.getElementById('start-btn');
    const timerProgressEl = document.getElementById('timer-progress');
    const streakEl = document.getElementById('streak');
    const highScoreEl = document.getElementById('high-score');
    const levelIndicatorEl = document.getElementById('level-indicator');
    const comboMultiplierEl = document.getElementById('combo-multiplier');
    
    // Variables del juego
    let score = 0;
    let time = 60;
    let maxTime = 60;
    let timer;
    let currentQuestion = {};
    let streak = 0;
    let level = 1;
    let highScore = localStorage.getItem('geometryGameHighScore') || 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let totalQuestions = 0;
    let comboMultiplier = 1;
    let gameActive = false;
    
    // Formas geométricas
    const shapes = [
        { name: 'triángulo', class: 'triangle', sides: 3 },
        { name: 'cuadrado', class: 'square', sides: 4 },
        { name: 'rectángulo', class: 'rectangle', sides: 4 },
        { name: 'círculo', class: 'circle', sides: 0 },
        { name: 'pentágono', class: 'pentagon', sides: 5 },
        { name: 'hexágono', class: 'hexagon', sides: 6 }
    ];

    // Mostrar récord guardado
    highScoreEl.textContent = highScore;
    
    // Mensajes motivadores
    const motivationalMessages = {
        negative: ["¡Sigue intentando!", "¡Tú puedes hacerlo!", "¡No te rindas!", "¡La práctica hace al maestro!"],
        low: ["¡Buen comienzo!", "¡Vas mejorando!", "¡Sigue así!", "¡Cada vez lo harás mejor!"],
        medium: ["¡Buen trabajo!", "¡Excelente!", "¡Lo estás haciendo genial!", "¡Eres un crack!"],
        high: ["¡Increíble!", "¡Eres un genio!", "¡Geómetra profesional!", "¡Perfecto!", "¡Impresionante!"]
    };
    
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

    function startGame() {
        // Configurar tiempo inicial
        time = maxTime = 60;
        
        // Reiniciar variables
        score = 0;
        streak = 0;
        level = 1;
        correctAnswers = 0;
        incorrectAnswers = 0;
        totalQuestions = 0;
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
        feedbackEl.className = 'feedback';
        messageEl.textContent = '¡Comencemos!';
        
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
        
        // Generar primera pregunta
        generateQuestion();
        
        // Animación inicial
        questionEl.classList.add('animate__animated', 'animate__fadeInDown');
        setTimeout(() => {
            questionEl.classList.remove('animate__animated', 'animate__fadeInDown');
        }, 1000);
    }
    
    function generateQuestion() {
        feedbackEl.textContent = '';
        feedbackEl.className = 'feedback';
        messageEl.textContent = getMotivationalMessage();
        
        const questionType = Math.floor(Math.random() * 3); // 0:identificar, 1:área, 2:perímetro
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        let questionText = '';
        let answer = '';
        let measurementsText = '';
        
        // Generar medidas aleatorias (en cm)
        const base = Math.floor(Math.random() * 10) + 5;
        const height = Math.floor(Math.random() * 10) + 5;
        const radius = Math.floor(Math.random() * 5) + 3;
        const side2 = Math.floor(Math.random() * 5) + 3;
        
        switch(questionType) {
            case 0: // Identificar figura
                questionText = "¿Qué figura geométrica es esta?";
                answer = shape.name;
                break;
                
            case 1: // Calcular área
                questionText = "Calcula el área de esta figura:";
                
                switch(shape.class) {
                    case 'triangle':
                        measurementsText = `Base: ${base} cm, Altura: ${height} cm`;
                        answer = Math.round((base * height) / 2);
                        break;
                    case 'square':
                        measurementsText = `Lado: ${base} cm`;
                        answer = base * base;
                        break;
                    case 'rectangle':
                        measurementsText = `Largo: ${base} cm, Ancho: ${side2} cm`;
                        answer = base * side2;
                        break;
                    case 'circle':
                        measurementsText = `Radio: ${radius} cm (π ≈ 3.14)`;
                        answer = Math.round(3.14 * radius * radius);
                        break;
                    case 'pentagon':
                    case 'hexagon':
                        const sideLength = base;
                        const apothem = sideLength / (2 * Math.tan(Math.PI / shape.sides));
                        answer = Math.round((shape.sides * sideLength * apothem) / 2);
                        measurementsText = `Lado: ${sideLength} cm`;
                        break;
                }
                break;
                
            case 2: // Calcular perímetro
                questionText = "Calcula el perímetro de esta figura:";
                
                switch(shape.class) {
                    case 'triangle':
                        measurementsText = `Lados: ${base} cm cada uno`;
                        answer = base * 3;
                        break;
                    case 'square':
                        measurementsText = `Lado: ${base} cm`;
                        answer = base * 4;
                        break;
                    case 'rectangle':
                        measurementsText = `Largo: ${base} cm, Ancho: ${side2} cm`;
                        answer = 2 * (base + side2);
                        break;
                    case 'circle':
                        measurementsText = `Radio: ${radius} cm (π ≈ 3.14)`;
                        answer = Math.round(2 * 3.14 * radius);
                        break;
                    case 'pentagon':
                        measurementsText = `Lado: ${base} cm`;
                        answer = base * 5;
                        break;
                    case 'hexagon':
                        measurementsText = `Lado: ${base} cm`;
                        answer = base * 6;
                        break;
                }
                break;
        }
        
        currentQuestion = {
            type: questionType,
            shape: shape,
            answer: answer.toString(),
            measurements: measurementsText
        };
        
        questionEl.textContent = questionText;
        measurementsEl.textContent = measurementsText;
        
        // Mostrar forma geométrica con animación
        shapeContainerEl.innerHTML = '';
        const shapeDiv = document.createElement('div');
        shapeDiv.className = `shape ${shape.class}`;
        
        // Texto para figuras complejas
        if(shape.class === 'pentagon' || shape.class === 'hexagon') {
            shapeDiv.textContent = shape.name.charAt(0).toUpperCase() + shape.name.slice(1);
        }
        
        shapeContainerEl.appendChild(shapeDiv);
        shapeContainerEl.classList.add('animate__animated', 'animate__fadeIn');
        
        generateOptions(answer.toString(), questionType, shape);
        totalQuestions++;
    }
    
    function generateOptions(correctAnswer, questionType, shape) {
        optionsEl.innerHTML = '';
        const options = [correctAnswer];
        
        while (options.length < 4) {
            let wrongAnswer;
            
            if (questionType === 0) { // Identificación
                const otherShapes = shapes.filter(s => s.name !== shape.name);
                wrongAnswer = otherShapes[Math.floor(Math.random() * otherShapes.length)].name;
            } else { // Cálculos
                const variation = Math.floor(parseInt(correctAnswer) * 0.2);
                wrongAnswer = (parseInt(correctAnswer) + Math.floor(Math.random() * (variation * 2)) - variation).toString();
                
                if (parseInt(wrongAnswer) <= 0 || wrongAnswer === correctAnswer) {
                    wrongAnswer = (parseInt(correctAnswer) + variation + 1).toString();
                }
            }
            
            if (!options.includes(wrongAnswer)) {
                options.push(wrongAnswer);
            }
        }
        
        // Mostrar opciones con animación
        options.sort(() => Math.random() - 0.5).forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn animate__animated animate__fadeIn';
            button.style.animationDelay = `${index * 0.1}s`;
            button.textContent = option;
            button.addEventListener('click', () => checkAnswer(option));
            optionsEl.appendChild(button);
        });
    }
    
    function checkAnswer(selectedAnswer) {
        if (!gameActive) return;
        
        const isCorrect = selectedAnswer == currentQuestion.answer;
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
            
            // Calcular puntos con multiplicador
            pointsChange = 10 * comboMultiplier;
            
            feedbackEl.textContent = `¡Correcto! +${pointsChange} puntos`;
            feedbackEl.className = 'feedback correct';
            
            // Mostrar multiplicador si es relevante
            showComboMultiplier();
            
            // Añadir puntos
            score += pointsChange;
            correctAnswers++;
            
            // Animación de celebración
            shapeContainerEl.classList.add('animate__animated', 'animate__bounce');
            
            // Añadir tiempo extra
            time += 3;
            time = Math.min(time, maxTime);
            timeEl.textContent = time;
            
            // Actualizar barra de progreso
            updateTimerBar();
        } else {
            // Resetear racha y multiplicador
            streak = 0;
            streakEl.textContent = streak;
            comboMultiplier = 1;
            
            pointsChange = -5;
            
            feedbackEl.textContent = `Incorrecto. ${pointsChange} puntos. Respuesta: ${currentQuestion.answer}`;
            feedbackEl.className = 'feedback incorrect';
            
            // Restar puntos (no permitir menos de 0)
            score = Math.max(0, score + pointsChange);
            incorrectAnswers++;
            
            // Animación de error
            shapeContainerEl.classList.add('animate__animated', 'animate__shakeX');
        }
        
        // Mostrar efecto visual
        showScoreEffect(pointsChange, isCorrect);
        
        // Actualizar puntuación
        scoreEl.textContent = score;
        
        // Actualizar nivel
        updateLevel();
        
        // Eliminar animaciones después de completarlas
        setTimeout(() => {
            shapeContainerEl.classList.remove('animate__animated', 'animate__bounce', 'animate__shakeX');
        }, 1000);
        
        // Nueva pregunta después de un breve retraso
        setTimeout(generateQuestion, 1000);
    }
    
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
            localStorage.setItem('geometryGameHighScore', highScore);
            highScoreEl.textContent = highScore;
        }
        
        // Calcular precisión
        const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
        
        // Limpiar área de juego
        questionEl.innerHTML = '';
        shapeContainerEl.innerHTML = '';
        measurementsEl.textContent = '';
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
            endMessage = '¡Buen trabajo! Vas mejorando tus habilidades geométricas.';
        } else if (score < 200) {
            endMessage = '¡Excelente! Tienes grandes habilidades geométricas.';
        } else {
            endMessage = '¡Increíble! Eres un verdadero genio geométrico.';
        }
        
        // Construir HTML de pantalla final
        endGameScreen.innerHTML = `
            <h2 class="final-score animate__animated animate__bounceIn">Puntuación Final: ${score}</h2>
            <p class="optimistic-message">${endMessage}</p>
            
            <div class="stats-container">
                <div class="stat-box">
                    <div class="stat-label">Preguntas</div>
                    <div class="stat-value">${totalQuestions}</div>
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
                <div class="stat-box">
                    <div class="stat-label">Racha máxima</div>
                    <div class="stat-value">${streakEl.textContent}</div>
                </div>
            </div>
            
            <button class="start-btn mt-4">¡Jugar de Nuevo!</button>
        `;
        
        // Añadir la pantalla de fin de juego
        questionEl.parentNode.insertBefore(endGameScreen, questionEl);
        
        // Configurar botón de reinicio
        const restartBtn = endGameScreen.querySelector('.start-btn');
        restartBtn.addEventListener('click', () => {
            // Eliminar pantalla de fin de juego
            endGameScreen.remove();
            
            // Mostrar botón de inicio
            startBtn.style.display = 'block';
        });
    }
    
    // Evento para botón de inicio
    startBtn.addEventListener('click', startGame);
});