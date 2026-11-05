
let wardrobe = JSON.parse(localStorage.getItem("wardrobe")) || [];
let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
let planned = JSON.parse(localStorage.getItem("planned")) || [];

let currentOutfit = [];

// Explore wardrobe button
function goToWardrobe() {
    document.getElementById("wardrobe").scrollIntoView({
        behavior: "smooth"
    });
}

// Add clothes
function addClothes() {
    const file = document.getElementById("clothesImage").files[0];
    const category = document.getElementById("category").value;

    if (!file) {
        alert("Please select a clothing image!");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const item = {
            id: Date.now(),
            image: e.target.result,
            category: category
        };

        wardrobe.push(item);
        localStorage.setItem("wardrobe", JSON.stringify(wardrobe));

        displayWardrobe();
        alert("Clothes added successfully! 💗");

        document.getElementById("clothesImage").value = "";
    };

    reader.readAsDataURL(file);
}

// Display wardrobe
function displayWardrobe() {
    const container = document.getElementById("wardrobeItems");
    container.innerHTML = "";

    wardrobe.forEach(item => {
        container.innerHTML += `
            <div class="clothes-card">
                <img src="${item.image}">
                <p>${item.category}</p>
                <button onclick="deleteClothes(${item.id})">Delete</button>
            </div>
        `;
    });

    updateOptions();
}

// Delete clothes
function deleteClothes(id) {
    wardrobe = wardrobe.filter(item => item.id !== id);

    localStorage.setItem("wardrobe", JSON.stringify(wardrobe));
    displayWardrobe();
}

// Update outfit dropdowns
function updateOptions() {
    ["topSelect", "bottomSelect", "shoeSelect"].forEach(id => {
        const select = document.getElementById(id);
        const category = id === "topSelect" ? "Tops" :
                         id === "bottomSelect" ? "Bottoms" : "Shoes";

        select.innerHTML = '<option value="">Choose item</option>';

        wardrobe.filter(item => item.category === category)
        .forEach(item => {
            select.innerHTML += `
                <option value="${item.id}">Item ${item.id}</option>
            `;
        });
    });
}

// Create outfit
function createOutfit() {
    const ids = [
        document.getElementById("topSelect").value,
        document.getElementById("bottomSelect").value,
        document.getElementById("shoeSelect").value
    ].filter(Boolean);

    if (ids.length !== 3) {
        alert("Please choose a top, bottom and shoes!");
        return;
    }

    currentOutfit = ids.map(id =>
        wardrobe.find(item => item.id === Number(id))
    );

    document.getElementById("outfitResult").innerHTML =
        currentOutfit.map(item => `
            <img src="${item.image}">
        `).join("");
}

// Save favourite outfit
function saveOutfit() {
    if (currentOutfit.length !== 3) {
        alert("Create an outfit first!");
        return;
    }

    favourites.push(currentOutfit.map(item => item.id));

    localStorage.setItem("favourites", JSON.stringify(favourites));
    displayFavourites();

    alert("Outfit saved to favourites! ❤️");
}

// Display favourites
function displayFavourites() {
    const container = document.getElementById("favouriteItems");
    container.innerHTML = "";

    favourites.forEach((outfit, index) => {
        const items = outfit.map(id =>
            wardrobe.find(item => item.id === id)
        );

        if (items.some(item => !item)) return;

        container.innerHTML += `
            <div class="clothes-card">
                ${items.map(item =>
                    `<img src="${item.image}">`
                ).join("")}
                <br>
                <button onclick="deleteFavourite(${index})">
                    Remove
                </button>
            </div>
        `;
    });
}

// Delete favourite
function deleteFavourite(index) {
    favourites.splice(index, 1);
    localStorage.setItem("favourites", JSON.stringify(favourites));
    displayFavourites();
}

// Plan outfit
function planOutfit() {
    const date = document.getElementById("outfitDate").value;

    if (!date) {
        alert("Please select a date!");
        return;
    }

    if (currentOutfit.length !== 3) {
        alert("Create an outfit first!");
        return;
    }

    planned.push({
        date: date,
        items: currentOutfit.map(item => item.id)
    });

    localStorage.setItem("planned", JSON.stringify(planned));
    displayPlanned();

    alert("Your outfit has been planned! 📅");
}

// Display planned outfits
function displayPlanned() {
    const container = document.getElementById("plannedItems");
    container.innerHTML = "";

    planned.forEach(plan => {
        const items = plan.items.map(id =>
            wardrobe.find(item => item.id === id)
        );

        if (items.some(item => !item)) return;

        container.innerHTML += `
            <div class="clothes-card">
                <h3>${plan.date}</h3>
                ${items.map(item =>
                    `<img src="${item.image}">`
                ).join("")}
            </div>
        `;
    });
}

// Load saved data when website opens
displayWardrobe();
displayFavourites();
displayPlanned();
