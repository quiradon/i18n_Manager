document.getElementById('settings-button').addEventListener('click', function() {
    const modal = document.getElementById('settings-modal');
    const closeButton = modal.querySelector('.close-button');
    const saveButton = document.getElementById('save-settings');
    const referenceLanguageSelect = document.getElementById('reference-language');
    const apiTokenInput = document.getElementById('api-token');

    referenceLanguageSelect.innerHTML = '';
    const languages = Array.from(document.querySelectorAll('th[data-language]')).map(th => th.getAttribute('data-language'));
    languages.forEach(language => {
        const option = document.createElement('option');
        option.value = language;
        option.textContent = language;
        referenceLanguageSelect.appendChild(option);
    });

    apiTokenInput.value = localStorage.getItem('api-token') || '';

    modal.style.display = 'block';

    const closeModal = () => modal.style.display = 'none';
    closeButton.onclick = closeModal;
    window.onclick = event => { if (event.target == modal) closeModal(); };
    window.onkeydown = event => { if (event.key === 'Escape') closeModal(); };

    saveButton.onclick = () => {
        const selectedLanguage = referenceLanguageSelect.value;
        const apiToken = apiTokenInput.value;
        initializeGenAI(apiToken);
        localStorage.setItem('api-token', apiToken);
        alert(`Idioma de referência para IA selecionado: ${selectedLanguage}\nAPI Token salvo.`);
        closeModal();
    };
});
