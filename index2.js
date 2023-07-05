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

    // Function to update the number of tickets sold on the server
    function updateTicketsSold(filmId, ticketsSold) {
      const request = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tickets_sold: ticketsSold
        })
      };

      fetch(`/films/${filmId}`, request)
        .then(response => response.json())
        .then(updatedFilm => {
          // Update the movie details with the updated film data
          displayMovieDetails(updatedFilm);
        })
        .catch(error => {
          console.error('Error updating tickets sold:', error);
        });
    }

    // Function to delete a film from the server
    function deleteFilm(filmId) {
      const request = {
        method: 'DELETE'
      };

      fetch(`/films/${filmId}`, request)
        .then(response => {
          // Remove the film from the films array
          const filmIndex = films.findIndex(film => film.id === filmId);
          if (filmIndex !== -1) {
            films.splice(filmIndex, 1);
          }

          // Remove the film from the films list
          const filmElement = document.getElementById(`film-${filmId}`);
          if (filmElement) {
            filmsListElement.removeChild(filmElement);
          }

          // Display the details of the first film in the updated list
          if (films.length > 0) {
            const firstFilm = films[0];
            displayMovieDetails(firstFilm);
          } else {
            // No films remaining, clear movie details
            posterElement.style.backgroundImage = '';
            titleElement.textContent = '';
            runtimeElement.textContent = '';
            showtimeElement.textContent = '';
            availableTicketsElement.textContent = '';
            buyTicketButton.textContent = 'Buy Ticket';
            buyTicketButton.disabled = true;
          }
        })
        .catch(error => {
          console.error('Error deleting film:', error);
        });
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

        // Add the 'sold-out' class if the movie is sold out
        if (selectedFilm.capacity - selectedFilm.tickets_sold === 0) {
          event.target.classList.add('sold-out');
        }
      }
    }

    // Function to handle buy ticket button click
    function buyTicket() {
      const selectedFilmTitle = titleElement.textContent;
      const selectedFilm = films.find(film => film.title === selectedFilmTitle);
      if (selectedFilm) {
        const ticketsSold = selectedFilm.tickets_sold + 1;
        updateTicketsSold(selectedFilm.id, ticketsSold);
      }
    }

    // Added click event listener to film items in the menu
    filmsListElement.addEventListener('click', selectMovie);

    // Added click event listener to buy ticket button
    buyTicketButton.addEventListener('click', buyTicket);

    // Displayed list with all films from the array
    films.forEach(film => {
      const listItem = document.createElement('li');
      listItem.textContent = film.title;
      listItem.classList.add('film', 'item'); // Add classes for styling
      listItem.setAttribute('id', `film-${film.id}`); // Set an ID for the film item
      filmsListElement.appendChild(listItem);

      // Add 'sold-out' class to sold out films
      if (film.capacity - film.tickets_sold === 0) {
        listItem.classList.add('sold-out');
      }
    });
  })
  .catch(error => {
    console.error('Error fetching movie data:', error);
  });
