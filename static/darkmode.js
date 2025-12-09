// Tema toggle + localStorage
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

if(localStorage.getItem('theme')==='dark'){
  body.classList.remove('light'); body.classList.add('dark');
} else {
  body.classList.remove('dark'); body.classList.add('light');
}

themeToggle.addEventListener('click', ()=>{
  body.classList.toggle('dark'); body.classList.toggle('light');
  localStorage.setItem('theme', body.classList.contains('dark')?'dark':'light');
});
