window.onload = () => {

const form = document.querySelector('form');
const clientId = document.querySelector('.Form_Input--clientId');
const username = document.querySelector('.Form_Input--username');
const errorClientId = document.querySelector('.Form_Error--clientId');
const errorUsername = document.querySelector('.Form_Error--username');
const submitButton = document.querySelector('.Form_Submit');
const downloadLikes = document.querySelector('.Download--likes');
const downloadFollowing = document.querySelector('.Download--following');
const info = document.querySelector('.Form_Info');

form.addEventListener('submit', e => {
  e.preventDefault();
  ga('send', 'event', 'Submit Button', 'Click');
  clearErrors();
  const correctUsername = username.value.startsWith('https://soundcloud.com/') ? username.value.substr(23) : username.value;
  getResults(clientId.value, correctUsername);
});

function paginate(response, prev = []) {
  return new Promise((resolve, reject) => {
    const { collection, next_href } = response;
    let acc = [...prev, ...collection];
    if (next_href) {
      fetch(next_href)
        .then(res => res.json())
        .then(res => resolve(paginate(res, acc)));
    } else {
      resolve(acc);
    }
  });
}

function getResults(clientId, username) {
  const userId = new Promise((resolve, reject) => {
    fetch(`https://api.soundcloud.com/users/${username}?client_id=${clientId}`)
      .catch(err => {
        throwError('clientId');
        reject(err);
      })
      .then(res => {
        if (res.status === 404) {
          throwError('username');
          reject();
        }
        return res.json()
      })
      .then(res => {
        if (res.id) {
          submitButton.classList.add('Form_Submit--loading');
          resolve(res.id)
        }
      });
  });

  const following = new Promise((resolve, reject) => {
    userId
      .then(id => fetch(`https://api.soundcloud.com/users/${id}/followings?client_id=${clientId}&page_size=200&linked_partitioning=1`))
      .then(res => res.json())
      .then(res => resolve(paginate(res)));
  });

  const likes = new Promise((resolve, reject) => {
    userId
      .then(id => fetch(`https://api.soundcloud.com/users/${id}/favorites?client_id=${clientId}&page_size=200&linked_partitioning=1`))
      .then(res => res.json())
      .then(res => resolve(paginate(res)));
  });

  Promise
    .all([following, likes])
    .then(responses => {
      const [ following, likes ] = responses;
      // Trim off the props we don't want
      const trimmedFollowing = trimFollowing(following);
      const trimmedLikes = trimLikes(likes);

      const followingHeader = 'username, description, first_name, last_name, website_title, website, permalink\n';
      const likesHeader = 'username, title, created_at, description,  bpm, duration (ms), liked_count, kind, play_count, purchase_title, purchase_url, tag_list, permalink\n';

      const followingCsv = followingHeader + csv(trimmedFollowing);
      const likesCsv = likesHeader + csv(trimmedLikes);

      const followingFile = new File([followingCsv], 'following.csv', { type: 'text.csv' });
      const likesFile = new File([likesCsv], 'likes.csv', { type: 'text.csv' });

      downloadLikes.href = URL.createObjectURL(likesFile);
      downloadFollowing.href = URL.createObjectURL(followingFile);

      animateButtons();

      ga('send', 'event', 'Results', 'Delivered');
    });
}

// Formats as csv. 
// Takes 2d array, strips each row of commas and returns and joins them all with \n
const csv = arr => arr.map(row => {
  return row.map(item => {
    return removeChars(item);
  }).join(',');
}).join('\n');

// Remove new lines and commas
function removeChars(item) {
  if (typeof item === 'string') {
    return item.replace(/[\n\r,]/g, '. ');
  } else if (typeof item === 'number') {
    return item.toString();
  } else {
    return item;
  }
}

function trimFollowing(following) {
  return following.map(({ description, username, first_name, last_name, website_title, website, permalink }) => {
    return [ username, description, first_name, last_name, website_title, website, permalink ];
  })
}

function trimLikes(likes) {
  return likes.map(({ bpm, created_at, description, duration, favoritings_count:liked_count, kind, 
    playback_count:play_count, purchase_title, purchase_url, permalink, tag_list, title, user: { username } }) => {
    return [ username, title, created_at, description,  bpm, duration, liked_count, kind, play_count, purchase_title, purchase_url, tag_list, permalink ];
  })
}

function animateButtons() {
  submitButton.classList.add('Form_Submit--hide');
  
  setTimeout(() => submitButton.classList.add('Form_Submit--none'), 410);

  setTimeout(() => {
    downloadLikes.classList.toggle('Download--visible');
    downloadFollowing.classList.toggle('Download--visible');
    info.classList.add('Form_Info--visible');
  }, 450);
}

function throwError(type) {
  if (type === 'clientId') {
    ga('send', 'event', 'Results', 'Failed - Client ID');
    errorClientId.textContent = 'Incorrect Client ID';
    clientId.classList.add('Form_Input--error');
  } else if (type === 'username') {
    ga('send', 'event', 'Results', 'Failed - Username');
    errorUsername.textContent = 'Username not found';
    username.classList.add('Form_Input--error');
  }
}

function clearErrors() {
  errorClientId.textContent = '';
  errorUsername.textContent = '';
  clientId.classList.remove('Form_Input--error');
  username.classList.remove('Form_Input--error');
}

}