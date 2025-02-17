# dwellify

# Housing Search Platform

A map-based web application for discovering rental properties with accessibility and pet-friendly filters. Built with Leaflet.js, Bootstrap, and OpenStreetMap data.


## Key Features
- **Interactive Map Interface**  
  Visualize properties geographically with Leaflet.js integration
- **Advanced Filtering**  
  Search by:
  - Property type (Apartments, Townhouses, Co-Living, Houses)
  - Wheelchair accessibility
  - Pet policies (breed/weight restrictions, fees)
- **Detailed Listings**  
  Hover tooltips and offcanvas panels show:
  - Pricing
  - Pet deposits/fees


## Technologies
- **Mapping**: Leaflet.js + OpenStreetMap
- **Frontend**: Bootstrap 5, CSS3, HTML5
- **Data**: JSON-based property storage
- **Geocoding**: Nominatim API

## Installation
```
git clone https://github.com/crystalogy/housing-search.git
cd housing-search
npm install leaflet bootstrap
```

Requires modern browser with JavaScript enabled


## Usage
1. Search by address/zipcode
2. Filter using dropdown menus:
3. Click markers for full details

## Data Structure
Properties stored in `propertyData.js`:
```
{
address: "590 Candlewyck Road, Lancaster, PA 17601",
price: "$1,800/mo",
coordinates: [40.0379, -76.3055],
wheelchairAccessible: "No",
petPolicy: {
deposit: "$0",
monthlyFee: "$30",
restrictions: "None"
},
```

## File Structure
```
├── index.html # Main interface
├── script.js # Map logic & interactions
├── propertyData.js # Rental listings database
└── style.css # Custom styling
```

## Credits
- Map data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors
- UI icons from Bootstrap Icons
- Geocoding via [Nominatim](https://nominatim.org/)
