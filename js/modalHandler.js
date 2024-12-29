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
    let referenceValue = translationsCache[defaultLanguage];
    keys.forEach(k => {
        if (referenceValue) referenceValue = referenceValue[k];
    });

    referenceContent.value = referenceValue || '';
    editInput.value = input.value;

    modal.style.display = 'block';

    document.getElementById('save-edit').onclick = function() {
        input.value = editInput.value;
        updateTranslationPercentage(language, translationsCache);
        checkEmptyFields()
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
