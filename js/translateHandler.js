async function translateRowEmptyFields(row, referenceContent) {
    const inputs = row.querySelectorAll('input.verify_vazio');
    const translations = {};

    // Agrupa os inputs por idioma
    inputs.forEach(input => {
        if (!input.value) {
            const language = input.getAttribute('data-language');
            if (!translations[language]) {
                translations[language] = [];
            }
            translations[language].push(input);
        }
    });

    for (const language in translations) {
        const inputs = translations[language];
        for (let i = 0; i < inputs.length; i += 15) {
            const batch = inputs.slice(i, i + 15);
            const result = await fillWithAI(referenceContent, language);
            batch.forEach(input => {
                input.value = result;
                updateTranslationPercentage(language, translationsCache);
                checkEmptyFields();
            });
        }
    }
}

async function fillWithAI(referenceContent, language) {
    try {
        const chatSession = model.startChat({
            generationConfig: {
                temperature: 1,
                topP: 0.95,
                topK: 64,
                maxOutputTokens: 8192,
                responseMimeType: "text/plain",
            },
            history: [],
        });

        const result = await chatSession.sendMessage(`Translate the following content into ${language}: '${referenceContent}'. Ensure that placeholders like <%>, %user%, %target%, or similar remain completely unchanged and are not translated or modified. Adapt the surrounding text to fit the context naturally while keeping the placeholders intact. If emojis or special characters are present, retain them as is. Return only the translated string.`);
        return result.response.text();
    } catch (error) {
        alert(`Erro ao preencher com IA: ${error.message}`);
    }
}
