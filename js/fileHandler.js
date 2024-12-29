const translationsCache = {}; // Defina a variável translationsCache aqui

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
                translationsCache[language] = jsonData;
                filesProcessed++;

                if (filesProcessed === files.length) {
                    loadTranslations(translationsCache, document.getElementById('translations-container'));
                    document.getElementById('translations-section').style.display = 'block';
                    checkEmptyFields(); // Verificar campos vazios automaticamente
                }
            } catch (error) {
                console.error(error);
            }
        };
        reader.readAsText(file);
    });
});
