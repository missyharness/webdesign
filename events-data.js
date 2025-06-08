let EVENTS = [];

fetch('events.json')
  .then(res => res.json())
  .then(data => {
    EVENTS = data;
    renderCalendar(currentYear, currentMonth); // Call your calendar render function here
  });