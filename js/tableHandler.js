let defaultLanguage = 'en';
let referenceLanguage = localStorage.getItem('reference-language') || 'en'; // Defina a linguagem de referência para inglês

function loadTranslations(translations, container) {
    container.innerHTML = '';
    const searchBar = document.getElementById('search-bar');
    searchBar?.addEventListener('input', function() {
        filterTable(this.value);
    });

    const table = document.createElement('table');
    table.id = 'translations-table';
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    tbody.id = 'translations-tbody';

    const headerRow = document.createElement('tr');
    const keyHeader = document.createElement('th');
    keyHeader.textContent = 'Chave';
    headerRow.appendChild(keyHeader);

    const languages = Object.keys(translations);

    let maxFilledKeys = 0;
    languages.forEach(language => {
        const filledKeys = countFilledKeys(translations[language]);
        if (filledKeys > maxFilledKeys) {
            maxFilledKeys = filledKeys;
            if (!localStorage.getItem('reference-language')) {
                referenceLanguage = language;
            }
        }
    });

    defaultLanguage = 'en';
    referenceLanguage = localStorage.getItem('reference-language') || 'en';
    const totalKeys = countKeys(translations[referenceLanguage]);

    languages.forEach(language => {
        const languageHeader = document.createElement('th');
        const filledKeys = countFilledKeys(translations[language]);
        const percentage = ((filledKeys / totalKeys) * 100).toFixed(2);
        languageHeader.textContent = `${language} (${percentage}%)`;
        languageHeader.setAttribute('data-language', language);
        headerRow.appendChild(languageHeader);
    });

    const actionsHeader = document.createElement('th');
    actionsHeader.textContent = 'Ações';
    headerRow.appendChild(actionsHeader);

    const fillHeader = document.createElement('th');
    fillHeader.textContent = 'Preencher';
    headerRow.appendChild(fillHeader);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const keys = new Set();
    languages.forEach(language => {
        function collectKeys(obj, parentKey = '') {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const fullKey = parentKey ? `${parentKey}.${key}` : key;
                    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                        collectKeys(obj[key], fullKey);
                    } else {
                        keys.add(fullKey);
                    }
                }
            }
        }
        collectKeys(translations[language]);
    });

    keys.forEach(key => {
        const row = document.createElement('tr');
        row.id = `row-${key}`;
        const keyCell = document.createElement('td');
        keyCell.textContent = key;
        keyCell.classList.add('key-cell');
        row.appendChild(keyCell);

        let hasEmptyField = false;

        languages.forEach(language => {
            const valueCell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.classList.add('expand-input', 'verify_vazio');
            input.setAttribute('data-language', language);
            input.setAttribute('readonly', true);

            const keys = key.split('.');
            let value = translations[language];
            keys.forEach(k => {
                if (value) value = value[k];
            });

            input.value = value || '';
            if (!input.value) {
                hasEmptyField = true;
            }

            input.addEventListener('focus', function() {
                openEditModal(input);
            });
            input.addEventListener('input', function() {
                updateTranslationPercentage(language);
            });

            valueCell.appendChild(input);
            row.appendChild(valueCell);
        });

        const actionsCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Deletar';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.addEventListener('click', function() {
            row.remove();
            languages.forEach(language => {
                updateTranslationPercentage(language);
            });
        });
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        const fillCell = document.createElement('td');
        const fillButton = document.createElement('button');
        fillButton.textContent = 'IA';
        fillButton.classList.add('btn', 'btn-primary', 'ml-2', 'ai-button');
        fillButton.disabled = false;
        fillButton.addEventListener('click', async function() {
            const keys = key.split('.');
            let referenceContent = translations[referenceLanguage];
            keys.forEach(k => {
                if (referenceContent) referenceContent = referenceContent[k];
            });

            if (!referenceContent) {
                alert('A string fornecida está vazia. Não há nada para traduzir.');
                return;
            }
            console.log('Reference Content:', referenceContent);
            await translateRowEmptyFields(row, referenceContent);
        });

        fillCell.appendChild(fillButton);
        row.appendChild(fillCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);

    languages.forEach(language => {
        updateTranslationPercentage(language);
    });
}

function countKeys(obj) {
    let count = 0;
    function countNestedKeys(o) {
        for (const key in o) {
            if (o.hasOwnProperty(key)) {
                if (typeof o[key] === 'object' && !Array.isArray(o[key])) {
                    countNestedKeys(o[key]);
                } else {
                    count++;
                }
            }
        }
    }
    countNestedKeys(obj);
    return count;
}

function countFilledKeys(obj) {
    let count = 0;
    function countNestedFilledKeys(o) {
        for (const key in o) {
            if (o.hasOwnProperty(key)) {
                if (typeof o[key] === 'object' && !Array.isArray(o[key])) {
                    countNestedFilledKeys(o[key]);
                } else if (o[key]) {
                    count++;
                }
            }
        }
    }
    countNestedFilledKeys(obj);
    return count;
}

function updateTranslationPercentage(language) {
    const inputs = document.querySelectorAll(`input[data-language="${language}"]`);
    const totalKeys = inputs.length;
    let filledKeys = 0;

    inputs.forEach(input => {
        if (input.value.trim() !== '') {
            filledKeys++;
        }
    });

    const percentage = ((filledKeys / totalKeys) * 100).toFixed(2);
    const header = document.querySelector(`th[data-language="${language}"]`);
    if (header) {
        header.textContent = `${language} (${percentage}%)`;
    }
}

function filterTable(searchTerm) {
    const rows = document.querySelectorAll('#translations-tbody tr');
    rows.forEach(row => {
        const keyCell = row.querySelector('.key-cell');
        if (keyCell && keyCell.textContent.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function clearProject() {
    const tbody = document.getElementById('translations-tbody');
    tbody.innerHTML = '';
    updateTranslationPercentage();
}

