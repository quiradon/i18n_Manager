let defaultLanguage = null; // Adiciona uma variável para armazenar o idioma padrão

function loadTranslations(translationsCache, container) {
    container.innerHTML = ''; // Limpa as traduções atuais
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', function() {
            filterTable(this.value);
        });
    }

    // Cria a tabela de traduções
    const table = document.createElement('table');
    table.id = 'translations-table'; // Adiciona um ID à tabela
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    tbody.id = 'translations-tbody'; // Adiciona um ID ao tbody

    // Cria o cabeçalho da tabela
    const headerRow = document.createElement('tr');
    const keyHeader = document.createElement('th');
    keyHeader.textContent = 'Chave';
    headerRow.appendChild(keyHeader);

    const languages = Object.keys(translationsCache);
    let referenceLanguage = languages[0]; // Assume o primeiro idioma como referência

    // Encontra o idioma com mais campos preenchidos
    let maxFilledKeys = 0;
    languages.forEach(language => {
        const filledKeys = countFilledKeys(translationsCache[language]);
        if (filledKeys > maxFilledKeys) {
            maxFilledKeys = filledKeys;
            referenceLanguage = language;
        }
    });

    defaultLanguage = referenceLanguage; // Define o idioma mais preenchido como padrão

    const totalKeys = countKeys(translationsCache[referenceLanguage]);

    languages.forEach(language => {
        const languageHeader = document.createElement('th');
        const filledKeys = countFilledKeys(translationsCache[language]);
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

    // Cria as linhas da tabela
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
        collectKeys(translationsCache[language]);
    });

    keys.forEach(key => {
        const row = document.createElement('tr');
        row.id = `row-${key}`; // Adiciona um ID à linha
        const keyCell = document.createElement('td');
        keyCell.textContent = key;
        keyCell.classList.add('key-cell'); // Adiciona a classe key-cell
        row.appendChild(keyCell);

        let hasEmptyField = false;

        languages.forEach(language => {
            const valueCell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.classList.add('expand-input', 'verify_vazio'); // Adiciona a classe verify_vazio
            input.setAttribute('data-language', language); // Adiciona o atributo data-language
            input.setAttribute('readonly', true); // Bloqueia a edição direta

            const keys = key.split('.');
            let value = translationsCache[language];
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
                updateTranslationPercentage(language, translationsCache);
            });

            valueCell.appendChild(input);
            row.appendChild(valueCell);
        });

        const actionsCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Deletar';
        deleteButton.classList.add('btn', 'btn-danger'); // Adiciona as classes btn e btn-primary
        deleteButton.addEventListener('click', function() {
            row.remove();
            languages.forEach(language => {
                updateTranslationPercentage(language, translationsCache);
            });
        });
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        const fillCell = document.createElement('td');
        const fillButton = document.createElement('button');
        fillButton.textContent = 'IA';
        fillButton.classList.add('btn', 'btn-primary', 'ml-2', 'ai-button'); // Adiciona as classes btn, btn-primary, ml-2 e ai-button
        fillButton.disabled = false; // Sempre ativa o botão
        fillButton.addEventListener('click', async function() {
            const keys = key.split('.');
            let referenceContent = translationsCache[referenceLanguage];
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

    // Atualiza a porcentagem de todas as linguagens
    languages.forEach(language => {
        updateTranslationPercentage(language, translationsCache);
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

function updateTranslationPercentage(language, translationsCache) {
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

