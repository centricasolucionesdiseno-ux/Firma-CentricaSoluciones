document.addEventListener('DOMContentLoaded', function() {

    // --- Base de datos y elementos comunes ---
    
    const generarBtn = document.getElementById('generar-btn');
    const firmaContainer = document.getElementById('firma-container');
    const copyBtn = document.getElementById('copy-btn');
    const mobileActionBtn = document.getElementById('mobile-action-btn');
    const generadoSpan = document.getElementById('generado');

    const formInputs = {
        nombre: document.getElementById('nombre'),
        cargo: document.getElementById('cargo'),
        tef: document.getElementById('tef'),

    };
    
    const signatureOutputs = {
        nombre: document.getElementById('nombre-empleado'),
        cargo: document.getElementById('cargo-empleado'),
        tef: document.getElementById('tef-empleado'),
        mobileWrapper: document.getElementById('mobile-field-wrapper'),
        banner: document.getElementById('banner-image'),
        bannerLink: document.getElementById('banner-link')
    };

    // --- Funciones ---
    function toTitleCase(str) {
        if (!str) return '';
        return str.toLowerCase().split(' ').map(function(word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
    }

    function updateSignature() {
        const nombreVal = toTitleCase(formInputs.nombre.value.trim());
        const cargoVal = toTitleCase(formInputs.cargo.value.trim());
        const tefVal = formInputs.tef.value.trim();
        
        signatureOutputs.nombre.textContent = nombreVal;
        signatureOutputs.cargo.textContent = cargoVal;

        if (tefVal) {
            const formattedTef = `${tefVal.substring(0, 3)} ${tefVal.substring(3, 6)} ${tefVal.substring(6, 9)}`;
            signatureOutputs.tef.textContent = formattedTef;
            signatureOutputs.mobileWrapper.style.display = 'inline';
        } else {
            signatureOutputs.mobileWrapper.style.display = 'none';
        }
    }
    
    function selectText(element) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        const range = document.createRange();
        range.selectNodeContents(element);
        selection.addRange(range);
    }

    function copySignature(buttonElement) {
        let success = false;
        try {
            if (navigator.clipboard && navigator.clipboard.write) {
                const firmaHTML = firmaContainer.innerHTML;
                const blob = new Blob([firmaHTML], { type: 'text/html' });
                const clipboardItem = new ClipboardItem({ 'text/html': blob });

                navigator.clipboard.write([clipboardItem]).then(() => {
                    buttonElement.textContent = '¡Copiado!';
                    buttonElement.classList.add('copied');
                    success = true;
                }).catch(err => {
                    selectText(firmaContainer);
                    success = document.execCommand('copy');
                    if (success) {
                        buttonElement.textContent = '¡Copiado!';
                        buttonElement.classList.add('copied');
                    }
                });
            } else {
                 selectText(firmaContainer);
                 success = document.execCommand('copy');
                 if(success) {
                    buttonElement.textContent = '¡Copiado!';
                    buttonElement.classList.add('copied');
                 }
            }
        } catch (err) {
            console.error("Error al copiar:", err);
        }
        return success;
    }
    
    // --- Event Listeners ---
    if (generarBtn) {
        if (formInputs.nombre) {
            formInputs.nombre.addEventListener('input', function(e) {
                const start = e.target.selectionStart;
                const end = e.target.selectionEnd;
                e.target.value = toTitleCase(e.target.value);
                e.target.setSelectionRange(start, end);
            });
        }
        
        if (formInputs.cargo) {
            formInputs.cargo.addEventListener('input', function(e) {
                const start = e.target.selectionStart;
                const end = e.target.selectionEnd;
                e.target.value = toTitleCase(e.target.value);
                e.target.setSelectionRange(start, end);
            });
        }

        if (formInputs.tef) {
            formInputs.tef.addEventListener('input', function(e) { e.target.value = e.target.value.replace(/\D/g, ''); });
        }
        
        generarBtn.addEventListener('click', function() {
            if (!formInputs.nombre.value.trim() || !formInputs.cargo.value.trim()) {
                alert('Por favor, rellena todos los campos obligatorios: Nombre y Cargo.');
                return;
            }
            updateSignature();
            if(copyBtn) copyBtn.disabled = false;
            if(mobileActionBtn) mobileActionBtn.disabled = false;
            
            generadoSpan.textContent = ' ¡Firma generada!';
            generadoSpan.style.color = 'green';
            generadoSpan.style.fontWeight = 'bold';
            generadoSpan.style.marginLeft = '10px';
        });

        Object.values(formInputs).forEach(input => {
            if (input) { 
                input.addEventListener('input', () => {
                    if(copyBtn) copyBtn.disabled = true;
                    if(mobileActionBtn) mobileActionBtn.disabled = true;
                    generadoSpan.textContent = '';
                });
            }
        });
    }

    // Lógica para el botón de Copiar (Escritorio/Web)
    if (copyBtn && firmaContainer) {
        copyBtn.addEventListener('click', function() {
            if (copyBtn.disabled) return;
            copySignature(copyBtn);
            setTimeout(() => {
                copyBtn.textContent = 'Copiar Firma';
                copyBtn.classList.remove('copied');
            }, 5000);
        });
    }
    
    // Lógica híbrida para el botón de Móvil
    if (mobileActionBtn && firmaContainer) {
        mobileActionBtn.addEventListener('click', function() {
            if (mobileActionBtn.disabled) return;
            
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

            if (isIOS) {
                copySignature(mobileActionBtn);
            } else {
                selectText(firmaContainer);
                mobileActionBtn.textContent = '¡Texto seleccionado!';
                mobileActionBtn.classList.add('copied');
            }

            setTimeout(() => {
                mobileActionBtn.textContent = 'Copiar / Seleccionar';
                mobileActionBtn.classList.remove('copied');
            }, 5000);
        });
    }
});
