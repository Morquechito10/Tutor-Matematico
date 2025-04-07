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
            question: "Si en mi monedero tengo 20 monedas entre monedas de 1 y 2 euros, y en total suman 30 euros, ¿cuántas monedas de 2 euros tengo?",
            options: ["8", "10", "12", "14"],
            answer: "10",
            hint: "Si x = monedas de 1€ e y = monedas de 2€, entonces x + y = 20 y x + 2y = 30",
            difficulty: 1
        },
        {
            question: "Un rectángulo tiene área de 24 cm². Si un lado mide 6 cm, ¿cuánto mide el otro lado?",
            options: ["3 cm", "4 cm", "5 cm", "6 cm"],
            answer: "4 cm",
            hint: "Área = Largo × Ancho, entonces 24 = 6 × ?",
            difficulty: 1
        },
        {
            question: "Si tengo 35 euros y gasto 12 euros en comida, ¿cuánto dinero me queda?",
            options: ["21 euros", "22 euros", "23 euros", "24 euros"],
            answer: "23 euros",
            hint: "Resta la cantidad gastada del total inicial",
            difficulty: 1
        },
        {
            question: "En una secuencia, cada número es la suma de los dos anteriores: 2, 3, 5, 8, ___. ¿Qué número sigue?",
            options: ["11", "12", "13", "14"],
            answer: "13",
            hint: "8 + 5 = ?",
            difficulty: 1
        },
        {
            question: "Si 4 lápices cuestan 12 pesos, ¿cuánto cuestan 7 lápices?",
            options: ["18 pesos", "21 pesos", "24 pesos", "28 pesos"],
            answer: "21 pesos",
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
            question: "En una granja hay gallinas y conejos. Hay 10 cabezas y 26 patas. ¿Cuántas gallinas hay?",
            options: ["5", "6", "7", "8"],
            answer: "7",
            hint: "Cada gallina tiene 2 patas, cada conejo 4. Si hay G gallinas y C conejos: G + C = 10 y 2G + 4C = 26",
            difficulty: 2
        },
        {
            question: "En un juego de lógica, si ▲ = 5, ■ = 8 y ● = 12, ¿cuánto vale ▲ + ● - ■?",
            options: ["7", "9", "11", "13"],
            answer: "9",
            hint: "Sustituye los valores y realiza la operación: 5 + 12 - 8",
            difficulty: 1
        },
        {
            question: "¿Qué número sigue en la secuencia: 2, 4, 6, 8, ___?",
            options: ["9", "10", "12", "14"],
            answer: "10",
            hint: "Cada número aumenta en 2 unidades",
            difficulty: 1
        },
        {
            question: "Si hoy es miércoles, ¿qué día será dentro de 14 días?",
            options: ["Lunes", "Martes", "Miércoles", "Jueves"],
            answer: "Miércoles",
            hint: "14 días = 2 semanas exactas",
            difficulty: 1
        },
        {
            question: "En una caja hay 20 lápices: 5 son rojos, 10 son azules y el resto verdes. ¿Cuántos lápices verdes hay?",
            options: ["3", "5", "7", "9"],
            answer: "5",
            hint: "Resta del total el número de lápices rojos y azules: 20 - 5 - 10",
            difficulty: 1
        },
        {
            question: "Elena tiene el doble de canicas que Pedro. Si Pedro tiene 15 canicas, ¿cuántas tienen entre los dos?",
            options: ["30", "45", "60", "75"],
            answer: "45",
            hint: "Elena tiene 30 canicas. Suma las canicas de ambos.",
            difficulty: 1
        },
        // Problemas de lógica y patrones simplificados
        {
            question: "Un vendedor visita 4 ciudades sin repetir ninguna y volviendo al punto de partida. ¿Cuántas rutas diferentes puede tomar?",
            options: ["6", "12", "18", "24"],
            answer: "6",
            hint: "Para 4 ciudades, hay (4-1)!/2 = 3!/2 rutas posibles",
            difficulty: 2
        },
        {
            question: "Si 6 trabajadores terminan una obra en 8 días, ¿cuántos trabajadores se necesitarían para terminarla en 4 días?",
            options: ["9", "10", "12", "15"],
            answer: "12",
            hint: "6 × 8 = x × 4, despeja x",
            difficulty: 2
        },
        {
            question: "En un patrón de números: 1, 4, 9, 16, ___. ¿Qué número sigue?",
            options: ["20", "23", "25", "36"],
            answer: "25",
            hint: "Son los números cuadrados: 1², 2², 3², 4², 5²",
            difficulty: 1
        },
        {
            question: "Si lanzo un dado, ¿cuál es la probabilidad de obtener un número par?",
            options: ["1/6", "1/3", "1/2", "2/3"],
            answer: "1/2",
            hint: "Los números pares son 2, 4 y 6 (3 de 6 posibilidades)",
            difficulty: 1
        },
        {
            question: "¿Cuántos cuadrados de 1×1 hay en un tablero de ajedrez normal?",
            options: ["32", "49", "64", "81"],
            answer: "64",
            hint: "Un tablero de ajedrez tiene 8 filas y 8 columnas",
            difficulty: 1
        },
        // Reemplazos para nivel 3 (más sencillos)
        {
            question: "El promedio de 3 números es 15. Si dos de los números son 12 y 18, ¿cuál es el tercer número?",
            options: ["10", "12", "15", "16"],
            answer: "15",
            hint: "La suma de los tres números es 3 × 15 = 45. Ya conoces dos números que suman 30.",
            difficulty: 2
        },
        {
            question: "En una carrera participan 5 corredores. ¿De cuántas formas distintas pueden ocuparse el primer y segundo lugar?",
            options: ["10", "15", "20", "25"],
            answer: "20",
            hint: "Para el primer lugar hay 5 opciones, y para el segundo lugar quedan 4 opciones. 5 × 4 = ?",
            difficulty: 2
        },
        {
            question: "En un triángulo rectángulo, los catetos miden 3 cm y 4 cm. ¿Cuánto mide la hipotenusa?",
            options: ["5 cm", "6 cm", "7 cm", "8 cm"],
            answer: "5 cm",
            hint: "Usa el teorema de Pitágoras: a² + b² = c²",
            difficulty: 2
        },
        {
            question: "En una secuencia aritmética: 3, 7, 11, 15, ___. ¿Qué número sigue?",
            options: ["17", "18", "19", "20"],
            answer: "19",
            hint: "La diferencia entre cada número es 4",
            difficulty: 1
        },
        {
            question: "Un grifo llena un tanque en 10 minutos y otro en 15 minutos. Si ambos grifos están abiertos, ¿en cuántos minutos se llenará el tanque?",
            options: ["5", "6", "7", "8"],
            answer: "6",
            hint: "1/t = 1/10 + 1/15",
            difficulty: 2
        },
        {
            question: "Si 10² = 100, ¿cuánto es 10³?",
            options: ["300", "500", "1000", "3000"],
            answer: "1000",
            hint: "10³ = 10 × 10 × 10",
            difficulty: 1
        },
        {
            question: "El 20% de un número es 60. ¿Cuál es ese número?",
            options: ["240", "300", "320", "360"],
            answer: "300",
            hint: "Si 20% de x = 60, entonces 0.2x = 60",
            difficulty: 2
        },
        // Problemas de lógica espacial y visual simplificados
        {
            question: "Una caja tiene forma de cubo y cada arista mide 4 cm. ¿Cuál es su volumen?",
            options: ["16 cm³", "32 cm³", "48 cm³", "64 cm³"],
            answer: "64 cm³",
            hint: "El volumen de un cubo es lado × lado × lado",
            difficulty: 1
        },
        {
            question: "Un auto viaja a 60 km/h. ¿Cuántos kilómetros recorre en 2 horas?",
            options: ["90", "100", "110", "120"],
            answer: "120",
            hint: "Distancia = Velocidad × Tiempo",
            difficulty: 1
        },
        {
            question: "En una secuencia lógica: 2, 4, 8, 16, ___. ¿Qué número sigue?",
            options: ["24", "28", "32", "36"],
            answer: "32",
            hint: "Cada número se multiplica por 2 para obtener el siguiente",
            difficulty: 1
        },
        {
            question: "Si 3 gatos cazan 6 ratones en 2 horas, ¿cuántos ratones cazarán 6 gatos en 4 horas?",
            options: ["12", "18", "24", "36"],
            answer: "24",
            hint: "Duplicamos los gatos y duplicamos el tiempo",
            difficulty: 2
        },
        {
            question: "Una pizza fue dividida en 8 porciones iguales. Si Juan comió 3 porciones y María 2, ¿qué fracción de la pizza queda?",
            options: ["3/8", "2/8", "1/2", "5/8"],
            answer: "3/8",
            hint: "Entre los dos comieron 5 porciones de 8",
            difficulty: 1
        },
        {
            question: "En un calendario, si hoy es lunes, ¿qué día será después de 10 días?",
            options: ["Lunes", "Martes", "Miércoles", "Jueves"],
            answer: "Jueves",
            hint: "10 días = 1 semana y 3 días",
            difficulty: 1
        },
        {
            question: "Si 2 niños inflan 8 globos en 4 minutos, ¿cuántos globos pueden inflar 6 niños en 8 minutos?",
            options: ["24", "36", "42", "48"],
            answer: "48",
            hint: "Si hay 3 veces más niños y el doble de tiempo, ¿cuántas veces más globos?",
            difficulty: 2
        },
        {
            question: "Observa la secuencia: 2, 4, 8, 16, ____, 64. ¿Qué número falta?",
            options: ["24", "30", "32", "48"],
            answer: "32",
            hint: "Observa cómo va aumentando cada número, ¿Qué operación se está repitiendo?",
            difficulty: 1
        },
        {
            question: "Si Juan tiene 3 veces más lápices que Ana, y Ana tiene 4, ¿Cuántos tiene Juan?",
            options: ["7", "8", "12", "16"],
            answer: "12",
            hint: "Multiplica la cantidad de Ana por 3",
            difficulty: 1
        },
        {
            question: "Si hoy es miércoles, ¿Qué día será en 5 días?",
            options: ["Lunes", "Martes", "Domingo", "Sábado"],
            answer: "Lunes",
            hint: "Cuenta los días hacia adelante desde el miércoles.",
            difficulty: 1
        },
        {
            question: "En una carrera, si pasas al segundo lugar, ¿En qué lugar estás ahora?",
            options: ["Primero", "Segundo", "Tercero", "Cuarto"],
            answer: "Segundo",
            hint: "No pienses en el que estaba atrás de ti, sino en a quién adelantaste.",
            difficulty: 1
        },
        {
            question: "Un rectángulo tiene 2 lados cortos y 2 largos. Si cada lado corto mide 3cm y cada lado largo 7cm, ¿Cuál es el perímetro?",
            options: ["18 cm", "20 cm", "22 cm", "24 cm"],
            answer: "20 cm",
            hint: "Suma todos los lados",
            difficulty: 1
        },
        {
            question: "Si 3 cajas pesan 15 kg, ¿Cuánto pesa 1 caja?",
            options: ["3 kg", "4 kg", "5 kg", "6 kg"],
            answer: "5 kg",
            hint: "Divide el total entre el número de cajas",
            difficulty: 2
        },
        {
            question: "Laura tiene 24 canicas. Si las reparte entre 6 niños, ¿Cuántas recibe cada uno?",
            options: ["3", "4", "5", "6"],
            answer: "4",
            hint: "Usa la división",
            difficulty: 2
        },
        {
            question: "Si una pizza se parte en 8 rebanadas y se comen 3, ¿Qué fracción queda?",
            options: ["3/8", "5/8", "1/4", "2/3"],
            answer: "5/8",
            hint: "Resta las rebanadas comidas del total.",
            difficulty: 2
        },
        {
            question: "Observa la secuencia: 2, 3, 5, 12, ____. ¿Qué número falta?",
            options: ["16", "17", "18", "20"],
            answer: "17",
            hint: "Suma el número anterior con el siguiente.",
            difficulty: 2
        },
        {
            question: "En un zoológico hay 3 jaulas. Cada jaula tiene 4 pájaros y cada pájaro tiene 2 alas, ¿Cuántas alas hay en total?",
            options: ["12", "18", "24", "30"],
            answer: "24",
            hint: "Multiplica jaulas por pájaros y luego por alas.",
            difficulty: 3
        },
        {
            question: "Si un tren sale a las 2:00 pm y tarda 2 horas con 45 minutos, ¿a qué hora llega?",
            options: ["4:45 pm", "4:30 pm", "5:00 pm", "5:15 pm"],
            answer: "4:45 pm",
            hint: "Suma primero las horas y luego los minutos.",
            difficulty: 3
        },
        {
            question: "Un número es dibisible entre 2 y entre 3. ¿Cuál puede ser?",
            options: ["5", "9", "12", "15"],
            answer: "12",
            hint: "Busca un número divisible entre ambos.",
            difficulty: 3
        },
        {
            question: "Observa la secuencia: 1, 1, 2, 3, 5, 8, ___. ¿Qué número continúa?",
            options: ["11", "12", "13", "14"],
            answer: "13",
            hint: "Suma los dos números anteriores",
            difficulty: 3
        },
        {
            question: "Un tren tiene vagones con 8 asientos en los cuales caben 3 personas. Si el tren tiene 5 vagones, ¿Cuántas personas pueden viajar?",
            options: ["120", "130", "140", "150"],
            answer: "120",
            hint: "Multiplica el número de vagones con el número de asientos y luego por el número de personas que caben.",
            difficulty: 3
        },
        {
            question: "Un tren de 50 metros de largo pasa completamente por un túnel de 150 metros en 10 segundos. ¿Cuál es la velocidad del tren en metros por segundo?",
            options: ["15 m/s", "20 m/s", "25 m/s", "30 m/s"],
            answer: "20 m/s",
            hint: "El tren debe recorrer su propia longitud más la del túnel: 50 + 150 = 200 metros",
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