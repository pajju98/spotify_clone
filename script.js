// Set greeting text based on current hour
const h = new Date().getHours();
const greet = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
document.getElementById('greeting').textContent = greet;

// Add dark background to topbar when user scrolls down
const main = document.getElementById('main');
const topbar = document.getElementById('topbar');
main.addEventListener('scroll', () => {
  topbar.classList.toggle('scrolled', main.scrollTop > 20);
});

// Library filter chips — only one active at a time
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});

// Play / Pause toggle — swaps icon between pause.svg and play-large.svg
let playing = true;
const playBtn = document.getElementById('playBtn');
playBtn.addEventListener('click', () => {
  playing = !playing;
  playBtn.querySelector('img').src = playing ? 'svgs/pause.svg' : 'svgs/play-large.svg';
  playBtn.querySelector('img').alt = playing ? 'Pause' : 'Play';
});

// Heart (like) toggle — swaps between filled and outline heart icon
const heartBtn = document.getElementById('heartBtn');
heartBtn.addEventListener('click', () => {
  heartBtn.classList.toggle('liked');
  heartBtn.querySelector('img').src = heartBtn.classList.contains('liked')
    ? 'svgs/heart-filled.svg'
    : 'svgs/heart.svg';
});
