// sidebar.js — injeta a sidebar em todas as páginas com layout principal
// Uso: <div id="sidebar-root"></div> + <script src="sidebar.js"></script>

function renderSidebar(activePage) {
  const links = [
    { href: 'dashboard.html',   icon: '◈', label: 'Dashboard',    id: 'dashboard'   },
    { href: 'corredores.html',  icon: '◉', label: 'Corredores',   id: 'corredores'  },
    { href: 'ranking.html',     icon: '◆', label: 'Ranking',       id: 'ranking'     },
    { href: 'estatisticas.html',icon: '◇', label: 'Estatísticas', id: 'estatisticas'},
  ];

  const nav = links.map(l => `
    <a href="${l.href}" class="nav-item ${activePage === l.id ? 'active' : ''}">
      <span class="nav-icon">${l.icon}</span>${l.label}
    </a>
  `).join('');

  const html = `
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div class="logo-mark">KER<span>BE</span>RUS</div>
        <div class="logo-sub">F1 Intelligence</div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-label">Menu</div>
        ${nav}
      </nav>
      <div class="sidebar-footer">
        <a href="login.html">⎋ &nbsp;Sair</a>
      </div>
    </aside>
  `;

  const root = document.getElementById('sidebar-root');
  if (root) root.innerHTML = html;
}

// Modal para trocar usuário
function setupChangeUserModal() {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  
  // Atualizar nome do usuário no topo
  const topbarUserName = document.getElementById('topbar-user-name');
  const avatar = document.querySelector('.avatar');
  if (topbarUserName && usuario.nome) {
    topbarUserName.textContent = usuario.nome;
    if (avatar) avatar.textContent = usuario.nome.charAt(0).toUpperCase();
  }
  
  // Criar modal de trocar usuário
  const modalHTML = `
    <div class="modal-overlay" id="modal-user-change">
      <div class="modal" style="max-width: 400px;">
        <div class="modal-header">
          <span class="modal-title">Trocar Usuário</span>
          <button class="modal-close" onclick="fecharModalTrocarUsuario()">✕</button>
        </div>
        
        <div class="form-group">
          <label class="form-label">Usuário Atual</label>
          <div style="padding: 10px; background: #f5f5f5; border-radius: 4px; color: #666;">
            <strong>${usuario.nome || 'Não identificado'}</strong><br>
            <small>${usuario.email || ''}</small>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="email" class="form-input" placeholder="seu@email.com" id="user-change-email" />
        </div>

        <div class="form-group">
          <label class="form-label">Senha</label>
          <input type="password" class="form-input" placeholder="••••••••" id="user-change-senha" />
        </div>

        <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:4px;">
          <button class="btn btn-outline" onclick="fecharModalTrocarUsuario()">Cancelar</button>
          <button class="btn btn-primary" onclick="executarTrocarUsuario()">Trocar Usuário</button>
        </div>
      </div>
    </div>
  `;
  
  if (!document.getElementById('modal-user-change')) {
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }
  
  // Adicionar evento de clique no topbar-user
  const topbarUser = document.querySelector('.topbar-user');
  if (topbarUser) {
    topbarUser.style.cursor = 'pointer';
    topbarUser.onclick = () => {
      document.getElementById('modal-user-change').classList.add('open');
    };
  }
}

function fecharModalTrocarUsuario() {
  const modal = document.getElementById('modal-user-change');
  if (modal) modal.classList.remove('open');
}

function executarTrocarUsuario() {
  const email = document.getElementById('user-change-email').value;
  const senha = document.getElementById('user-change-senha').value;

  if (!email || !senha) {
    alert('Preencha email e senha.');
    return;
  }

  fetch('/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  })
  .then(r => {
    if (!r.ok) throw new Error('Email ou senha incorretos');
    return r.json();
  })
  .then(data => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    alert('Usuário alterado com sucesso!');
    location.reload();
  })
  .catch(err => {
    console.error(err);
    alert('Erro: ' + err.message);
  });
}

// Fechar modal ao clicar fora
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', function(e) {
    const modal = document.getElementById('modal-user-change');
    if (modal && e.target === modal) {
      fecharModalTrocarUsuario();
    }
  });
});