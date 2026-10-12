(function () {
  // Where the form is sent. FormSubmit emails each message to this address;
  // the first message triggers a one-time confirmation email from them.
  var TO = 'vidzemes.kauss@gmail.com';
  var ENDPOINT = 'https://formsubmit.co/ajax/' + TO;
  var f = document.getElementById('cform');
  if (!f) return;
  var st = document.getElementById('f-status'), btn = document.getElementById('f-send');
  var q = document.getElementById('cap-q'), cap = document.getElementById('f-cap');
  var shown = Date.now(), ans = 0;

  function newQ() {
    var a = 2 + Math.floor(Math.random() * 8), b = 2 + Math.floor(Math.random() * 8);
    ans = a + b;
    q.textContent = a + ' + ' + b;
    cap.value = '';
  }
  newQ();

  // the "Sazināties" buttons in the sponsor levels pre-fill the subject
  document.querySelectorAll('a[data-subject]').forEach(function (a) {
    a.addEventListener('click', function () {
      document.getElementById('f-subject').value = a.getAttribute('data-subject');
    });
  });

  function err(id, msg, field) {
    document.getElementById(id).textContent = msg || '';
    if (msg) field.setAttribute('aria-invalid', 'true'); else field.removeAttribute('aria-invalid');
    return !msg;
  }
  function check() {
    var n = f.elements['name'], m = f.elements['email'], s = f.elements['subject'];
    var ok = true;
    ok = err('e-name', n.value.trim() ? '' : 'Ievadiet vārdu un uzvārdu.', n) && ok;
    ok = err('e-email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.value.trim()) ? '' : 'Ievadiet derīgu e-pasta adresi.', m) && ok;
    ok = err('e-subject', s.value.trim() ? '' : 'Ievadiet tematu.', s) && ok;
    ok = err('e-cap', parseInt(cap.value, 10) === ans ? '' : 'Atbilde nav pareiza. Mēģiniet vēlreiz.', cap) && ok;
    return ok;
  }

  f.addEventListener('submit', function (e) {
    e.preventDefault();
    st.textContent = ''; st.className = 'status';
    if (!check()) { var bad = f.querySelector('[aria-invalid="true"]'); if (bad) bad.focus(); return; }
    // bots: filled hidden field or instant submit get a fake success and nothing is sent
    if (f.elements['_honey'].value || Date.now() - shown < 3000) {
      st.textContent = 'Paldies! Mēs sazināsimies ar jums.'; st.className = 'status ok'; return;
    }
    var d = new FormData(f);
    d.append('_subject', 'CMF: ' + f.elements['subject'].value.trim());
    d.append('_captcha', 'false');
    d.append('_template', 'table');
    btn.disabled = true; btn.textContent = 'Sūta…';
    fetch(ENDPOINT, { method: 'POST', body: d, headers: { 'Accept': 'application/json' } })
      .then(function (r) {
        return r.json().then(function (j) {
          if (!r.ok || j.success === 'false' || j.success === false) throw new Error('send failed');
        });
      })
      .then(function () {
        st.textContent = 'Paldies! Mēs sazināsimies ar jums.'; st.className = 'status ok';
        f.reset(); f.elements['subject'].value = 'Sadarbība'; newQ(); shown = Date.now();
      })
      .catch(function () {
        var a = document.createElement('a');
        a.href = 'mailto:' + TO; a.textContent = TO;
        st.textContent = 'Neizdevās nosūtīt. Lūdzu, rakstiet uz ';
        st.appendChild(a); st.appendChild(document.createTextNode('.'));
        st.className = 'status bad';
      })
      .then(function () { btn.disabled = false; btn.textContent = 'Nosūtīt'; });
  });
})();
