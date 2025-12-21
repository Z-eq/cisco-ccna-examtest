// static/darkmode.js

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');

  // Ladda sparat tema från localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
      document.body.classList.add(savedTheme);
  } else {
      // Standardtema (ljus)
      document.body.classList.add('light');
  }

  themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark');
      
      // Växla klasser
      document.body.classList.remove(isDark ? 'dark' : 'light');
      document.body.classList.add(isDark ? 'light' : 'dark');
      
      // Spara nytt tema
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
      
      // Uppdatera Chart.js om det finns ett diagram (Dark Mode fix)
      if (window.chart) {
          window.chart.options.scales.x.grid.color = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
          window.chart.options.scales.y.grid.color = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
          window.chart.options.color = isDark ? '#f8f9fa' : '#212529';
          window.chart.update();
      }
  });
});