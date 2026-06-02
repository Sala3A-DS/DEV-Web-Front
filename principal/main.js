// ── EduSpace — main.js ──

document.addEventListener('DOMContentLoaded', () => {

  // ── View toggle (Semana / Dia / Mês) ──────────────────────────
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ── Filter tags (toggle selected) ─────────────────────────────
  document.querySelectorAll('.filter-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      // Within the same filter-group, allow multiple selection
      tag.classList.toggle('selected');
    });
  });

  // ── Nav links (active state) ───────────────────────────────────
  document.querySelectorAll('.nav-links li').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.nav-links li').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // ── Login button ───────────────────────────────────────────────
  const loginBtn = document.querySelector('.btn-login');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      alert('Abrindo tela de login…');
      // Substitua pelo seu fluxo real de autenticação
    });
  }

  // ── Empty time-slot click — "Nova reserva" ─────────────────────
  document.querySelectorAll('.time-slot').forEach(slot => {
    slot.addEventListener('click', e => {
      // Ignore clicks that landed on an event card inside the slot
      if (e.target.closest('.event')) return;
      const col  = slot.dataset.day  || '—';
      const hour = slot.dataset.hour || '—';
      console.log(`Novo agendamento: ${col} às ${hour}h`);
      // Substitua por modal/formulário real
    });
  });

  // ── Event card click — show detail ────────────────────────────
  document.querySelectorAll('.event').forEach(ev => {
    ev.addEventListener('click', e => {
      e.stopPropagation();
      const title = ev.querySelector('strong')?.textContent || 'Evento';
      console.log(`Detalhes: ${title}`);
      // Substitua por modal/painel de detalhe real
    });
  });

  // ── Room card click ────────────────────────────────────────────
  document.querySelectorAll('.room-card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.querySelector('h4')?.textContent || 'Sala';
      console.log(`Sala selecionada: ${name}`);
      // Substitua por página/modal de detalhe da sala
    });
  });

  // ── Mini-calendar navigation (prev / next month) ───────────────
  const calNavBtns = document.querySelectorAll('.cal-nav');
  calNavBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      const direction = i === 0 ? 'prev' : 'next';
      console.log(`Calendário: mês ${direction}`);
      // Implemente a lógica de navegação de mês aqui
    });
  });

  // ── "Nova reserva" primary button ─────────────────────────────
  document.querySelectorAll('.btn-primary').forEach(btn => {
    if (btn.textContent.trim().startsWith('+')) {
      btn.addEventListener('click', () => {
        console.log('Abrir formulário de nova reserva');
        // Substitua por modal/formulário real
      });
    }
  });

});
