/* ════ DATA ════ */
const SCHEDULES = {
  manha:[
    {type:'aula',num:'1ª Aula',time:'07:00 – 07:50'},
    {type:'aula',num:'2ª Aula',time:'07:50 – 08:40'},
    {type:'aula',num:'3ª Aula',time:'08:40 – 09:30'},
    {type:'intervalo',time:'09:30 – 09:50'},
    {type:'aula',num:'4ª Aula',time:'09:50 – 10:40'},
    {type:'aula',num:'5ª Aula',time:'10:40 – 11:30'},
    {type:'aula',num:'6ª Aula',time:'11:30 – 12:20'},
  ],
  tarde:[
    {type:'aula',num:'1ª Aula',time:'13:00 – 13:50'},
    {type:'aula',num:'2ª Aula',time:'13:50 – 14:40'},
    {type:'aula',num:'3ª Aula',time:'14:40 – 15:30'},
    {type:'intervalo',time:'15:30 – 15:50'},
    {type:'aula',num:'4ª Aula',time:'15:50 – 16:40'},
    {type:'aula',num:'5ª Aula',time:'16:40 – 17:30'},
    {type:'aula',num:'6ª Aula',time:'17:30 – 18:20'},
  ],
  noite:[
    {type:'aula',num:'1ª Aula',time:'19:00 – 19:45'},
    {type:'aula',num:'2ª Aula',time:'19:45 – 20:30'},
    {type:'aula',num:'3ª Aula',time:'20:30 – 21:15'},
    {type:'intervalo',time:'21:15 – 21:30'},
    {type:'aula',num:'4ª Aula',time:'21:30 – 22:15'},
    {type:'aula',num:'5ª Aula',time:'22:15 – 23:00'},
    {type:'aula',num:'6ª Aula',time:'23:00 – 23:45'},
  ],
};

const DAYS = ['Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira'];

const SALAS = [
  {id:1,label:'Sala 01',    cap:'35 alunos',  icon:'🏛️'},
  {id:2,label:'Sala 02',    cap:'30 alunos',  icon:'📚'},
  {id:3,label:'Sala 03',    cap:'35 alunos',  icon:'🎨'},
  {id:4,label:'Lab. Info.', cap:'20 alunos',  icon:'💻'},
  {id:5,label:'Lab. Ciên.', cap:'25 alunos',  icon:'🔬'},
  {id:6,label:'Auditório',  cap:'120 alunos', icon:'🎭'},
];

const PERIOD_CFG = {
  manha:{ badge:'MANHÃ', dot:'#ffd84d', lbl:'Horário da manhã', icon:'🌅', barCls:'',      iconCls:'',       statLbl:'MANHÃ',  intIcon:'☕' },
  tarde:{ badge:'TARDE', dot:'#ff9a30', lbl:'Horário da tarde', icon:'🌤️', barCls:'tarde', iconCls:'tarde',  statLbl:'TARDE',  intIcon:'☀️' },
  noite:{ badge:'NOITE', dot:'#c580ff', lbl:'Horário da noite', icon:'🌙', barCls:'noite', iconCls:'noite',  statLbl:'NOITE',  intIcon:'🌙' },
};

const db = {manha:{}, tarde:{}, noite:{}};
let period   = 'manha';
let mCtx     = null;
let selSala  = null;

/* ════ TABLE BUILD ════ */
function buildTable(p) {
  const tbody = document.getElementById('schedule-body');
  tbody.innerHTML = '';
  const rows = SCHEDULES[p];
  let ai = 0;

  rows.forEach(row => {
    const tr = document.createElement('tr');

    if (row.type === 'intervalo') {
      tr.classList.add('intervalo-row');
      const td = document.createElement('td');
      td.colSpan = 6;
      td.innerHTML = `<div class="intervalo-band">
        <div class="intervalo-icon-wrap">${PERIOD_CFG[p].intIcon}</div>
        <span class="intervalo-text">Intervalo</span>
        <div class="intervalo-sep"></div>
        <span class="intervalo-time">${row.time}</span>
      </div>`;
      tr.appendChild(td);
    } else {
      const idx = ai++;
      const ttd = document.createElement('td');
      ttd.className = 'time-cell';
      ttd.innerHTML = `<div class="tc-inner"><span class="aula-num">${row.num}</span><span class="aula-time">${row.time}</span><div class="aula-dot"></div></div>`;
      tr.appendChild(ttd);
      DAYS.forEach((_,di) => {
        const td = document.createElement('td');
        td.className='class-cell';
        td.dataset.day=di; td.dataset.aula=idx;
        renderCell(td,p,di,idx);
        td.addEventListener('click',()=>openModal(di,idx,row,p));
        tr.appendChild(td);
      });
    }
    tbody.appendChild(tr);
  });
  updateStats(p);
}

function renderCell(td,p,di,ai) {
  const e = db[p][`${di}_${ai}`];
  if (e && e.materia) {
    td.innerHTML=`<div class="cell-inner filled">
      <span class="cell-materia">${e.materia}</span>
      ${e.professor?`<span class="cell-prof">${e.professor}</span>`:''}
      ${e.sala?`<span class="cell-sala-tag stag-${e.sala}">${SALAS[e.sala-1].label}</span>`:''}
    </div>`;
  } else {
    td.innerHTML=`<div class="cell-inner">
      <div class="cell-empty">
        <div class="cell-empty-icon">+</div>
        <span>Livre</span>
      </div>
    </div>`;
  }
}

/* ════ STATS ════ */
function updateStats(p) {
  const entries = Object.values(db[p]);
  const filled  = entries.filter(e=>e&&e.materia).length;
  const salasSet = new Set(entries.filter(e=>e&&e.sala).map(e=>e.sala));
  document.getElementById('st-total').textContent  = filled;
  document.getElementById('st-salas').textContent  = salasSet.size;
  document.getElementById('st-livres').textContent = 30-filled;
  document.getElementById('st-period').textContent = PERIOD_CFG[p].statLbl;
}

/* ════ PERIOD ════ */
function detectPeriod(v){
  v=v.toLowerCase();
  if(v.includes('noite')) return 'noite';
  if(v.includes('tarde')) return 'tarde';
  return 'manha';
}
function setPeriod(p){
  if(p===period) return;
  period=p; buildTable(p); applyPeriodUI(p);
}
function applyPeriodUI(p){
  const c=PERIOD_CFG[p];
  document.getElementById('period-badge').className='period-badge '+p;
  document.getElementById('period-badge').textContent=c.badge;
  document.getElementById('period-dot').style.background=c.dot;
  document.getElementById('period-lbl').textContent=c.lbl;
  const gb=document.getElementById('modal-glow-bar');
  const ib=document.getElementById('modal-icon-box');
  if(gb) gb.className='modal-glow-bar '+c.barCls;
  if(ib){ ib.className='modal-icon-box '+c.iconCls; ib.textContent=c.icon; }
}
document.getElementById('turma-input').addEventListener('input',function(){setPeriod(detectPeriod(this.value));});

/* ════ MODAL ════ */
const overlay=document.getElementById('modal-overlay');

function openModal(di,ai,row,p){
  mCtx={di,ai,row,p}; selSala=null;
  const e=db[p][`${di}_${ai}`]||{};

  applyPeriodUI(p);
  document.getElementById('modal-title').textContent  = DAYS[di];
  document.getElementById('chip-dia').textContent     = DAYS[di].split('-')[0];
  document.getElementById('chip-aula').textContent    = row.num;
  document.getElementById('chip-time').textContent    = row.time;
  document.getElementById('rv-dia').textContent       = DAYS[di];
  document.getElementById('rv-aula').textContent      = row.num;
  document.getElementById('rv-horario').textContent   = row.time;
  document.getElementById('rv-turma').textContent     = document.getElementById('turma-input').value.trim()||'—';
  document.getElementById('inp-materia').value        = e.materia||'';
  document.getElementById('inp-professor').value      = e.professor||'';
  document.getElementById('inp-obs').value            = e.obs||'';
  selSala=e.sala||null;

  buildSalaGrid(di,ai,p);
  document.querySelector('.modal-body').scrollTop=0;
  document.body.classList.add('modal-open');
  overlay.classList.add('active');
  setTimeout(()=>document.getElementById('inp-materia').focus(),340);
}

function buildSalaGrid(di,ai,p){
  const grid=document.getElementById('sala-grid');
  grid.innerHTML='';
  const occ=new Set();
  DAYS.forEach((_,d)=>{
    if(d===di)return;
    const e=db[p][`${d}_${ai}`];
    if(e&&e.sala)occ.add(e.sala);
  });
  SALAS.forEach(sala=>{
    const isOcc=occ.has(sala.id);
    const isSel=selSala===sala.id;
    const card=document.createElement('div');
    card.className='sala-card'+(isOcc?' occupied':'')+(isSel?' selected':'');
    card.innerHTML=`
      <div class="sala-card-icon">${sala.icon}</div>
      <div class="sala-card-name">${sala.label}</div>
      <div class="sala-card-cap">${sala.cap}</div>
      <div class="sala-card-status ${isOcc?'sc-ocp':'sc-livre'}">${isOcc?'Ocupada':'Livre'}</div>`;
    if(!isOcc) card.addEventListener('click',()=>selectSala(sala.id));
    grid.appendChild(card);
  });
}

function selectSala(id){
  selSala=id;
  document.querySelectorAll('.sala-card').forEach((c,i)=>{
    c.classList.toggle('selected',SALAS[i].id===id);
  });
}

function closeModal(){
  overlay.classList.remove('active');
  document.body.classList.remove('modal-open');
  mCtx=null;
}

function saveModal(){
  if(!mCtx)return;
  const {di,ai,period:p}=mCtx;
  const materia   =document.getElementById('inp-materia').value.trim();
  const professor =document.getElementById('inp-professor').value.trim();
  const obs       =document.getElementById('inp-obs').value.trim();
  if(materia||selSala) db[p][`${di}_${ai}`]={materia,professor,sala:selSala,obs};
  refreshCell(di,ai,p);
  updateStats(p);
  closeModal();
  showToast(materia?`"${materia}" agendado com sucesso!`:'Reserva salva!');
}

function clearCell(){
  if(!mCtx)return;
  const{di,ai,period:p}=mCtx;
  delete db[p][`${di}_${ai}`];
  refreshCell(di,ai,p);
  updateStats(p);
  closeModal();
  showToast('Célula limpa.');
}

function refreshCell(di,ai,p){
  const td=document.querySelector(`td.class-cell[data-day="${di}"][data-aula="${ai}"]`);
  if(td) renderCell(td,p,di,ai);
}

function showToast(msg){
  const t=document.getElementById('toast');
  document.getElementById('toast-msg').textContent=msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t=setTimeout(()=>t.classList.remove('show'),2800);
}

/* bindings */
document.getElementById('modal-close-btn').addEventListener('click',closeModal);
document.getElementById('btn-cancel').addEventListener('click',closeModal);
document.getElementById('btn-save').addEventListener('click',saveModal);
document.getElementById('btn-clear').addEventListener('click',clearCell);
overlay.addEventListener('click',e=>{if(e.target===overlay)closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
document.getElementById('modal').addEventListener('keydown',e=>{
  if(e.key==='Enter'&&!e.shiftKey&&document.activeElement.tagName!=='TEXTAREA'){e.preventDefault();saveModal();}
});

/* init */
buildTable('manha');