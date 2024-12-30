document.getElementById('add_key')?.addEventListener('click', function() {
    const key = prompt('Digite a nova chave:');
    if (key) {
        const languages = Object.keys(translationsCache);
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
            input.value = ''; // Inicializa o campo como nulo
            input.setAttribute('data-language', language); // Adiciona o atributo data-language
            input.setAttribute('readonly', true); // Bloqueia a edição direta
            input.addEventListener('focus', function() {
                openEditModal(input);
            });
            input.addEventListener('input', function() {
                updateTranslationPercentage(language, translationsCache);
            });

            if (!input.value) {
                hasEmptyField = true;
            }

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
            await fillWithAI(input, key, language);
        });

        fillCell.appendChild(fillButton);
        row.appendChild(fillCell);

        // Adiciona a linha ao início do tbody da tabela existente
        const tbody = document.getElementById('translations-tbody');
        tbody.insertBefore(row, tbody.firstChild);

        // Desloca o scroll para o novo item
        row.scrollIntoView({ behavior: 'smooth' });

        // Atualiza a porcentagem de todas as linguagens
        languages.forEach(language => {
            updateTranslationPercentage(language, translationsCache);
        });
    }
});

let currentEmptyFieldIndex = 0;

document.getElementById('next-empty-field')?.addEventListener('click', function() {
    const emptyFields = document.querySelectorAll('input.verify_vazio');
    if (emptyFields.length > 0) {
        currentEmptyFieldIndex = (currentEmptyFieldIndex + 1) % emptyFields.length;
        const row = emptyFields[currentEmptyFieldIndex].closest('tr');
        row.classList.add('highlight-row'); // Adiciona a classe highlight-row
        row.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            row.classList.remove('highlight-row'); // Remove a classe highlight-row após 1 segundo
        }, 1000);
    }
});

document.getElementById('prev-empty-field')?.addEventListener('click', function() {
    const emptyFields = document.querySelectorAll('input.verify_vazio');
    if (emptyFields.length > 0) {
        currentEmptyFieldIndex = (currentEmptyFieldIndex - 1 + emptyFields.length) % emptyFields.length;
        const row = emptyFields[currentEmptyFieldIndex].closest('tr');
        row.classList.add('highlight-row'); // Adiciona a classe highlight-row
        row.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            row.classList.remove('highlight-row'); // Remove a classe highlight-row após 1 segundo
        }, 1000);
    }
});
