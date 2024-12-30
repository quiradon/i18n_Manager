function openEditModal(input) {
    const modal = document.getElementById('edit-modal');
    const referenceContent = document.getElementById('reference-content');
    const editInput = document.getElementById('edit-input');
    const referenceLanguageDisplay = document.getElementById('reference-language-display');
    const currentLanguageDisplay = document.getElementById('current-language-display');

    const language = input.getAttribute('data-language');
    const key = input.closest('tr').querySelector('.key-cell').textContent;
    
    referenceLanguageDisplay.textContent = defaultLanguage;
    currentLanguageDisplay.textContent = language;

    const keys = key.split('.');
    let referenceValue = getNestedValue(translations[defaultLanguage] || {}, keys); // Garante que translations[defaultLanguage] esteja definido

    if (!translations[defaultLanguage]) {
        console.error(`translations[${defaultLanguage}] está indefinido`);
    }

    console.log('defaultLanguage:', defaultLanguage);
    console.log('translations[defaultLanguage]:', translations[defaultLanguage]);
    console.log('keys:', keys);
    console.log('referenceValue:', referenceValue);

    referenceContent.value = referenceValue || '';
    editInput.value = input.value;

    modal.style.display = 'block';

    document.getElementById('save-edit').onclick = function() { 
        input.value = editInput.value;
        updateTranslationPercentage(language);
        checkEmptyFields();
        modal.style.display = 'none';
    };

    document.querySelectorAll('.close-button').forEach(button => {
        button.onclick = function() {
            modal.style.display = 'none';
        };
    });
}

function getNestedValue(obj, keys) {
    return keys.reduce((o, k) => (o || {})[k], obj);
}
