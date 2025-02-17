import rentals from "./propertyData.js";
const map = L.map("map", {
  preferCanvas: true, // Better for performance
}).setView([37.8, -96], 4);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Add event listener for search button
document
  .getElementById("search-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      searchLocation();
    }
  });

async function searchLocation() {
  const searchText = document.getElementById("search-input").value;
  if (!searchText) return;

  try {
    // Get coordinates from Nominatim
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}&countrycodes=us`
    );

    const data = await response.json();
    console.log("API Response:", data); // Add this line

    if (data.length > 0) {
      // Move map to found location
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      map.setView([lat, lon], 13);
    } else {
      alert("No results found. Please check your address and try again.");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Search failed!");
  }
}

let markers = [];

function updateMarkers(type) {
  console.log("Selected type:", type); // Debugging line

  // Remove existing markers
  markers.forEach((marker) => map.removeLayer(marker));
  markers = [];

  let filteredRentals;

  if (type === "wheelchairAccessible") {
    filteredRentals = rentals.filter(
      (rental) => rental.wheelchairAccessible.trim().toLowerCase() === "yes"
    );
  } else if (type === "breedRestrictions") {
    filteredRentals = rentals.filter((rental) => {
      const val = rental.breedRestrictions.trim().toLowerCase();
      return ["none", "no", "breed restrictions", "restrictions"].includes(val);
    });
  } else if (type === "All") {
    filteredRentals = rentals;
  } else {
    // Filter by property type
    filteredRentals = rentals.filter((rental) => rental.type === type);
  }

  filteredRentals.forEach((rental) => {
    const marker = L.marker([rental.lat, rental.lon]).addTo(map);

    // Click event to show Offcanvas
    marker.on("click", () => {
      showOffcanvas(rental); // Call the global showOffcanvas function
    });

    // Hover event to show Popup after 1 second
    let hoverTimeout;
    marker.on("mouseover", () => {
      hoverTimeout = setTimeout(() => {
        marker
          .bindPopup(
            `<b>${rental.address}</b><br>
                    Type: ${rental.type}<br>
                    Phone Number: ${rental.phoneNumber || "N/A"}<br>
                    Breed Restrictions: ${rental.breedRestrictions}<br>
                    Pet Weight Restrictions: ${rental.petWeightLimit}<br>
                    Pet Deposit: ${rental.petDeposit}<br>
                    Pet Rent: ${rental.petRent}<br>
                    Pet fee: ${rental.petFee}<br>
                    Website: ${
                      rental.website
                        ? `<a href="${rental.website}" target="_blank">${rental.website}</a>`
                        : "N/A"
                    }<br>
                    Details: ${rental.moreDetails}`
          )
          .openPopup();
      }, 1000); // Show popup after 1 second
    });

    marker.on("mouseout", () => {
      clearTimeout(hoverTimeout); // Cancel popup if mouse leaves before 1 second
      marker.closePopup();
    });

    markers.push(marker);
  });
}

// Click event to open Offcanvas
function showOffcanvas(rental) {
  const content = `
           <img src="${rental.photo}" alt="Photo of ${rental.address}" />

          <h5>${rental.address}</h5>
          <p>Type: ${rental.type}</p>
          <p>Price: ${rental.price}</p>
          <p>Phone: ${rental.phoneNumber || "N/A"}</p>
          <p>Breed Restrictions: ${rental.breedRestrictions}</p>
          <p>Pet Weight Restrictions: ${rental.petWeightLimit}</p>
          <p>Pet Deposit: ${rental.petDeposit}</p>
          <p>Pet Rent: ${rental.petRent}</p>
          <p>Pet fee: ${rental.petFee}</p>
          <p>Website: ${
            rental.website
              ? `<a href="${rental.website}" target="_blank">${rental.website}</a>`
              : "N/A"
          }</p>
          <p><strong>Details:</strong> ${rental.moreDetails}</p>
          `;

  document.getElementById("propertyDetailsContent").innerHTML = content;

  // Show Offcanvas
  const offcanvasElement = document.getElementById("propertyDetailsOffcanvas");
  const offCanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement);
  offCanvas.show();
}

// Initial load of all markers
updateMarkers("All");

// Add event listener to the type dropdown
document.querySelectorAll(".dropdown-item").forEach((item) => {
  item.addEventListener("click", (e) => {
    const type = e.target.getAttribute("data-type");
    updateMarkers(type);
  });
});

async function getCoordinates(address) {
  document.getElementById("loading").style.display = "block";
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}&countrycodes=us`
    );
    const data = await response.json();
    console.log("API Response:", data);

    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };
    } else {
      alert("Address not found! Please refine your input.");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Search failed! Please try again later.");
    return null;
  } finally {
    document.getElementById("loading").style.display = "none";
  }
}

// 6. UPDATE THE SAVE BUTTON FUNCTION
async function saveNewProperty() {
  const address = document.getElementById("address").value;

  // Get coordinates first
  const coords = await getCoordinates(address);
  if (!coords) return; // Stop if no coordinates

  // Rest of your existing code (create object, push to array, etc.)
  const newProperty = {
    address: address,
    price: `$${document.getElementById("price").value}/mo`,
    type: document.getElementById("type").value,
    website: document.getElementById("website").value,
    phoneNumber: document.getElementById("phoneNumber").value,
    petDeposit: document.getElementById("petDeposit").value,
    petRent: document.getElementById("petRent").value,
    petFee: document.getElementById("petFee").value,
    moreDetails: document.getElementById("moreDetails").value,
    lat: coords.lat,
    lon: coords.lon,
  };

  // Add new property to rentals array
  rentals.push(newProperty);

  // Update map markers
  updateMarkers("All");

  // Reset form and close modal
  document.getElementById("addPropertyModal").querySelector("form").reset();
}

document
  .querySelector("#addPropertyModal .btn-primary")
  .addEventListener("click", async () => {
    if (!document.getElementById("address").value) {
      alert("Please enter an address!");
      return;
    }

    await saveNewProperty();
    bootstrap.Modal.getInstance(
      document.getElementById("addPropertyModal")
    ).hide();
  });

// Smooth scroll between banner and mainContainer

const mainContainer = document.getElementById("mainContainer");
const bannerContainer = document.getElementById("bannerContainer");
let lastScrollPosition = 0;
let isProgrammaticScroll = false;

document.addEventListener("scroll", () => {
  if (isProgrammaticScroll) return;

  const currentScroll = window.scrollY;

  const headerHeight = 200; // Height of the fixed header

  // Scroll down to mainContainer from banner
  if (
    currentScroll <= bannerContainer.offsetTop + 50 &&
    currentScroll > lastScrollPosition
  ) {
    isProgrammaticScroll = true;
    window.scrollTo({
      top:
        mainContainer.offsetTop +
        mainContainer.offsetHeight -
        window.innerHeight +
        headerHeight,
      behavior: "smooth",
    });
    setTimeout(() => {
      isProgrammaticScroll = false;
    }, 1000);
  }

  // Scroll up to banner from mainContainer
  if (
    currentScroll >= mainContainer.offsetTop - 50 &&
    currentScroll < lastScrollPosition
  ) {
    isProgrammaticScroll = true;
    window.scrollTo({
      top: bannerContainer.offsetTop - headerHeight,
      behavior: "smooth",
    });
    setTimeout(() => {
      isProgrammaticScroll = false;
    }, 1000);
  }

  lastScrollPosition = currentScroll;
});
