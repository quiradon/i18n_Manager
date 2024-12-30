let translations = {}; // Definindo translations no escopo global

document.querySelector('#idiomas_input').addEventListener('change', function() {
    const fileInputs = document.querySelectorAll('#idiomas_input');
    const files = [];

    fileInputs.forEach(input => {
        Array.from(input.files).forEach(file => files.push(file));
    });

    if (files.length === 0) {
        alert('Por favor, selecione um ou mais arquivos JSON!');
        return;
    }

    // Ocultar o campo de inserir arquivos
    document.getElementById('upload-section').style.display = 'none';
    console.log('Campo de upload ocultado');

    let filesProcessed = 0;

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const jsonData = JSON.parse(e.target.result);
                const language = file.name.split('.')[0]; // Assume que o nome do arquivo é o código do idioma
                translations[language] = jsonData;
                filesProcessed++;

                if (filesProcessed === files.length) {
                    processTranslations(translations);
                }
            } catch (error) {
                console.error(`Erro ao processar o arquivo ${file.name}: ${error.message}`);
            }
        };
        reader.readAsText(file);
    });
});

function processTranslations(translations) {
    let referenceLanguage = Object.keys(translations)[0];
    let maxFilledKeys = 0;

    Object.keys(translations).forEach(language => {
        const filledKeys = countFilledKeys(translations[language]);
        if (filledKeys > maxFilledKeys) {
            maxFilledKeys = filledKeys;
            referenceLanguage = language;
        }
    });

    // Reordenar as traduções para garantir que o idioma de referência seja o primeiro
    const orderedTranslations = {};
    orderedTranslations[referenceLanguage] = translations[referenceLanguage];
    Object.keys(translations).forEach(language => {
        if (language !== referenceLanguage) {
            orderedTranslations[language] = translations[language];
        }
    });

    loadTranslations(orderedTranslations, document.getElementById('translations-container'));
    document.getElementById('translations-section').style.display = 'block';
    checkEmptyFields(); // Verificar campos vazios automaticamente
}