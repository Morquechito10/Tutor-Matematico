document.addEventListener('DOMContentLoaded', function() {
    const problemEl = document.getElementById('problem');
    const hintBtn = document.getElementById('hint-btn');
    const hintEl = document.getElementById('hint');
    const optionsEl = document.getElementById('options');
    const feedbackEl = document.getElementById('feedback');
    const scoreEl = document.getElementById('score');
    const timeEl = document.getElementById('time');
    const messageEl = document.getElementById('message');
    const difficultyEl = document.getElementById('difficulty');
    const startBtn = document.getElementById('start-btn');
    const summaryContainerEl = document.getElementById('summary-container');
    
    let score = 0;
    let time = 90;
    let timer;
    let currentProblem = {};
    let gameHistory = [];
    const MAX_SCORE = 150;
    
    // Banco de problemas ampliado (30 problemas)
    const problems = [
        // Nivel fácil (dificultad 1)
        {
            question: "Juan tiene 5 manzanas y María le da 3 más. ¿Cuántas manzanas tiene ahora Juan?",
            options: ["7", "8", "9", "10"],
            answer: "8",
            hint: "5 manzanas iniciales + 3 que recibe = ?",
            difficulty: 1
        },
        {
            question: "Un libro tiene 120 páginas. Si leo 30 páginas cada día, ¿en cuántos días lo terminaré?",
            options: ["3", "4", "5", "6"],
            answer: "4",
            hint: "Divide el total de páginas entre las páginas por día",
            difficulty: 1
        },
        {
            question: "Un tren recorre 300 km en 2 horas. ¿Cuál es su velocidad promedio?",
            options: ["120 km/h", "150 km/h", "180 km/h", "200 km/h"],
            answer: "150",
            hint: "Velocidad = Distancia / Tiempo",
            difficulty: 1
        },
        {
            question: "Un rectángulo tiene área de 24 cm². Si un lado mide 6 cm, ¿cuánto mide el otro lado?",
            options: ["3 cm", "4 cm", "5 cm", "6 cm"],
            answer: "4",
            hint: "Área = Lado × Lado",
            difficulty: 1
        },
        {
            question: "Si tengo 35 euros y gasto 12 euros en comida, ¿cuánto dinero me queda?",
            options: ["21 euros", "22 euros", "23 euros", "24 euros"],
            answer: "23",
            hint: "Resta la cantidad gastada del total inicial",
            difficulty: 1
        },
        {
            question: "¿Qué fracción de 24 es 6?",
            options: ["1/4", "1/3", "1/2", "2/3"],
            answer: "1/4",
            hint: "6 ÷ 24 = ?",
            difficulty: 1
        },
        {
            question: "Si 4 lápices cuestan 12 pesos, ¿cuánto cuestan 7 lápices?",
            options: ["18 pesos", "21 pesos", "24 pesos", "28 pesos"],
            answer: "21",
            hint: "Primero calcula el precio de un lápiz",
            difficulty: 1
        },
        {
            question: "La mitad de un número más 15 es igual a 40. ¿Cuál es ese número?",
            options: ["35", "45", "50", "55"],
            answer: "50",
            hint: "x/2 + 15 = 40, despeja x",
            difficulty: 1
        },
        // Nivel intermedio (dificultad 2)
        {
            question: "En una granja hay gallinas y conejos. Hay 12 cabezas y 34 patas. ¿Cuántas gallinas hay?",
            options: ["5", "6", "7", "8"],
            answer: "7",
            hint: "Cada gallina tiene 2 patas, cada conejo 4. Si hay G gallinas y C conejos: G + C = 12 y 2G + 4C = 34",
            difficulty: 2
        },
        {
            question: "Si 3 manzanas cuestan $45, ¿cuánto costarán 5 manzanas?",
            options: ["$60", "$65", "$70", "$75"],
            answer: "75",
            hint: "Primero encuentra el costo de una manzana",
            difficulty: 2
        },
        {
            question: "¿Qué número sigue en la secuencia: 2, 6, 12, 20, ___?",
            options: ["24", "28", "30", "32"],
            answer: "30",
            hint: "Patrón: 1×2, 2×3, 3×4, 4×5, 5×6",
            difficulty: 2
        },
        {
            question: "Si hoy es miércoles, ¿qué día será dentro de 15 días?",
            options: ["Jueves", "Viernes", "Sábado", "Domingo"],
            answer: "Jueves",
            hint: "15 días = 2 semanas y 1 día",
            difficulty: 2
        },
        {
            question: "En una caja hay 24 lápices: 1/3 son rojos, 1/4 son azules y el resto verdes. ¿Cuántos lápices verdes hay?",
            options: ["8", "10", "12", "14"],
            answer: "10",
            hint: "Calcula 1/3 de 24 y 1/4 de 24, luego resta",
            difficulty: 2
        },
        {
            question: "El doble de un número más 5 es igual a 17. ¿Cuál es el número?",
            options: ["4", "5", "6", "7"],
            answer: "6",
            hint: "2x + 5 = 17 → 2x = ?",
            difficulty: 2
        },
        // Nuevos problemas
        {
            question: "Un vendedor compra un producto a $200 y lo vende a $260. ¿Cuál es su porcentaje de ganancia?",
            options: ["20%", "25%", "30%", "35%"],
            answer: "30",
            hint: "% de ganancia = (Ganancia ÷ Costo) × 100",
            difficulty: 2
        },
        {
            question: "Si 8 trabajadores terminan una obra en 12 días, ¿cuántos días tardarán 6 trabajadores?",
            options: ["14", "16", "18", "20"],
            answer: "16",
            hint: "8 × 12 = 6 × x, despeja x",
            difficulty: 2
        },
        {
            question: "Un automóvil consume 6 litros de gasolina cada 100 km. ¿Cuántos litros consumirá en un viaje de 450 km?",
            options: ["24", "25", "26", "27"],
            answer: "27",
            hint: "Plantea una regla de tres: 6 litros es a 100 km como x litros es a 450 km",
            difficulty: 2
        },
        {
            question: "Al lanzar dos dados, ¿cuál es la probabilidad de obtener una suma de 7?",
            options: ["1/6", "1/8", "1/12", "1/36"],
            answer: "1/6",
            hint: "Hay 6 combinaciones favorables (1-6, 2-5, 3-4, 4-3, 5-2, 6-1) de 36 posibles",
            difficulty: 2
        },
        {
            question: "La edad de Pedro es el triple de la edad de Juan. Si Pedro tiene 24 años, ¿qué edad tiene Juan?",
            options: ["6", "8", "12", "18"],
            answer: "8",
            hint: "Si la edad de Pedro es 3 veces la de Juan, entonces 24 = 3 × (edad de Juan)",
            difficulty: 1
        },
        // Nivel 3 (dificultad 3) - Problemas más avanzados
        {
            question: "El promedio de 5 números es 18. Si se elimina uno de estos números, el promedio de los 4 restantes es 16. ¿Cuál fue el número eliminado?",
            options: ["22", "24", "26", "28"],
            answer: "26",
            hint: "Suma inicial = 5 × 18, suma final = 4 × 16",
            difficulty: 3
        },
        {
            question: "Un comerciante aumenta el precio de un artículo en un 25% y luego ofrece un descuento del 20%. ¿Cuál es el porcentaje de aumento real?",
            options: ["0%", "5%", "10%", "15%"],
            answer: "0",
            hint: "Nuevo precio = Precio original × 1.25 × 0.8",
            difficulty: 3
        },
        {
            question: "En un triángulo rectángulo, un ángulo mide 30° y la hipotenusa mide 12 cm. ¿Cuánto mide el cateto opuesto al ángulo de 30°?",
            options: ["4 cm", "6 cm", "8 cm", "10 cm"],
            answer: "6",
            hint: "Cateto opuesto = Hipotenusa × sen(30°)",
            difficulty: 3
        },
        {
            question: "En una progresión aritmética, el primer término es 5 y la diferencia común es 3. ¿Cuál es el valor del término número 12?",
            options: ["35", "37", "38", "39"],
            answer: "38",
            hint: "an = a1 + (n-1)d = 5 + (12-1)3",
            difficulty: 3
        },
        {
            question: "Un grifo llena un tanque en 12 horas y otro en 15 horas. Si ambos grifos están abiertos, ¿en cuántas horas se llenará el tanque?",
            options: ["5.5", "6.25", "6.7", "7.5"],
            answer: "6.7",
            hint: "1/t = 1/12 + 1/15",
            difficulty: 3
        },
        {
            question: "Si log₁₀(x) = 3, ¿cuál es el valor de x?",
            options: ["30", "100", "300", "1000"],
            answer: "1000",
            hint: "Si log₁₀(x) = 3, entonces x = 10³",
            difficulty: 3
        },
        {
            question: "El 15% de un número es 45. ¿Cuál es ese número?",
            options: ["300", "320", "330", "350"],
            answer: "300",
            hint: "Si 15% de x = 45, entonces 0.15x = 45",
            difficulty: 2
        },
        {
            question: "Si 5x - 3 = 2x + 9, ¿cuál es el valor de x?",
            options: ["2", "3", "4", "5"],
            answer: "4",
            hint: "Despeja la ecuación: 5x - 2x = 9 + 3",
            difficulty: 2
        },
        {
            question: "Un avión vuela a 720 km/h. ¿Cuántos metros recorre en 1 minuto?",
            options: ["10000", "12000", "15000", "18000"],
            answer: "12000",
            hint: "Convierte km/h a m/min: 720 km/h = 720000 m / 60 min",
            difficulty: 2
        },
        {
            question: "El perímetro de un cuadrado es 36 cm. ¿Cuál es su área?",
            options: ["36 cm²", "64 cm²", "81 cm²", "100 cm²"],
            answer: "81",
            hint: "Si el perímetro es 36 cm, cada lado mide 36/4 = 9 cm. El área es lado²",
            difficulty: 2
        }
    ];
    
    // Mensajes motivadores mejorados
    function getMotivationalMessage() {
        const messages = {
            negative: [
                "¡Tú puedes! 💪 Sigue intentando",
                "¡Cada error te acerca a la solución! 🌟",
                "¡Las matemáticas son un superpoder! 🦸"
            ],
            low: [
                "¡Buen comienzo! ⚡ Sigue así",
                "¡Vas por buen camino! 🛣️", 
                "¡Cada acierto cuenta! 🎯"
            ],
            medium: [
                "¡Excelente razonamiento! 🧠",
                "¡Eres un detective matemático! 🔍",
                "¡Lo tienes dominado! 😎"
            ],
            high: [
                "¡Increíble lógica! 🤯",
                "¡Eres un genio matemático! 🧮",
                "¡Perfecto! ¡Impresionante! 👏"
            ]
        };

        let category;
        if (score <= 0) category = "negative";
        else if (score <= 50) category = "low";
        else if (score <= 100) category = "medium";
        else category = "high";
        
        return messages[category][Math.floor(Math.random() * messages[category].length)];
    }

    function startGame() {
        score = 0;
        time = 90;
        gameHistory = [];
        scoreEl.textContent = score;
        timeEl.textContent = time;
        startBtn.style.display = 'none';
        feedbackEl.textContent = '';
        hintEl.style.display = 'none';
        messageEl.textContent = '¡A pensar se ha dicho! 🚀';
        messageEl.style.animation = 'fadeIn 0.5s, pulse 2s infinite';
        summaryContainerEl.style.display = 'none';
        
        // Mostrar elementos de juego
        document.querySelector('.game-elements').style.display = 'block';
        
        // Animación inicial
        problemEl.style.animation = 'fadeIn 1s';
        optionsEl.style.animation = 'fadeIn 1s';
        
        timer = setInterval(() => {
            time--;
            timeEl.textContent = time;
            
            // Animación de urgencia
            if(time <= 10) {
                timeEl.style.animation = 'pulse 0.5s infinite';
                timeEl.style.color = '#e74a3b';
            }
            
            if(time <= 0) {
                endGame();
            }
        }, 1000);
        
        generateProblem();
    }
    
    function generateProblem() {
        feedbackEl.textContent = '';
        feedbackEl.className = 'feedback';
        messageEl.textContent = getMotivationalMessage();
        
        // Seleccionar problema según dificultad ponderada: 50% nivel 1, 35% nivel 2, 15% nivel 3
        let difficultyLevel;
        const randomValue = Math.random();
        if (randomValue < 0.5) difficultyLevel = 1;
        else if (randomValue < 0.85) difficultyLevel = 2;
        else difficultyLevel = 3;
        
        // Filtrar problemas que aún no se han usado en esta partida
        let availableProblems = problems.filter(p => 
            p.difficulty === difficultyLevel && 
            !gameHistory.some(h => h.question === p.question)
        );
        
        // Si no hay problemas disponibles de ese nivel, usar cualquiera del nivel
        if (availableProblems.length === 0) {
            availableProblems = problems.filter(p => p.difficulty === difficultyLevel);
        }
        
        const problem = availableProblems[Math.floor(Math.random() * availableProblems.length)];
        
        currentProblem = problem;
        problemEl.textContent = problem.question;
        hintEl.textContent = problem.hint;
        
        // Mostrar dificultad
        let difficultyText, difficultyClass;
        if (problem.difficulty === 1) {
            difficultyText = 'Fácil';
            difficultyClass = 'easy';
        } else if (problem.difficulty === 2) {
            difficultyText = 'Intermedio';
            difficultyClass = 'medium';
        } else {
            difficultyText = 'Avanzado';
            difficultyClass = 'hard';
        }
        
        difficultyEl.textContent = difficultyText;
        difficultyEl.className = `difficulty-indicator ${difficultyClass}`;
        difficultyEl.style.animation = 'fadeIn 0.5s';
        
        // Mostrar opciones con animación escalonada
        showOptions(problem.options.sort(() => Math.random() - 0.5));
    }
    
    function showOptions(options) {
        optionsEl.innerHTML = '';
        
        options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.style.animationDelay = `${index * 0.1}s`;
            button.addEventListener('click', function() {
                checkAnswer(option);
            });
            optionsEl.appendChild(button);
        });
    }
    
    function checkAnswer(selectedOption) {
        // Animación al seleccionar
        event.target.style.animation = 'pulse 0.3s';
        
        const isCorrect = selectedOption == currentProblem.answer;
        let pointsEarned = 0;
        
        // Registrar este problema en el historial
        gameHistory.push({
            question: currentProblem.question,
            difficulty: currentProblem.difficulty,
            userAnswer: selectedOption,
            correctAnswer: currentProblem.answer,
            isCorrect: isCorrect
        });
        
        if(isCorrect) {
            feedbackEl.textContent = [
                "¡Correcto! 🎯",
                "¡Respuesta exacta! ⭐",
                "¡Perfecto! 👏"
            ][Math.floor(Math.random() * 3)];
            feedbackEl.className = 'feedback correct';
            
            // Puntaje según dificultad
            if (currentProblem.difficulty === 1) pointsEarned = 10;
            else if (currentProblem.difficulty === 2) pointsEarned = 15;
            else pointsEarned = 20; // Nivel 3
            
            score += pointsEarned;
            
            // Animación de celebración
            problemEl.style.animation = 'celebrate 0.5s';
        } else {
            feedbackEl.textContent = [
                `¡Casi! La respuesta era ${currentProblem.answer}`,
                `¡Sigue intentando! Era ${currentProblem.answer}`,
                `¡Buen intento! Correcto: ${currentProblem.answer}`
            ][Math.floor(Math.random() * 3)];
            feedbackEl.className = 'feedback incorrect';
            score = Math.max(0, score - 5);
            
            // Animación de error
            problemEl.style.animation = 'shake 0.5s';
        }
        
        score = Math.min(score, MAX_SCORE);
        scoreEl.textContent = score;
        scoreEl.style.animation = 'pulse 0.5s';
        
        setTimeout(() => {
            scoreEl.style.animation = '';
            generateProblem();
        }, 1500);
    }
    
    hintBtn.addEventListener('click', function() {
        if(hintEl.style.display === 'none') {
            hintEl.style.display = 'block';
            hintEl.style.animation = 'fadeIn 0.5s';
            score = Math.max(0, score - 3);
            scoreEl.textContent = score;
        } else {
            hintEl.style.display = 'none';
        }
    });
    
    function endGame() {
        clearInterval(timer);
        
        // Deshabilitar opciones
        const optionButtons = document.querySelectorAll('.option-btn');
        optionButtons.forEach(button => {
            button.disabled = true;
            button.style.animation = 'fadeOut 0.5s';
        });

        // Ocultar elementos del juego
        document.querySelector('.game-elements').style.display = 'none';
        
        // Mostrar resumen
        showSummary();
    }
    
    function showSummary() {
        // Contar estadísticas
        const totalProblems = gameHistory.length;
        const correctProblems = gameHistory.filter(p => p.isCorrect).length;
        const incorrectProblems = totalProblems - correctProblems;
        const accuracy = totalProblems > 0 ? Math.round((correctProblems / totalProblems) * 100) : 0;
        
        // Determinar nivel logrado
        let nivelLogrado;
        if (score <= 30) nivelLogrado = 1;
        else if (score <= 70) nivelLogrado = 2;
        else nivelLogrado = 3;
        
        // Mensaje según puntaje
        let mensaje = '';
        if(score <= 25) {
            mensaje = '¡Sigue practicando! Vas mejorando tus habilidades matemáticas.';
        } else if(score <= 70) {
            mensaje = '¡Bien hecho! Vas mejorando tus habilidades matemáticas.';
        } else if(score <= 120) {
            mensaje = '¡Excelente! Tienes un gran dominio de las matemáticas.';
        } else {
            mensaje = '¡Increíble! Tus habilidades matemáticas son impresionantes.';
        }
        
        // Construir HTML del resumen
        summaryContainerEl.innerHTML = `
            <div class="summary-header">
                <h2>Tiempo: ${90-time}s</h2>
                <div class="level-indicator">Nivel ${nivelLogrado}</div>
                <h1>Puntuación Final: ${score}</h1>
                <p class="summary-message">${mensaje}</p>
            </div>
            
            <div class="summary-stats">
                <div class="stat-box">
                    <h3>Operaciones</h3>
                    <p>${totalProblems}</p>
                </div>
                <div class="stat-box">
                    <h3>Correctas</h3>
                    <p>${correctProblems}</p>
                </div>
                <div class="stat-box">
                    <h3>Incorrectas</h3>
                    <p>${incorrectProblems}</p>
                </div>
                <div class="stat-box">
                    <h3>Precisión</h3>
                    <p>${accuracy}%</p>
                </div>
                <div class="stat-box">
                    <h3>Nivel</h3>
                    <p>${nivelLogrado}</p>
                </div>
            </div>
            
            <button id="play-again-btn" class="btn btn-primary btn-lg">¡Jugar de nuevo!</button>
            <button id="view-details-btn" class="btn btn-secondary">Ver detalles</button>
        `;
        
        // Mostrar resumen con animación
        summaryContainerEl.style.display = 'block';
        summaryContainerEl.style.animation = 'fadeIn 1s';
        
        // Agregar eventos a botones
        document.getElementById('play-again-btn').addEventListener('click', startGame);
        document.getElementById('view-details-btn').addEventListener('click', showDetailsModal);
    }
    
    function showDetailsModal() {
        // Crear modal para detalles
        const modal = document.createElement('div');
        modal.className = 'details-modal';
        
        // Contenido del modal con historial de problemas
        let problemsHtml = '';
        gameHistory.forEach((problem, index) => {
            const difficultyClass = problem.difficulty === 1 ? 'easy' : problem.difficulty === 2 ? 'medium' : 'hard';
            const resultClass = problem.isCorrect ? 'correct-answer' : 'incorrect-answer';
            
            problemsHtml += `
                <div class="problem-record ${resultClass}">
                    <div class="problem-number">${index + 1}</div>
                    <div class="problem-difficulty ${difficultyClass}">
                        ${problem.difficulty === 1 ? 'Fácil' : problem.difficulty === 2 ? 'Intermedio' : 'Avanzado'}
                    </div>
                    <div class="problem-content">
                        <p>${problem.question}</p>
                        <div class="problem-answer">
                            <span>Tu respuesta: ${problem.userAnswer}</span>
                            <span>Respuesta correcta: ${problem.correctAnswer}</span>
                        </div>
                    </div>
                    <div class="problem-result">
                        ${problem.isCorrect ? '✓' : '✗'}
                    </div>
                </div>
            `;
        });
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Detalle de respuestas</h2>
                    <button id="close-modal" class="close-button">&times;</button>
                </div>
                <div class="modal-body">
                    ${problemsHtml}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Animar entrada del modal
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
        
        // Evento para cerrar modal
        document.getElementById('close-modal').addEventListener('click', () => {
            modal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });
    }
    
    startBtn.addEventListener('click', startGame);
});