document.addEventListener('DOMContentLoaded', function() {
    const questionEl = document.getElementById('question');
    const optionsEl = document.getElementById('options');
    const feedbackEl = document.getElementById('feedback');
    const scoreEl = document.getElementById('score');
    const timeEl = document.getElementById('time');
    const messageEl = document.getElementById('message');
    const startBtn = document.getElementById('start-btn');
    const timeProgressEl = document.getElementById('time-progress');
    const summaryEl = document.getElementById('summary');
    const playAgainBtn = document.getElementById('play-again-btn');
    
    // Elementos del resumen
    const summaryLevelEl = document.getElementById('summary-level');
    const summaryScoreEl = document.getElementById('summary-score');
    const summaryMessageEl = document.getElementById('summary-message');
    const totalOperationsEl = document.getElementById('total-operations');
    const correctAnswersEl = document.getElementById('correct-answers');
    const incorrectAnswersEl = document.getElementById('incorrect-answers');
    const precisionEl = document.getElementById('precision');
    const levelEl = document.getElementById('level');
    
    let score = 0;
    let time = 60;
    let timer;
    let currentAnswer = '';
    let totalOperations = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let currentLevel = 1;
    const MAX_SCORE = 100;
    
    // Mensajes motivadores
    const motivationalMessages = {
        negative: ["¡Tú puedes! 💪", "¡Sigue intentando! 🚀", "¡La práctica hace al maestro! 📚"],
        low: ["¡Vas mejorando! 🌱", "¡Sigue así! 👍", "¡Cada vez lo harás mejor! 📈"],
        medium: ["¡Buen trabajo! 🌟", "¡Excelente! 🎯", "¡Lo estás haciendo genial! 👏"],
        high: ["¡Increíble! 🔥", "¡Eres un genio! 🧠", "¡Perfecto! 🏆"]
    };
    
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
    
    function startGame() {
        score = 0;
        time = 60;
        totalOperations = 0;
        correctAnswers = 0;
        incorrectAnswers = 0;
        
        scoreEl.textContent = score;
        timeEl.textContent = time;
        startBtn.style.display = 'none';
        feedbackEl.textContent = '';
        feedbackEl.className = 'feedback';
        messageEl.textContent = '¡Vamos a aprender fracciones! 🧮';
        summaryEl.style.display = 'none';
        questionEl.style.display = 'block';
        optionsEl.style.display = 'grid';
        
        timer = setInterval(() => {
            time--;
            timeEl.textContent = time;
            
            // Actualizar barra de progreso
            const progressPercentage = (time / 60) * 100;
            timeProgressEl.style.width = `${progressPercentage}%`;
            
            if (progressPercentage <= 25) {
                timeProgressEl.style.backgroundColor = '#e74a3b';
            } else if (progressPercentage <= 50) {
                timeProgressEl.style.backgroundColor = '#f6c23e';
            } else {
                timeProgressEl.style.backgroundColor = '#4e73df';
            }
            
            if(time <= 0) {
                endGame();
            }
        }, 1000);
        
        generateQuestion();
    }
    
    function generateQuestion() {
        feedbackEl.textContent = '';
        feedbackEl.className = 'feedback';
        messageEl.textContent = getMotivationalMessage();
        
        // Ajustar dificultad según nivel
        const questionType = Math.floor(Math.random() * 3);
        let questionText = '';
        let options = [];
        
        if(questionType === 0) { // Equivalencias
            const fractions = [
                { num: 1, den: 2, eq: ['2/4', '3/6', '4/8'] },
                { num: 1, den: 3, eq: ['2/6', '3/9', '4/12'] },
                { num: 1, den: 4, eq: ['2/8', '3/12', '4/16'] },
                { num: 2, den: 3, eq: ['4/6', '6/9', '8/12'] }
            ];
            
            const frac = fractions[Math.floor(Math.random() * fractions.length)];
            currentAnswer = frac.eq[0];
            questionText = `${frac.num}/${frac.den} = ?`;
            
            options = [
                currentAnswer,
                `${frac.num + 1}/${frac.den + 1}`,
                `${frac.num * 2}/${frac.den}`,
                `${frac.num}/${frac.den * 2}`
            ];
            
        } else { // Sumas o restas
            // Ajustar dificultad según nivel
            const maxDen = 6 + currentLevel;
            const den = Math.floor(Math.random() * maxDen) + 2; // Denominador ajustado al nivel
            const num1 = Math.floor(Math.random() * (den-1)) + 1;
            const num2 = Math.floor(Math.random() * (den-1)) + 1;
            
            if(questionType === 1) { // Suma
                const sumNum = num1 + num2;
                const gcd = findGCD(sumNum, den);
                currentAnswer = gcd > 1 ? `${sumNum/gcd}/${den/gcd}` : `${sumNum}/${den}`;
                questionText = `${num1}/${den} + ${num2}/${den} = ?`;
            } else { // Resta
                const resNum = Math.max(num1, num2) - Math.min(num1, num2);
                const gcd = findGCD(resNum, den);
                currentAnswer = resNum === 0 ? "0" : (gcd > 1 ? `${resNum/gcd}/${den/gcd}` : `${resNum}/${den}`);
                questionText = `${Math.max(num1, num2)}/${den} - ${Math.min(num1, num2)}/${den} = ?`;
            }
            
            // Generar opciones incorrectas más realistas
            options = [
                currentAnswer,
                generateIncorrectOption(num1, num2, den, "+"),
                generateIncorrectOption(num1, num2, den, "-"),
                generateIncorrectOption(num1, num2, den, "*")
            ];
        }
        
        // Asegurarse de que las opciones sean únicas
        options = [...new Set(options)];
        while(options.length < 4) {
            options.push(generateRandomFraction());
        }
        
        questionEl.textContent = questionText;
        showOptions(options.sort(() => Math.random() - 0.5));
    }
    
    function generateIncorrectOption(num1, num2, den, operation) {
        let result;
        switch(operation) {
            case "+":
                result = `${num1 + num2}/${den + den}`;
                break;
            case "-":
                result = `${Math.abs(num1 - num2)}/${den - 1 || 2}`;
                break;
            case "*":
                result = `${num1 * num2}/${den}`;
                break;
            default:
                result = `${num1}/${num2}`;
        }
        return result;
    }
    
    function generateRandomFraction() {
        const den = Math.floor(Math.random() * 10) + 2;
        const num = Math.floor(Math.random() * den) + 1;
        return `${num}/${den}`;
    }
    
    function findGCD(a, b) {
        return b ? findGCD(b, a % b) : a;
    }
    
    function showOptions(options) {
        optionsEl.innerHTML = '';
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.addEventListener('click', function() {
                checkAnswer(option);
            });
            optionsEl.appendChild(button);
        });
    }
    
    function checkAnswer(selectedOption) {
        totalOperations++;
        
        if(selectedOption === currentAnswer) {
            feedbackEl.textContent = '¡Correcto! +10 puntos ✅';
            feedbackEl.className = 'feedback correct';
            score += 10;
            correctAnswers++;
            
            // Actualizar nivel basado en el puntaje
            if(score >= 50 && currentLevel === 1) {
                currentLevel = 2;
            } else if(score >= 80 && currentLevel === 2) {
                currentLevel = 3;
            }
        } else {
            feedbackEl.textContent = `Incorrecto. -5 puntos ❌ Respuesta: ${currentAnswer}`;
            feedbackEl.className = 'feedback incorrect';
            score -= 5;
            incorrectAnswers++;
        }
        
        score = Math.max(0, Math.min(score, MAX_SCORE));
        scoreEl.textContent = score;
        
        setTimeout(generateQuestion, 1500);
    }
    
    function endGame() {
        clearInterval(timer);
        
        const optionButtons = document.querySelectorAll('.option-btn');
        optionButtons.forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.5';
        });
        
        // Mostrar resumen final
        displaySummary();
    }
    
    function displaySummary() {
        // Ocultar contenido del juego
        questionEl.style.display = 'none';
        optionsEl.style.display = 'none';
        feedbackEl.style.display = 'none';
        messageEl.style.display = 'none';
        
        // Calcular precisión
        const precision = totalOperations > 0 ? Math.round((correctAnswers / totalOperations) * 100) : 0;
        
        // Actualizar elementos del resumen
        summaryLevelEl.textContent = `Nivel ${currentLevel}`;
        summaryScoreEl.textContent = score;
        totalOperationsEl.textContent = totalOperations;
        correctAnswersEl.textContent = correctAnswers;
        incorrectAnswersEl.textContent = incorrectAnswers;
        precisionEl.textContent = `${precision}%`;
        levelEl.textContent = currentLevel;
        
        // Mensaje final basado en el puntaje
        let finalMessage = '';
        if(score <= 30) {
            finalMessage = "¡Sigue practicando! Vas mejorando tus habilidades matemáticas.";
        } else if(score <= 70) {
            finalMessage = "¡Buen trabajo! Vas mejorando tus habilidades matemáticas.";
        } else {
            finalMessage = "¡Excelente! Has demostrado grandes habilidades matemáticas.";
        }
        
        summaryMessageEl.textContent = finalMessage;
        
        // Mostrar resumen
        summaryEl.style.display = 'block';
    }
    
    // Event listeners
    startBtn.addEventListener('click', startGame);
    playAgainBtn.addEventListener('click', startGame);
});