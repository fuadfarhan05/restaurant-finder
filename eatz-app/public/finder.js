let restaurants = []; // Array to hold restaurant data
let chosenCards = []; // Array to hold the currently displayed cards
let selectedCard = null; // Store the selected card
let cardSelectionCount = {}; // Object to count selections
let roundsLeft = 10; // Number of rounds to display choices

// Fetch restaurant data
fetch("sample.json")
    .then(response => response.json())
    .then(data => {
        restaurants = data.businesses;
        displayChoices();
    })
    .catch(error => console.error("Error fetching data:", error));

// Function to pick a random card excluding certain restaurants
function chooseRandomCard(exclude = []) {
    const filteredRestaurants = restaurants.filter(restaurant => !exclude.includes(restaurant));
    const randomIndex = Math.floor(Math.random() * filteredRestaurants.length);
    return filteredRestaurants[randomIndex];
}

// Function to display cards
function displayChoices() {
    if (roundsLeft <= 0) {
        showFinalChoice();
        return;
    }

    const container = document.getElementById("restaurantContainer");
    container.innerHTML = ""; // Clear previous cards

    // Reset chosen cards and set up one card to stay
    chosenCards = [];

    if (selectedCard) {
        chosenCards.push(selectedCard);
    } else {
        selectedCard = chooseRandomCard();
        chosenCards.push(selectedCard);
    }

    // Add one new random card that isn’t the selected card
    let randomCard;
    do {
        randomCard = chooseRandomCard(chosenCards);
    } while (randomCard === selectedCard);
    chosenCards.push(randomCard);

    // Display the chosen cards
    chosenCards.forEach((business, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <img src="${business.image_url}" alt="${business.name}" />
            <div class="card-content">
                <h2>${business.name}</h2>
                <p>${business.location.display_address.join(", ")}</p>
            </div>
        `;
        card.onclick = () => selectCard(business); // Attach click event
        container.appendChild(card);

        // Insert "or" text between cards
        if (index === 0) {
            const orText = document.createElement("div");
            orText.textContent = "or";
            orText.classList.add("or-text");
            container.appendChild(orText);
        }
    });
}

// Function to select a card
function selectCard(selectedBusiness) {
    // Update the selection count for the selected card
    cardSelectionCount[selectedBusiness.name] = (cardSelectionCount[selectedBusiness.name] || 0) + 1;
    roundsLeft -= 1;

    // Set the clicked card as the selected card to keep
    selectedCard = selectedBusiness;

    // Display choices again or show final choice if rounds are over
    if (roundsLeft > 0) {
        displayChoices();
    } else {
        showFinalChoice();
    }
}

// Function to show the final choice
function showFinalChoice() {
    const container = document.getElementById("restaurantContainer");
    container.innerHTML = ""; // Clear the container for final result

    // Find the most chosen card based on selection counts
    let mostChosen = null;
    let maxCount = 0;
    for (const [business, count] of Object.entries(cardSelectionCount)) {
        if (count > maxCount) {
            mostChosen = business;
            maxCount = count;
        }
    }

    if (mostChosen) {
        // Get the full details of the most chosen restaurant from the restaurants array
        const mostChosenRestaurant = restaurants.find(restaurant => restaurant.name === mostChosen);

        // Create a card element to display the most chosen restaurant
        const resultCard = document.createElement("div");
        resultCard.classList.add("card", "final-choice");

        resultCard.innerHTML = `
            <img src="${mostChosenRestaurant.image_url}" alt="${mostChosenRestaurant.name}" />
            <div class="card-content">
                <h2>${mostChosenRestaurant.name}</h2>
                <p>${mostChosenRestaurant.location.display_address.join(", ")}</p>
                <p>Votes: ${maxCount}</p>
            </div>
        `;

        // Append the final chosen card to the container
        container.appendChild(resultCard);
    } else {
        // Display message if no restaurant was selected
        const result = document.createElement("div");
        result.classList.add("final-choice");
        result.innerHTML = `<h2>No restaurant was selected!</h2>`;
        container.appendChild(result);
    }
}
