# Weather Dashboard

## Overview

The Weather Dashboard is a single-page web application built with Vue 3 and TypeScript. It allows users to view both historical and forecasted weather data for a selected location. The application demonstrates clean and well-structured code with a focus on architecture and a well-defined domain layer.

The project uses the Open-Meteo API to fetch weather data and follows a layered architecture to separate concerns across the domain, application, and infrastructure layers.

## Features

- Location Selection:
  - Search for cities using a text input.
  - Enter latitude and longitude manually.
  - Use the browser's geolocation to fetch the current location.
- Weather Data:
  - View forecasted weather data (temperature, humidity, wind speed).
  - View historical weather data for a selected date range.
- Data Visualization:
  - Display weather data in a table.
  - Visualize weather data on a line chart using Chart.js.
- Error Handling:
  - Graceful handling of API errors and invalid inputs.
  - User-friendly error messages displayed in the UI.

## Architecture

The project follows a layered architecture with distinct **domain**, **application**, and **infrastructure** layers:

1. Domain layer
    - **Entities**: Core business objects like **WeatherReport**, **Temperature**, **RelativeHumidity**, **WindSpeed**, and **City**.
    - **DTOs**: Data Transfer Objects (e.g., **WeatherDTO**, **LocationDTO**) for API communication.
    - **Interfaces**: Contracts for repositories and other abstractions (e.g., **IWeatherRepository**, **ILocationRepository**).
2. Application Layer
    - **Use Cases**: Encapsulate application logic, such as:
        - **FetchForecastWeather**: Fetch forecasted weather data.
        - **FetchHistoricalWeather**: Fetch historical weather data.
        - **SearchCities**: Search for cities by name.
3. Infrastructure Layer
    - **API Clients**: Axios-based clients for interacting with the Open-Meteo API:
        - **ForecastWeatherClient**
        - **HistoricalWeatherClient**
        - **LocationClient**
    - **Repositories**: Implement the repository pattern to abstract API calls:
        - **ForecastWeatherRepository**
        - **HistoricalWeatherRepository**
        - **CitiesRepository**

## Technologies Used
- **Frontend**: Vue 3 with Composition API
- **TypeScript**: For type safety and maintainability
- **Charting**: Chart.js with Vue-Chart.js for data   - visualization
- **Styling**: Tailwind CSS for responsive design
- **Testing**:
    - Unit Testing: Vitest
    - Component Testing: @vue/test-utils and @testing-library/vue
- **Error Handling**: option-t for Result type-based error handling
- **API**: Open-Meteo API for weather data

## Setup Instructions
1. **Prerequisites**
    - Node.js (v16 or higher)
    - npm or yarn
2. **Clone the Repository**
```bash
git clone https://github.com/Banych/weather-dashboard.git
cd weather-dashboard
```
3. **Install Dependencies**
```bash
yarn
```
4. **Run the Development Server**
```bash
yarn dev
```
The application will be available at http://localhost:5173.

5. Run Tests
```bash
yarn test
```
6. Build for Production
```bash
yarn build
```
The production build will be available in the `dist` folder.

## Project Structure
```plaintext
src/
├── application/         # Application layer (use cases)
├── components/          # Vue components
├── composables/         # Reusable Vue composables
├── constants/           # Constants (e.g., time formats)
├── domain/              # Domain layer (entities, DTOs, interfaces, repositories)
├── tests/               # Unit and component tests
├── utils/               # Utility functions
├── App.vue              # Root Vue component
├── main.ts              # Application entry point
└── style.css            # Global styles
```

## Key Components
1. **CityInput**
    - Allows users to search for cities by name.
    - Emits a select event when a city is selected.
2. **CoordinatesInput**
    - Allows users to manually enter latitude and longitude.
    - Includes a "Get Current Location" button to fetch the user's location using the browser's geolocation API.
3. **HistoricalDataInput**
    - Allows users to select a date range for historical weather data.
    - Emits update:startDate and update:endDate events.
4. **WeatherTable**
    - Displays weather data (temperature, humidity, wind speed) in a tabular format.
5. **WeatherChart**
    - Visualizes weather data on a line chart using Chart.js.

## Error Handling
- **Result Type:** The option-t library is used to handle errors consistently across repositories and use cases.
- **UI Feedback:** Errors are displayed in the UI, such as "Error loading weather data."

## Testing
The project includes extensive unit and component tests:

- **Domain Models:** Tests for entities like ***Temperature***, ***RelativeHumidity***, and ***WeatherReport***.
- **Repositories:** Mocked API calls to test repositories like ***ForecastWeatherRepository***.
- **Use Cases:** Tests for application logic (e.g., ***FetchForecastWeather***).
- **Components:** Tests for Vue components using `@vue/test-utils` and `@testing-library/vue`.

## Challenges
- **Managing Time and Complexity**: Balancing limited time with the temptation to over-engineer the architecture or add extra features was challenging. The focus remained on completing the core requirements without unnecessary complexity.

- **Deciding How Much to Test**: Determining the right amount of testing was tricky. The priority was to ensure the app's reliability while avoiding excessive time spent on testing minor details. Key areas were covered, and further testing was deferred to focus on improving the app's structure.

- **Building a Good Architecture Quickly**: Designing a clear and maintainable architecture under time constraints was difficult. Efforts were made to separate concerns across the domain, application, and infrastructure layers while ensuring the codebase remained easy to extend and maintain.