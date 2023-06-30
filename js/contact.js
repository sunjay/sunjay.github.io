// * 0 = disabled (actually send the data)
// * 1 = success
// * 2 = error response
// * 3 = error response no message
// * 4 = promise error
const TEST_MODE = 0;
// Amount to fake delay before returning results
const TEST_DELAY = 2000; // ms

const contact_form = document.getElementById('contact-form');
const contact_success = document.getElementById('contact-success');
contact_success.remove();
const contact_error = document.getElementById('contact-error');
contact_error.remove();

contact_form.addEventListener('submit', event => {
    event.preventDefault();

    // Avoid accidental double click on submit or if the form takes a while to send
    freezeForm(contact_form, 'Sending...');

    // Remove any previous alerts
    contact_form.parentElement.querySelectorAll('.alert').forEach(el => el.remove());

    sendForm(contact_form).then(response => {
        if (response.ok) {
            const alert = contact_success.cloneNode(true);
            contact_form.parentElement.append(alert);
            scrollIntoView(alert);

            contact_form.reset();
            restoreForm(contact_form);
        } else {
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    showError(data.errors.map(error => error.message).join(', '));
                    restoreForm(contact_form);
                } else {
                    showError('There was a problem sending your message. Please try again later.');
                    restoreForm(contact_form);
                }
            });
        }
    }).catch(error => {
        showError('There was a problem sending your message. Please try again later.');
        console.error(error);
        restoreForm(contact_form);
    });
});

/**
 * Freeze a form in place by disabling its inputs and setting the value of
 * its submit input to the given text
 */
function freezeForm(form, submit_text) {
    form.querySelectorAll('input,textarea').forEach(el => {
        el.disabled = true;
    });

    const submit_input = form.querySelector('input[type="submit"]');
    submit_input.dataset.original_value = submit_input.value;
    submit_input.value = submit_text;
}

/**
 * Restore a frozen form by re-enabling its inputs and restoring its submit input text
 */
function restoreForm(form) {
    form.querySelectorAll('input,textarea').forEach(el => {
        el.disabled = false;
    });

    const submit_input = form.querySelector('input[type="submit"]');
    submit_input.value = submit_input.dataset.original_value;
}

function sendForm(form) {
    if (TEST_MODE === 0) {
        const data = new FormData(form);
        const req = fetch(form.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json',
            },
        });
        return req;
    } else if (TEST_MODE === 1) {
        return new Promise(resolve => {
            setTimeout(() => resolve({
                ok: true,
            }), TEST_DELAY);
        });
    } else if (TEST_MODE === 2) {
        return new Promise(resolve => {
            setTimeout(() => resolve({
                ok: false,
                json() {
                    return Promise.resolve({
                        errors: [
                            {message: 'Test error: Wow you are awesome!'},
                            {message: 'Test error: You look great today!'},
                        ],
                    });
                },
            }), TEST_DELAY);
        });
    } else if (TEST_MODE === 3) {
        return new Promise(resolve => {
            setTimeout(() => resolve({
                ok: false,
                json() {
                    return Promise.resolve({});
                },
            }), TEST_DELAY);
        });
    } else {
        return new Promise((_, reject) => {
            setTimeout(() => reject(new Error('wowww!')), TEST_DELAY);
        });
    }
}

function scrollIntoView(el) {
    // Only scroll into view if not in view
    const rect = el.getBoundingClientRect();
    if (rect.bottom > window.innerHeight) {
        el.scrollIntoView(false);
    }
    if (rect.top < 0) {
        el.scrollIntoView();
    }
}

function showError(message) {
    const alert = contact_error.cloneNode(true);
    alert.querySelector('.error-message').innerHTML = message;
    contact_form.parentElement.append(alert);
    scrollIntoView(alert);
}
