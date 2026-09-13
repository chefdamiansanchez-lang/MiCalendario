// ---------- Datos de meses: estación (hemisferio sur) + paisaje real ----------
const MONTHS = [
  { name: "Enero",      season: "verano",    img: "https://isorepublic.com/wp-content/uploads/2024/04/iso-republic-coastal-ocean-landscape-049-533x300.jpg" },
  { name: "Febrero",    season: "verano",    img: "https://isorepublic.com/wp-content/uploads/2023/08/iso-republic-beach-day-coast-634x300.jpg" },
  { name: "Marzo",      season: "otoño",     img: "https://isorepublic.com/wp-content/uploads/2024/09/iso-republic-autumn-foliage-fallen-leaves-450x300.jpeg" },
  { name: "Abril",      season: "otoño",     img: "https://isorepublic.com/wp-content/uploads/2023/09/iso-republic-red-barn-landscape-451x300.jpg" },
  { name: "Mayo",       season: "otoño",     img: "https://isorepublic.com/wp-content/uploads/2023/09/iso-republic-scenic-mountain-evening-454x300.jpg" },
  { name: "Junio",      season: "invierno",  img: "https://isorepublic.com/wp-content/uploads/2023/08/iso-republic-scenic-peak-mountain-459x300.jpg" },
  { name: "Julio",      season: "invierno",  img: "https://isorepublic.com/wp-content/uploads/2023/03/iso-republic-mountain-winter-lake-544x300.jpg" },
  { name: "Agosto",     season: "invierno",  img: "https://isorepublic.com/wp-content/uploads/2023/09/iso-republic-harbor-river-sunset-451x300.jpg" },
  { name: "Septiembre", season: "primavera", img: "https://isorepublic.com/wp-content/uploads/2023/09/iso-republic-wildflowers-field-451x300.jpg" },
  { name: "Octubre",    season: "primavera", img: "https://isorepublic.com/wp-content/uploads/2023/04/iso-republic-tulip-pink-group-225x300.jpg" },
  { name: "Noviembre",  season: "primavera", img: "https://isorepublic.com/wp-content/uploads/2025/04/isorepublic-yellow-sunflower-450x300.jpg" },
  { name: "Diciembre",  season: "verano",    img: "https://isorepublic.com/wp-content/uploads/2024/06/iso-republic-sunset-beach-wallpaper-451x300.jpg" },
];

const WEEKDAYS_LONG = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
const STORAGE_KEY = "doce-meses-agenda-v1";

// ---------- Estado ----------
const today = new Date();
let viewYear = today.getFullYear();
let viewMonth = today.getMonth(); // 0-11
let selectedDateKey = null;
let scheduledTimers = {};

// ---------- Persistencia ----------
function loadEntries(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  }catch(e){
    return {};
  }
}
function saveEntries(data){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
let entries = loadEntries();

function dateKey(y, m, d){
  return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
}

// ---------- Elementos ----------
const heroImg = document.getElementById("heroImg");
const monthName = document.getElementById("monthName");
const seasonName = document.getElementById("seasonName");
const dayGrid = document.getElementById("dayGrid");
const clockTime = document.getElementById("clockTime");
const clockDate = document.getElementById("clockDate");
const sheetBackdrop = document.getElementById("sheetBackdrop");
const daySheet = document.getElementById("daySheet");
const sheetDate = document.getElementById("sheetDate");
const entryList = document.getElementById("entryList");
const emptyMsg = document.getElementById("emptyMsg");
const entryForm = document.getElementById("entryForm");
const entryText = document.getElementById("entryText");
const entryTime = document.getElementById("entryTime");
const entryReminder = document.getElementById("entryReminder");
const toast = document.getElementById("toast");

// ---------- Reloj de 24 hs ----------
function tickClock(){
  const now = new Date();
  const hh = String(now.getHours()).padStart(2,"0");
  const mm = String(now.getMinutes()).padStart(2,"0");
  clockTime.textContent = `${hh}:${mm}`;
  clockDate.textContent = `${WEEKDAYS_LONG[now.getDay()]} ${now.getDate()}`;
}
tickClock();
setInterval(tickClock, 1000 * 15);

// ---------- Render del mes ----------
function renderMonth(){
  const data = MONTHS[viewMonth];
  monthName.textContent = data.name;
  seasonName.textContent = `${data.season} · ${viewYear}`;

  heroImg.classList.remove("loaded");
  const img = new Image();
  img.onload = () => {
    heroImg.src = data.img;
    requestAnimationFrame(()=> heroImg.classList.add("loaded"));
  };
  img.onerror = () => {
    heroImg.src = data.img;
    heroImg.classList.add("loaded");
  };
  img.src = data.img;

  renderGrid();
}

function renderGrid(){
  dayGrid.innerHTML = "";
  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  // Lunes = 0 ... Domingo = 6
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const cells = [];

  for(let i = firstWeekday - 1; i >= 0; i--){
    cells.push({ day: daysInPrevMonth - i, otherMonth: true });
  }
  for(let d = 1; d <= daysInMonth; d++){
    cells.push({ day: d, otherMonth: false });
  }
  while(cells.length % 7 !== 0){
    cells.push({ day: cells.length - (firstWeekday + daysInMonth) + 1, otherMonth: true });
  }

  const isCurrentViewMonth = (viewYear === today.getFullYear() && viewMonth === today.getMonth());

  cells.forEach(cell => {
    const btn = document.createElement("button");
    btn.className = "day-cell";
    btn.textContent = cell.day;

    if(cell.otherMonth){
      btn.classList.add("other-month");
      btn.tabIndex = -1;
    } else {
      if(isCurrentViewMonth && cell.day === today.getDate()){
        btn.classList.add("is-today");
      }
      const key = dateKey(viewYear, viewMonth, cell.day);
      if(entries[key] && entries[key].length){
        btn.classList.add("has-entries");
      }
      btn.addEventListener("click", () => openDaySheet(viewYear, viewMonth, cell.day));
    }
    dayGrid.appendChild(btn);
  });
}

// ---------- Navegación de mes ----------
document.getElementById("prevMonth").addEventListener("click", () => {
  viewMonth--;
  if(viewMonth < 0){ viewMonth = 11; viewYear--; }
  renderMonth();
});
document.getElementById("nextMonth").addEventListener("click", () => {
  viewMonth++;
  if(viewMonth > 11){ viewMonth = 0; viewYear++; }
  renderMonth();
});
document.getElementById("todayBtn").addEventListener("click", () => {
  viewYear = today.getFullYear();
  viewMonth = today.getMonth();
  renderMonth();
});

// ---------- Hoja de agenda por día ----------
function openDaySheet(y, m, d){
  selectedDateKey = dateKey(y, m, d);
  const dateObj = new Date(y, m, d);
  sheetDate.textContent = `${d} de ${MONTHS[m].name.toLowerCase()}`;
  renderEntryList();
  entryText.value = "";
  entryTime.value = "";
  entryReminder.checked = false;
  sheetBackdrop.classList.add("open");
  setTimeout(()=> entryText.focus({preventScroll:true}), 300);
}

function closeDaySheet(){
  sheetBackdrop.classList.remove("open");
}
document.getElementById("closeSheet").addEventListener("click", closeDaySheet);
sheetBackdrop.addEventListener("click", (e) => {
  if(e.target === sheetBackdrop) closeDaySheet();
});

function renderEntryList(){
  const list = entries[selectedDateKey] || [];
  entryList.innerHTML = "";
  emptyMsg.style.display = list.length ? "none" : "block";

  list
    .slice()
    .sort((a,b) => (a.time || "99:99").localeCompare(b.time || "99:99"))
    .forEach(item => {
      const li = document.createElement("li");
      li.className = "entry-item";
      li.innerHTML = `
        <span class="entry-time">${item.time || "—"}</span>
        <span class="entry-body">${escapeHtml(item.text)}</span>
        ${item.reminder ? '<span class="entry-alarm">⏰</span>' : ""}
        <button class="delete-btn" aria-label="Borrar">✕</button>
      `;
      li.querySelector(".delete-btn").addEventListener("click", () => {
        deleteEntry(selectedDateKey, item.id);
      });
      entryList.appendChild(li);
    });
}

function escapeHtml(str){
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

entryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = entryText.value.trim();
  if(!text) return;

  const item = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2,6),
    text,
    time: entryTime.value || "",
    reminder: entryReminder.checked,
  };

  if(!entries[selectedDateKey]) entries[selectedDateKey] = [];
  entries[selectedDateKey].push(item);
  saveEntries(entries);

  if(item.reminder){
    requestNotificationPermission().then(granted => {
      if(granted){
        scheduleReminder(selectedDateKey, item);
        showToast("Recordatorio guardado. La alarma sonará si tenés la app abierta cerca de la hora.");
      } else {
        showToast("Guardado sin alarma: no se dieron permisos de notificación.");
      }
    });
  } else {
    showToast("Guardado.");
  }

  entryText.value = "";
  entryTime.value = "";
  entryReminder.checked = false;
  renderEntryList();
  renderGrid();
});

function deleteEntry(key, id){
  if(!entries[key]) return;
  entries[key] = entries[key].filter(it => it.id !== id);
  if(entries[key].length === 0) delete entries[key];
  saveEntries(entries);
  cancelReminder(key, id);
  renderEntryList();
  renderGrid();
}

// ---------- Toast ----------
let toastTimer = null;
function showToast(msg){
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> toast.classList.remove("show"), 3200);
}

// ---------- Recordatorios / alarma ----------
function requestNotificationPermission(){
  if(!("Notification" in window)) return Promise.resolve(false);
  if(Notification.permission === "granted") return Promise.resolve(true);
  if(Notification.permission === "denied") return Promise.resolve(false);
  return Notification.requestPermission().then(p => p === "granted");
}

function fireReminder(item, key){
  const title = "Recordatorio";
  const body = `${item.text}${item.time ? " · " + item.time : ""}`;
  if("Notification" in window && Notification.permission === "granted"){
    try{
      if(navigator.serviceWorker && navigator.serviceWorker.ready){
        navigator.serviceWorker.ready.then(reg => {
          if(reg.showNotification){
            reg.showNotification(title, { body, icon:"icons/icon-192.png", tag:key+item.id, vibrate:[200,100,200] });
          } else {
            new Notification(title, { body, icon:"icons/icon-192.png" });
          }
        });
      } else {
        new Notification(title, { body, icon:"icons/icon-192.png" });
      }
    }catch(e){
      showToast(`⏰ ${body}`);
    }
  } else {
    showToast(`⏰ ${body}`);
  }
}

function scheduleReminder(key, item){
  if(!item.time) return;
  const [y,m,d] = key.split("-").map(Number);
  const [hh,mm] = item.time.split(":").map(Number);
  const target = new Date(y, m-1, d, hh, mm, 0, 0);
  const diff = target.getTime() - Date.now();
  const timerKey = key + "_" + item.id;

  if(diff <= 0) return; // ya pasó
  if(diff > 2147000000) return; // fuera del límite de setTimeout (~24 días)

  clearTimeout(scheduledTimers[timerKey]);
  scheduledTimers[timerKey] = setTimeout(() => fireReminder(item, key), diff);
}

function cancelReminder(key, id){
  const timerKey = key + "_" + id;
  clearTimeout(scheduledTimers[timerKey]);
  delete scheduledTimers[timerKey];
}

// Al abrir la app: programar los recordatorios de hoy y de los próximos días,
// y avisar sobre cualquiera que haya quedado pendiente mientras estaba cerrada.
function rescheduleAllReminders(){
  const now = new Date();
  Object.keys(entries).forEach(key => {
    entries[key].forEach(item => {
      if(!item.reminder || !item.time) return;
      const [y,m,d] = key.split("-").map(Number);
      const [hh,mm] = item.time.split(":").map(Number);
      const target = new Date(y, m-1, d, hh, mm, 0, 0);
      const diff = target.getTime() - now.getTime();
      if(diff > 0){
        scheduleReminder(key, item);
      } else if(diff > -1000 * 60 * 30){
        // se perdió por menos de 30 min: avisar ahora al reabrir
        fireReminder(item, key);
      }
    });
  });
}

// ---------- Service worker (instalación como PWA) ----------
if("serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}

// ---------- Inicio ----------
renderMonth();
rescheduleAllReminders();
