/* Register-interest form: name + email, then optional planning questions.
   Sign-ups are sent to a Google Apps Script web app that saves them to Helen's
   Google Sheet (see apps-script/Code.gs). Until SIGNUP_ENDPOINT is set, the form
   validates but tells visitors to email Helen instead of pretending to save. */
(function () {
  'use strict';

  // Paste the Apps Script web app URL here (ends in /exec) once it is deployed.
  var SIGNUP_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyLHx2l3xECPzUCGffrI_vmIAWlsPQf3xBqUzPapim-gpxSuQw04793RHHCj1tkCMzK/exec';

  var HELEN_EMAIL = 'helenappleyard@live.com.au';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var steps = {};
  document.querySelectorAll('[data-step]').forEach(function (el) { steps[el.dataset.step] = el; });
  var form = document.getElementById('signup-form');
  var detailsForm = document.getElementById('details-form');
  var nameInput = document.getElementById('first-name');
  var emailInput = document.getElementById('email');
  var emailField = document.getElementById('email-field');
  var emailError = document.getElementById('email-error');
  var emailErrorText = document.getElementById('email-error-text');
  var notice = document.getElementById('signup-notice');
  var submitBtn = form.querySelector('button[type="submit"]');

  var signupId = '';
  var email = '';

  function show(step) {
    Object.keys(steps).forEach(function (k) { steps[k].hidden = k !== step; });
    if (step !== 'form') steps[step].focus();
  }

  function setEmailError(msg) {
    emailErrorText.textContent = msg || '';
    emailError.hidden = !msg;
    emailField.classList.toggle('iwm-field--invalid', !!msg);
    if (msg) {
      emailInput.setAttribute('aria-invalid', 'true');
      emailInput.setAttribute('aria-describedby', 'email-error');
    } else {
      emailInput.removeAttribute('aria-invalid');
      emailInput.removeAttribute('aria-describedby');
    }
  }

  function setNotice(html) {
    notice.innerHTML = html || '';
    notice.hidden = !html;
  }

  function post(payload) {
    // text/plain keeps this a "simple" request, so Apps Script needs no CORS preflight.
    return fetch(SIGNUP_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }).then(function (data) {
      if (!data || !data.ok) throw new Error((data && data.error) || 'Not saved');
      return data;
    });
  }

  var mailLink = '<a href="mailto:' + HELEN_EMAIL + '">' + HELEN_EMAIL + '</a>';

  emailInput.addEventListener('input', function () { setEmailError(''); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    setNotice('');
    email = emailInput.value.trim();
    var err;
    if (!email) err = 'Enter your email address';
    else if (!EMAIL_RE.test(email)) err = 'Enter an email address like name@example.com';
    if (err) {
      setEmailError(err);
      emailInput.focus();
      return;
    }
    setEmailError('');

    var first = nameInput.value.trim();
    document.querySelectorAll('[data-thanks]').forEach(function (el) {
      el.textContent = first ? 'Grazie, ' + first + '!' : 'Grazie!';
    });
    document.querySelectorAll('[data-email]').forEach(function (el) { el.textContent = email; });

    if (!SIGNUP_ENDPOINT) {
      setNotice('The list opens very soon. Until then, please email Helen at ' + mailLink + ' and she’ll add you herself.');
      return;
    }

    submitBtn.disabled = true;
    post({
      action: 'signup',
      name: first,
      email: email,
      website: document.getElementById('website').value
    }).then(function (data) {
      signupId = data.id || '';
      show('details');
    }).catch(function () {
      setNotice('Sorry, that didn’t go through. Please try again, or email Helen at ' + mailLink + '.');
    }).then(function () {
      submitBtn.disabled = false;
    });
  });

  detailsForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var answers = {
      action: 'details',
      id: signupId,
      email: email,
      when: document.getElementById('when').value,
      who: document.getElementById('who').value,
      walk: document.getElementById('walk').value
    };
    // The sign-up itself is already saved; don't hold the guest up on the extras.
    if (SIGNUP_ENDPOINT && (answers.when || answers.who || answers.walk)) post(answers).catch(function () {});
    show('done');
  });

  document.querySelector('[data-skip]').addEventListener('click', function () { show('done'); });

  var shareBtn = document.querySelector('[data-share]');
  shareBtn.addEventListener('click', function () {
    var url = location.href.split('#')[0];
    var data = { title: 'Italy With Me', text: 'Private walks in Florence with Helen Appleyard', url: url };
    if (navigator.share) {
      navigator.share(data).catch(function () {});
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () {
        shareBtn.querySelector('[data-share-label]').textContent = 'Link copied';
        shareBtn.querySelector('[data-share-icon]').innerHTML =
          '<svg class="iwm-icon" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>';
      }).catch(function () {});
    }
  });
})();
