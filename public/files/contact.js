(function () {
  'use strict';

  var form = document.getElementById('form-995100141519371275');
  if (!form) return;

  var fields = Array.from(form.querySelectorAll('[required]'));
  var attempted = false;

  fields.forEach(function (field) {
    var notice = document.createElement('span');
    notice.id = field.id + '-error';
    notice.className = 'contact-field-error';
    notice.hidden = true;
    notice.setAttribute('aria-live', 'polite');
    field.insertAdjacentElement('afterend', notice);
    var description = field.getAttribute('aria-describedby');
    field.setAttribute('aria-describedby', (description ? description + ' ' : '') + notice.id);

    function update() {
      var message = '';
      if (!field.value.trim()) {
        message = 'This field is required.';
      } else if (field.type === 'email' && field.validity.typeMismatch) {
        message = 'Please enter a valid email address.';
      }
      notice.textContent = message;
      notice.hidden = !message;
      if (message) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
      return !message;
    }

    field.addEventListener('input', function () { if (attempted) update(); });
    field.addEventListener('invalid', function () { attempted = true; update(); });
    field.contactValidate = update;
  });

  function validate(event) {
    attempted = true;
    var firstInvalid = null;
    fields.forEach(function (field) {
      if (!field.contactValidate() && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      event.preventDefault();
      event.stopImmediatePropagation();
      firstInvalid.focus();
    }
  }

  // Validate before the existing Weebly handlers send the form.
  document.addEventListener('click', function (event) {
    if (event.target.closest('.contact-submit') && form.contains(event.target)) validate(event);
  }, true);
  document.addEventListener('submit', function (event) {
    if (event.target === form) validate(event);
  }, true);

  form.querySelector('.contact-submit').addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.click();
    }
  });
}());
