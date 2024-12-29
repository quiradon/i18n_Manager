document.getElementById('settings-button').addEventListener('click', function() {
    const modal = document.getElementById('settings-modal');
    const closeButton = modal.querySelector('.close-button');
    const saveButton = document.getElementById('save-settings');
    const referenceLanguageSelect = document.getElementById('reference-language');
    const endSessionButton = document.getElementById('end-session');
    const apiTokenInput = document.getElementById('api-token');

    // Preencher o dropdown com os idiomas disponíveis
    referenceLanguageSelect.innerHTML = '';
    const languages = Object.keys(translationsCache);
    languages.forEach(language => {
        const option = document.createElement('option');
        option.value = language;
        option.textContent = language;
        referenceLanguageSelect.appendChild(option);
    });

    // Carregar o valor do api-token do cache
    apiTokenInput.value = localStorage.getItem('api-token') || '';

    modal.style.display = 'block';

    closeButton.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    window.onkeydown = function(event) {
        if (event.key === 'Escape') {
            modal.style.display = 'none';
        }
    };

    saveButton.onclick = function() {
        const selectedLanguage = referenceLanguageSelect.value;
        const apiToken = apiTokenInput.value;
        initializeGenAI(apiToken)
        localStorage.setItem('api-token', apiToken);
        alert(`Idioma de referência para IA selecionado: ${selectedLanguage}\nAPI Token salvo.`);
        modal.style.display = 'none';
    };

    endSessionButton.onclick = function() {
        localStorage.removeItem('api-token');
        alert('Sessão finalizada e progresso salvo removido.');
        location.reload();
    };
});
