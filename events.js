const calendar = document.getElementById('calendar');
const monthLabel = document.getElementById('calendar-month');
const prevBtn = document.getElementById('prev-month');
const nextBtn = document.getElementById('next-month');
const dayEventsDiv = document.getElementById('day-events');
const eventModal = document.getElementById('event-modal');
const closeModalBtn = document.getElementById('event-modal-close');

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

function getMonthEvents(year, month) {
  return EVENTS.filter(ev => {
    const d = new Date(ev.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

function renderCalendar(year, month) {
  calendar.innerHTML = '';
  dayEventsDiv.style.display = 'none';
  // Headers
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  days.forEach(d => {
    const h = document.createElement('div');
    h.className = 'calendar-header';
    h.textContent = d;
    calendar.appendChild(h);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const monthEvents = getMonthEvents(year, month);

  // Empty cells before first day
  for(let i=0; i<firstDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'calendar-day';
    calendar.appendChild(empty);
  }

  // Days
  for(let day=1; day<=daysInMonth; day++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const events = monthEvents.filter(ev => ev.date === dateStr);
    const cell = document.createElement('div');
    cell.className = 'calendar-day';
    if(events.length) cell.classList.add('has-event');
    cell.textContent = day;
    cell.onclick = () => showDayEvents(dateStr, cell);
    calendar.appendChild(cell);
  }

  monthLabel.textContent = `${today.toLocaleString('default', { month: 'long' })} ${year}`;
}

function showDayEvents(dateStr, cell) {
  // Highlight selected day
  document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
  cell.classList.add('selected');
  // Show events for the day
  const events = EVENTS.filter(ev => ev.date === dateStr);
  if(events.length === 0) return;
  dayEventsDiv.innerHTML = `<h3>Events for ${dateStr}</h3>`;
  events.forEach(ev => {
    const div = document.createElement('div');
    div.className = 'event-listing';
    div.textContent = ev.title + ' (' + ev.start + ' - ' + ev.end + ')';
    div.onclick = () => showEventModal(ev);
    dayEventsDiv.appendChild(div);
  });
  dayEventsDiv.style.display = 'block';
  calendar.style.display = 'none';
}

function to12Hour(timeStr) {
  const [hour, min] = timeStr.split(':');
  let h = parseInt(hour, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${min} ${ampm}`;
}

function showEventModal(ev) {
  document.getElementById('event-modal-title').textContent = ev.title;
  document.getElementById('event-modal-desc').textContent = ev.desc;
  document.getElementById('event-modal-location').textContent = ev.location;
  document.getElementById('event-modal-time').textContent =
    `${to12Hour(ev.start)} - ${to12Hour(ev.end)}`;
  eventModal.style.display = 'block';
}

// Close modal functionality
closeModalBtn.onclick = () => eventModal.style.display = 'none';
window.onclick = function(e) {
  if(e.target === eventModal) eventModal.style.display = 'none';
};

// Month navigation (limit to 6 months ahead)
prevBtn.onclick = () => {
  if(currentMonth === today.getMonth() && currentYear === today.getFullYear()) return;
  if(currentMonth === 0) { currentMonth = 11; currentYear--; }
  else currentMonth--;
  renderCalendar(currentYear, currentMonth);
};
nextBtn.onclick = () => {
  const max = new Date(today.getFullYear(), today.getMonth()+6, 1);
  const next = new Date(currentYear, currentMonth+1, 1);
  if(next > max) return;
  if(currentMonth === 11) { currentMonth = 0; currentYear++; }
  else currentMonth++;
  renderCalendar(currentYear, currentMonth);
};

// Back to calendar from day view
dayEventsDiv.onclick = function(e) {
  if(e.target === dayEventsDiv) {
    dayEventsDiv.style.display = 'none';
    calendar.style.display = 'grid';
    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
  }
};

renderCalendar(currentYear, currentMonth);