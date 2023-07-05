// Get data from the JSON file
fetch('db.json')
  .then(response => response.json())
  .then(data => {
    // To process data
    const films = data.films;

    // Get the DOM elements for movie details
    const posterElement = document.querySelector('.poster');
    const titleElement = document.querySelector('.title');
    const runtimeElement = document.querySelector('.runtime');
    const showtimeElement = document.querySelector('.showtime');
    const availableTicketsElement = document.querySelector('.available-tickets');
    const buyTicketButton = document.querySelector('.buy-ticket');

    // Get DOM element for films
    const filmsListElement = document.getElementById('films');

    // Remove the placeholder li element
    const placeholderElement = document.querySelector('#films > li');
    if (placeholderElement) {
      filmsListElement.removeChild(placeholderElement);
    }

    // Function to display movie details
    function displayMovieDetails(movie) {
      posterElement.style.backgroundImage = `url(${movie.poster})`;
      titleElement.textContent = movie.title;
      runtimeElement.textContent = movie.runtime + ' minutes';
      showtimeElement.textContent = movie.showtime;
      availableTicketsElement.textContent = movie.capacity - movie.tickets_sold;

      // Enable/disable the buy ticket button based on availability
      if (movie.capacity - movie.tickets_sold > 0) {
        buyTicketButton.textContent = 'Buy Ticket';
        buyTicketButton.disabled = false;
      } else {
        buyTicketButton.textContent = 'Sold Out';
        buyTicketButton.disabled = true;
      }
    }

    // Show movie which appears in the array first
    if (films.length > 0) {
      const firstFilm = films[0];
      displayMovieDetails(firstFilm);
    }

    // Function to handle movie selection
    function selectMovie(event) {
      const selectedFilmTitle = event.target.textContent;
      const selectedFilm = films.find(film => film.title === selectedFilmTitle);
      if (selectedFilm) {
        displayMovieDetails(selectedFilm);

        // Removes the 'sold-out' class from all film items
        const filmItems = document.querySelectorAll('.film.item');
        filmItems.forEach(item => item.classList.remove('sold-out'));

        // Added the 'sold-out' class if the movie is sold out
        if (selectedFilm.capacity - selectedFilm.tickets_sold === 0) {
          event.target.classList.add('sold-out');
        }
      }
    }

    // Added click event listener to film items in the menu
    filmsListElement.addEventListener('click', selectMovie);
    
    // Displayed list with all films from the array
    films.forEach(film => {
      const listItem = document.createElement('li');
      listItem.textContent = film.title;
      listItem.classList.add('film', 'item'); // Add classes for styling
      filmsListElement.appendChild(listItem);

      // Added 'sold-out' class to sold out films
      if (film.capacity - film.tickets_sold === 0) {
        listItem.classList.add('sold-out');
      }
    });
  })
  .catch(error => {
    console.error('Error fetching movie data:', error);
  });
