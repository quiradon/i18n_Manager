function checkEmptyFields() {
    const inputs = document.querySelectorAll('input.verify_vazio'); // Seleciona apenas os inputs com a classe verify_vazio
    inputs.forEach(input => {
        const aiButton = input.previousElementSibling; // Seleciona o botão de IA ao lado esquerdo do input

        if (!input.value) {
            input.style.border = '2px solid red';
            if (aiButton) aiButton.style.display = 'inline-block'; // Mostra o botão de IA
        } else {
            input.style.border = '0px solid';
            if (aiButton) aiButton.style.display = 'none'; // Oculta o botão de IA
        }

        input.addEventListener('input', function() {
            if (input.value.trim() !== '') {
                input.style.border = '0px solid';
                if (aiButton) aiButton.style.display = 'none'; // Oculta o botão de IA
            } else {
                input.style.border = '2px solid red';
                if (aiButton) aiButton.style.display = 'inline-block'; // Mostra o botão de IA
            }
        });
    });
}
