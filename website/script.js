// Simple localStorage-based restaurant picker
function getRestaurants() {
  return JSON.parse(localStorage.getItem('restaurants') || '[]');
}

function saveRestaurants(restaurants) {
  localStorage.setItem('restaurants', JSON.stringify(restaurants));
}

function updateMoodOptions(restaurants) {
  const moodSelect = document.getElementById('mood');
  const tags = new Set(restaurants.map(r => r.tag).filter(Boolean));
  moodSelect.innerHTML = '<option value="">Any</option>' +
    Array.from(tags).map(t => `<option value="${t}">${t}</option>`).join('');
}

function renderList(restaurants) {
  const list = document.getElementById('list');
  list.innerHTML = '';
  restaurants.forEach((r, idx) => {
    const div = document.createElement('div');
    div.className = 'restaurant';
    const name = document.createElement('h3');
    name.textContent = r.name;
    div.appendChild(name);
    if (r.tag) {
      const tag = document.createElement('div');
      tag.textContent = 'Tag: ' + r.tag;
      div.appendChild(tag);
    }
    if (r.review) {
      const review = document.createElement('div');
      review.textContent = 'Review: ' + r.review;
      div.appendChild(review);
    }
    if (r.address) {
      const directions = document.createElement('a');
      directions.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(r.address)}`;
      directions.target = '_blank';
      directions.textContent = 'Directions';
      div.appendChild(directions);
    }
    list.appendChild(div);
  });
}

function pickRestaurant(restaurants, mood) {
  const filtered = mood ? restaurants.filter(r => r.tag === mood) : restaurants;
  if (filtered.length === 0) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

document.addEventListener('DOMContentLoaded', () => {
  const restaurants = getRestaurants();
  updateMoodOptions(restaurants);
  renderList(restaurants);

  document.getElementById('pickBtn').addEventListener('click', () => {
    const mood = document.getElementById('mood').value;
    const r = pickRestaurant(getRestaurants(), mood);
    const result = document.getElementById('result');
    if (r) {
      result.innerHTML = `<strong>${r.name}</strong><br>${r.review || ''}`;
    } else {
      result.textContent = 'No matching restaurants.';
    }
  });

  document.getElementById('addBtn').addEventListener('click', () => {
    const name = document.getElementById('newName').value.trim();
    const tag = document.getElementById('newTag').value.trim();
    const address = document.getElementById('newAddress').value.trim();
    const review = document.getElementById('newReview').value.trim();
    if (!name) return;
    const restaurants = getRestaurants();
    restaurants.push({ name, tag, address, review });
    saveRestaurants(restaurants);
    updateMoodOptions(restaurants);
    renderList(restaurants);
    document.getElementById('newName').value = '';
    document.getElementById('newTag').value = '';
    document.getElementById('newAddress').value = '';
    document.getElementById('newReview').value = '';
  });
});
