# 🌦️ Weather App UI Design Guidelines (React Native)

## 🎯 Objective
Build a **modern**, **intuitive**, and **professional** weather app UI using **strong UI/UX principles** and clean, maintainable components. All screens must feel cohesive, responsive, and ready for production.

---

## ✅ Design Principles (Strict Rules for Copilot to Follow)

1. **Modern UI Aesthetic**
   - Use clean typography (e.g., `Inter`, `SF Pro`, `Roboto`) with a clear hierarchy.
   - Rounded corners (`borderRadius: 12` or more).
   - Subtle shadows for depth (`elevation`, `shadowColor`, etc.).
   - Use soft gradients or blurred backgrounds where appropriate.

2. **Consistent Spacing**
   - Use `8pt grid`: spacing must follow `4 / 8 / 16 / 24 / 32` increments.
   - No arbitrary paddings/margins (e.g., `marginLeft: 5` is **not allowed**).

3. **Color Scheme**
   - Follow a consistent light/dark theme.
   - Use semantic color tokens:
     - `primary`, `secondary`, `background`, `surface`, `textPrimary`, `textSecondary`, `accent`, `error`.
   - Colors must pass accessibility contrast checks.

4. **Component-Driven**
   - All UI elements should be reusable components (e.g., `<WeatherCard />`, `<HourlyForecast />`, `<LocationSearchInput />`).
   - Avoid inline styles unless dynamic and contextual.
   - Component props should be well-named and self-explanatory.

5. **Responsiveness**
   - Layout must adapt to various screen sizes (especially small phones).
   - Use `flex`, `Dimensions`, and `%` where appropriate instead of fixed width/height.

6. **UX Guidelines**
   - Use skeleton loaders or shimmer effects while data is loading.
   - Taps must provide haptic feedback or visual confirmation.
   - Important information (like temperature, alerts) must be prominent and readable at a glance.
   - Do **not** overload with unnecessary animations or visual clutter.

7. **Icons & Imagery**
   - Use weather-related icons (e.g., sun, cloud, rain) from a consistent icon pack (e.g., `Feather`, `MaterialCommunityIcons`, `Lucide`).
   - SVGs or vector icons preferred over raster images.
   - Icons must scale with DPI.

8. **Typography**
   - Use 3–5 font sizes maximum, such as:
     - `headline`: 32px
     - `title`: 24px
     - `subtitle`: 18px
     - `body`: 16px
     - `caption`: 12px
   - Always apply lineHeight for readability.

9. **Animations**
   - Use `react-native-reanimated` or `Framer Motion (web only)` for transitions.
   - Keep animations snappy and purposeful (<300ms).
   - Avoid bounce/spring effects unless conveying refresh or weather-related transition.

---

## 📱 Screens to Build

1. **Home Screen**
   - City name, current temperature, weather icon
   - Hourly forecast horizontal scroll
   - Weekly forecast below
   - Toggle for °C/°F

2. **Search / Add Location**
   - Search input with autocomplete
   - List of past or saved cities
   - Tap city to view details

3. **Forecast Details**
   - More in-depth info for the selected day: wind, humidity, UV, sunrise/sunset
   - Scrollable content

4. **Settings**
   - Theme toggle (light/dark/system)
   - Units toggle (imperial/metric)
   - About app

---

## 🧱 Tech Constraints

- **Framework:** React Native (Expo preferred)
- **Styling:** Tailwind (via `tailwind-rn`) or styled-components
- **Navigation:** React Navigation
- **State:** Context or Redux Toolkit (optional)
- **Type Checking:** TypeScript required
- **API Data:** Assume OpenWeatherMap or similar

---

## 🤖 Copilot Directives

Copilot must:

- Only generate code that complies with these rules.
- Never use hardcoded styles or deprecated APIs.
- Prioritize accessibility and responsive design.
- Keep code modular, readable, and documented with comments.

Copilot must not:

- Suggest inline magic numbers.
- Generate UI elements without semantic grouping.
- Use generic or vague naming (e.g., `View1`, `Text2`).

---

## 📎 File Structure (Suggested)

