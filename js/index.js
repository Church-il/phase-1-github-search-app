document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('github-form');
  const searchInput = document.getElementById('search');
  const userList = document.getElementById('user-list');
  const profileDetails = document.getElementById('profile-details');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      const users = await fetchUsers(query);
      displayUsers(users);
    }
  });

  async function fetchUsers(query) {
    const response = await fetch(`https://api.github.com/search/users?q=${query}`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    const data = await response.json();
    return data.items;
  }

  function displayUsers(users) {
    userList.innerHTML = ''; // Clear previous results
    users.forEach(user => {
      const userItem = document.createElement('li');
      userItem.classList.add('user-item');
      userItem.innerHTML = `
        <img src="${user.avatar_url}" alt="${user.login}">
        <div class="user-info">
          <a href="${user.html_url}" target="_blank">${user.login}</a>
        </div>
      `;
      userItem.addEventListener('click', () => fetchAndDisplayRepos(user.login));
      userList.appendChild(userItem);
    });
  }

  async function fetchAndDisplayRepos(username) {
    const repos = await fetchRepos(username);
    displayRepos(repos);
  }

  async function fetchRepos(username) {
    const response = await fetch(`https://api.github.com/users/${username}/repos`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    const data = await response.json();
    return data;
  }

  function displayRepos(repos) {
    profileDetails.innerHTML = ''; // Clear previous details
    if (repos.length === 0) {
      profileDetails.innerHTML = '<p>No repositories found.</p>';
      return;
    }

    const repoList = document.createElement('ul');
    repoList.classList.add('repo-list');
    repos.forEach(repo => {
      const repoItem = document.createElement('li');
      repoItem.classList.add('repo-item');
      repoItem.innerHTML = `
        <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        <p>${repo.description || 'No description'}</p>
      `;
      repoList.appendChild(repoItem);
    });
    profileDetails.appendChild(repoList);
  }
});
