// script.js - lógica de interação e acessibilidade
document.addEventListener('DOMContentLoaded', function(){
  // set years
  const y = new Date().getFullYear();
  const yearElems = [document.getElementById('year'), document.getElementById('year2'), document.getElementById('year3')];
  yearElems.forEach(e => { if(e) e.textContent = y; });

  // Theme toggle with persistence
  const toggleButtons = document.querySelectorAll('#theme-toggle');
  function applyTheme(theme){
    if(theme === 'high-contrast'){
      document.documentElement.setAttribute('data-theme','high-contrast');
    } else if(theme === 'dark'){
      document.documentElement.setAttribute('data-theme','dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme || '');
    toggleButtons.forEach(b => b.setAttribute('aria-pressed', theme ? 'true' : 'false'));
  }
  // initialize
  const savedTheme = localStorage.getItem('theme');
  if(savedTheme) applyTheme(savedTheme);

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', function(){
      // cycle: default -> dark -> high-contrast -> default
      const current = document.documentElement.getAttribute('data-theme');
      if(!current) applyTheme('dark');
      else if(current === 'dark') applyTheme('high-contrast');
      else applyTheme('');
    });
    // keyboard accessible
    btn.addEventListener('keyup', function(e){
      if(e.key === 'Enter' || e.key === ' ') btn.click();
    });
  });

  // Form handling (volunteers)
  const form = document.getElementById('vol-form');
  const list = document.getElementById('voluntarios');
  const msg = document.getElementById('form-msg');

  function getVols(){
    try{
      return JSON.parse(localStorage.getItem('voluntarios')||'[]');
    }catch(e){ return []; }
  }
  function saveVols(arr){ localStorage.setItem('voluntarios', JSON.stringify(arr)); }

  function renderVols(){
    const arr = getVols();
    list.innerHTML = '';
    if(arr.length === 0){
      list.innerHTML = '<li>Nenhum voluntário cadastrado.</li>';
    } else {
      arr.forEach((v, i) => {
        const li = document.createElement('li');
        li.tabIndex = 0;
        li.textContent = v.nome + ' — ' + v.interesse + ' — ' + v.email;
        // add remove button
        const btn = document.createElement('button');
        btn.textContent = 'Remover';
        btn.className = 'btn small';
        btn.addEventListener('click', ()=> {
          const filtered = arr.filter((_, idx)=> idx !== i);
          saveVols(filtered);
          renderVols();
          msg.className = '';
          msg.textContent = 'Voluntário removido.';
        });
        li.appendChild(document.createTextNode(' '));
        li.appendChild(btn);
        list.appendChild(li);
      });
    }
  }

  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      // simple validation
      const nome = form.nome.value.trim();
      const email = form.email.value.trim();
      const telefone = form.telefone.value.trim();
      const interesse = form.interesse.value;
      if(!nome || !email || !telefone || !interesse){
        msg.className = '';
        msg.textContent = 'Por favor, preencha todos os campos.';
        msg.focus?.();
        return;
      }
      const arr = getVols();
      arr.push({nome, email, telefone, interesse});
      saveVols(arr);
      renderVols();
      form.reset();
      msg.className = '';
      msg.textContent = 'Cadastro realizado com sucesso!';
      // move focus to message for screen readers
      msg.tabIndex = -1;
      msg.focus();
    });
  }

  renderVols();

  // Ensure keyboard-only users can navigate skip-link
  const skip = document.querySelector('.skip-link');
  if(skip){
    skip.addEventListener('focus', ()=> skip.style.position='static');
    skip.addEventListener('blur', ()=> skip.style.position='absolute');
  }

  // Ensure all interactive elements have focus styles (enhanced)
  const interactive = document.querySelectorAll('a,button,input,select,textarea');
  interactive.forEach(el=>{
    if(!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
  });

  // Accessibility: trap focus in modals if any in future (placeholder)
});
