// MechaCore - Registro de Usuarios
// Funcionalidad completa del formulario

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    
    // visualización de contraseña
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = btn.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Validación en tiempo real
    const inputs = form.querySelectorAll('input:not([type="checkbox"])');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.parentElement.parentElement.classList.contains('error')) {
                validateField(input);
            }
        });
    });

    // Validar campo individual
    function validateField(field) {
        const formGroup = field.closest('.form-group');
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        // Remover mensaje de error anterior
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) existingError.remove();

        // Validaciones específicas
        switch(field.name) {
            case 'fullName':
                if (value.length < 3) {
                    isValid = false;
                    message = 'El nombre debe tener al menos 3 caracteres';
                } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                    isValid = false;
                    message = 'El nombre solo puede contener letras';
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    message = 'Ingresa un correo electrónico válido';
                }
                break;
                
            case 'password':
                if (value.length < 8) {
                    isValid = false;
                    message = 'La contraseña debe tener al menos 8 caracteres';
                } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                    isValid = false;
                    message = 'Debe incluir mayúscula, minúscula y número';
                }
                break;
                
            case 'confirmPassword':
                const password = document.getElementById('password').value;
                if (value !== password) {
                    isValid = false;
                    message = 'Las contraseñas no coinciden';
                }
                break;
        }

        // Aplicar estado
        if (isValid) {
            formGroup.classList.remove('error');
            formGroup.classList.add('success');
        } else {
            formGroup.classList.remove('success');
            formGroup.classList.add('error');
            
            // Agregar mensaje de error
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            errorSpan.textContent = message;
            formGroup.appendChild(errorSpan);
        }

        return isValid;
    }

    // ===== NUEVAS VALIDACIONES PARA SELECTS Y DOCUMENTO =====

    // Validación para selects (tipo documento y rol)
    const selects = form.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', () => validateSelect(select));
        select.addEventListener('blur', () => validateSelect(select));
    });

    // Validar campo select individual
    function validateSelect(field) {
        const formGroup = field.closest('.form-group');
        const value = field.value;
        let isValid = true;
        let message = '';

        // Remover mensaje de error anterior
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) existingError.remove();

        // Validación general: que no esté vacío
        if (!value || value === '') {
            isValid = false;
            message = 'Este campo es obligatorio';
        }

        // Validación específica para número de documento según tipo
        if (field.name === 'documentType') {
            const docNumberInput = document.getElementById('documentNumber');
            if (docNumberInput && docNumberInput.value.trim() !== '') {
                validateDocumentNumber(docNumberInput);
            }
        }

        // Aplicar estado visual
        if (isValid) {
            formGroup.classList.remove('error');
            formGroup.classList.add('success');
        } else {
            formGroup.classList.remove('success');
            formGroup.classList.add('error');
            
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            errorSpan.textContent = message;
            formGroup.appendChild(errorSpan);
        }

        return isValid;
    }

    // Validación específica para número de documento
    function validateDocumentNumber(field) {
        const formGroup = field.closest('.form-group');
        const value = field.value.trim();
        const docType = document.getElementById('documentType').value;
        let isValid = true;
        let message = '';

        // Remover mensaje anterior
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) existingError.remove();

        // Validaciones según tipo de documento
        if (!value) {
            isValid = false;
            message = 'Ingrese su número de documento';
        } else {
            switch(docType) {
                case 'cedula':
                    if (!/^\d{6,10}$/.test(value)) {
                        isValid = false;
                        message = 'La cédula debe tener entre 6 y 10 dígitos';
                    }
                    break;
                case 'ti':
                    if (!/^\d{6,11}$/.test(value)) {
                        isValid = false;
                        message = 'La TI debe tener entre 6 y 11 dígitos';
                    }
                    break;
                case 'ppt':
                    if (!/^[a-zA-Z0-9]{6,15}$/.test(value)) {
                        isValid = false;
                        message = 'El PPT debe tener entre 6 y 15 caracteres alfanuméricos';
                    }
                    break;
                case 'ce':
                    if (!/^[a-zA-Z0-9]{6,12}$/.test(value)) {
                        isValid = false;
                        message = 'La CE debe tener entre 6 y 12 caracteres';
                    }
                    break;
                case 'pep':
                    if (!/^[a-zA-Z0-9]{6,15}$/.test(value)) {
                        isValid = false;
                        message = 'El PEP debe tener entre 6 y 15 caracteres';
                    }
                    break;
                case 'nit':
                    if (!/^\d{9,10}(-\d)?$/.test(value)) {
                        isValid = false;
                        message = 'El NIT debe tener 9 o 10 dígitos';
                    }
                    break;
                default:
                    if (!value) {
                        isValid = false;
                        message = 'Seleccione primero el tipo de documento';
                    }
            }
        }

        // Aplicar estado
        if (isValid) {
            formGroup.classList.remove('error');
            formGroup.classList.add('success');
        } else {
            formGroup.classList.remove('success');
            formGroup.classList.add('error');
            
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            errorSpan.textContent = message;
            formGroup.appendChild(errorSpan);
        }

        return isValid;
    }

    // Agregar validación al campo de número de documento
    const docNumberInput = document.getElementById('documentNumber');
    if (docNumberInput) {
        docNumberInput.addEventListener('blur', () => validateDocumentNumber(docNumberInput));
        docNumberInput.addEventListener('input', () => {
            if (docNumberInput.parentElement.parentElement.classList.contains('error')) {
                validateDocumentNumber(docNumberInput);
            }
        });
    }

    // Validar todo el formulario (MODIFICADO para incluir nuevos campos)
    function validateForm() {
        let isValid = true;
        
        // Validar inputs originales (excluyendo documentNumber que se valida aparte)
        inputs.forEach(input => {
            if (input.name !== 'documentNumber' && !validateField(input)) isValid = false;
        });

        // Validar selects nuevos
        selects.forEach(select => {
            if (!validateSelect(select)) isValid = false;
        });

        // Validar número de documento
        if (docNumberInput && !validateDocumentNumber(docNumberInput)) isValid = false;

        // Validar términos
        const terms = document.getElementById('terms');
        const termsGroup = terms.closest('.form-group');
        if (!terms.checked) {
            isValid = false;
            termsGroup.classList.add('error');
            const existingError = termsGroup.querySelector('.error-message');
            if (existingError) existingError.remove();
            
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            errorSpan.textContent = 'Debes aceptar los términos y condiciones';
            errorSpan.style.display = 'block';
            termsGroup.appendChild(errorSpan);
        } else {
            termsGroup.classList.remove('error');
            const existingError = termsGroup.querySelector('.error-message');
            if (existingError) existingError.remove();
        }

        return isValid;
    }

    // Manejar envío del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            // Animar campos con error
            const errorFields = form.querySelectorAll('.form-group.error');
            errorFields.forEach((field, index) => {
                setTimeout(() => {
                    field.style.animation = 'none';
                    setTimeout(() => {
                        field.style.animation = 'shake 0.4s ease';
                    }, 10);
                }, index * 100);
            });
            return;
        }

        // Simular envío
        const btn = form.querySelector('.btn-register');
        const originalText = btn.innerHTML;
        btn.classList.add('loading');
        btn.innerHTML = '<span class="btn-text">Registrando</span>';

        try {
            // Simular llamada API
            await simulateRegistration();
            
            // Éxito
            showSuccessModal();
            form.reset();
            form.querySelectorAll('.form-group').forEach(g => {
                g.classList.remove('success', 'error');
            });
            
        } catch (error) {
            alert('Error al registrar: ' + error.message);
        } finally {
            btn.classList.remove('loading');
            btn.innerHTML = originalText;
        }
    });

    // Simular registro (MODIFICADO para incluir nuevos datos)
    function simulateRegistration() {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Usuario registrado:', {
                    fullName: document.getElementById('fullname')?.value,
                    documentType: document.getElementById('documentType')?.value,
                    documentNumber: document.getElementById('documentNumber')?.value,
                    email: document.getElementById('email')?.value,
                    role: document.getElementById('role')?.value,
                    timestamp: new Date().toISOString()
                });
                resolve();
            }, 2000);
        });
    }

    // Modal de éxito
    function showSuccessModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-icon">
                    <i class="fas fa-check"></i>
                </div>
                <h3 class="modal-title">¡Registro Exitoso!</h3>
                <p class="modal-text">Tu cuenta ha sido creada correctamente. Revisa tu correo para verificar tu cuenta.</p>
                <button class="btn-modal" onclick="this.closest('.modal-overlay').remove()">
                    Entendido
                </button>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    // Botón de ayuda
    const helpBtn = document.querySelector('.help-btn');
    if (helpBtn) {
        helpBtn.addEventListener('click', () => {
            alert('¿Necesitas ayuda?\n\nContacta a soporte@mechacore.com\no llama al +1 (555) 123-4567');
        });
    }

    // Efectos adicionales
    document.addEventListener('mousemove', (e) => {
        const heroImage = document.querySelector('.hero-image img');
        if (heroImage && window.innerWidth > 968) {
            const x = (window.innerWidth / 2 - e.pageX) / 50;
            const y = (window.innerHeight / 2 - e.pageY) / 50;
            heroImage.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
        }
    });
});

// Exportar para testing (opcional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validateEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) };
}