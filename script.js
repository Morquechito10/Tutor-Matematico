document.addEventListener('DOMContentLoaded', function() {
    // Efecto especial para los títulos
    const titles = document.querySelectorAll('h1, h2, h3, h4, h5');
    titles.forEach(title => {
        title.addEventListener('mouseover', () => {
            title.classList.add('animate__animated', 'animate__pulse');
        });
        title.addEventListener('animationend', () => {
            title.classList.remove('animate__animated', 'animate__pulse');
        });
    });
    
    // Mostrar modal de bienvenida automáticamente la primera vez
    if (!localStorage.getItem('welcomeShown')) {
        const welcomeModal = new bootstrap.Modal(document.getElementById('welcomeModal'));
        welcomeModal.show();
        localStorage.setItem('welcomeShown', 'true');
    }
    
    // Personaje animado con consejos
    const character = document.getElementById('helperCharacter');
    if (character) {
        // Añadir clase de animación flotante
        character.classList.add('floating');
        
        // Configurar consejos al hacer clic
        character.addEventListener('click', function() {
            const tips = [
                "¡Recuerda practicar todos los días para mejorar tus habilidades!",
                "¿Sabías que las matemáticas están en todas partes? ¡Incluso en tus videojuegos favoritos!",
                "Si un problema te parece difícil, divídelo en partes más pequeñas.",
                "¡Los errores son oportunidades para aprender algo nuevo!",
                "Prueba todos los juegos para descubrir cuál es tu favorito.",
                "Las matemáticas son como un superpoder: te ayudan a resolver problemas de la vida real.",
                "¡No te rindas! Cada vez que practicas, tu cerebro se hace más fuerte.",
                "Comparte lo que has aprendido con tus amigos y familiares."
            ];
            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            alert("🧠 Consejo del Profesor Pitágoras: " + randomTip);
        });
    }
    
    // Añadir efectos a las tarjetas de juegos
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const button = card.querySelector('.btn-primary');
            if (button) {
                button.classList.add('animate__animated', 'animate__heartBeat');
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const button = card.querySelector('.btn-primary');
            if (button) {
                button.classList.remove('animate__animated', 'animate__heartBeat');
            }
        });
    });
});