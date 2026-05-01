# 🎭 Playwright UI Automation Framework

A scalable and maintainable **UI automation framework** built using **Playwright and TypeScript** to test core functionalities of an e-commerce application.

This project demonstrates real-world QA automation practices including structured architecture, reusable components, and reliable test execution strategies.

---

## 🚀 Features

- ✅ Built with **Playwright + TypeScript**
- ✅ **Page Object Model (POM)** for clean test design
- ✅ Modular and scalable project structure
- ✅ Parallel test execution
- ✅ Automatic retries for flaky tests
- ✅ HTML reporting with execution insights
- ✅ Screenshot, video, and trace capture on failure
- ✅ Environment-based configuration using `.env`
- ✅ Reusable fixtures and utility functions

---

## 📁 Project Structure

```
playwright-ui-automation-framework/
│
├── src/
│   ├── pages/        # Page Object classes
│   ├── data/         # Test data
│   ├── utils/        # Fixtures & helpers
│
├── tests/            # Test cases (feature-based)
│
├── config/           # Environment configs
│
├── playwright.config.ts
├── package.json
└── README.md
```

---

## 🧱 Architecture Overview

- **Page Object Model (POM)** ensures separation of concerns
- Centralized **test data management**
- Reusable **utilities and fixtures**
- Clean and readable test cases

---

## 🧪 Test Coverage

The framework includes end-to-end test scenarios for:

- 🔐 User Authentication (Login / Signup)
- 🛍️ Product Browsing & Validation
- 🛒 Cart Operations
- 💳 Checkout Process
- 📩 Contact Form Submission
- 🔄 Navigation Flows

---

## ⚙️ Tech Stack

- **Playwright**
- **TypeScript**
- **Node.js**
- **dotenv**
- **ESLint & Prettier**

---

## 🛠️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd playwright-ui-automation-framework
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Install Playwright Browsers

```bash
npx playwright install
```

### 4️⃣ Configure Environment Variables

Create a `.env` file in the root directory:

```env
BASE_URL=https://automationexercise.com
```

---

## ▶️ Running Tests

### Run all tests

```bash
npx playwright test
```

### Run tests in headed mode

```bash
npx playwright test --headed
```

### Run specific test file

```bash
npx playwright test tests/example.spec.ts
```

### Debug mode

```bash
npx playwright test --debug
```

---

## 📊 Test Reports

After execution, view the HTML report:

```bash
npx playwright show-report
```

Reports include:
- Execution summary
- Passed/failed tests
- Screenshots on failure
- Trace viewer for debugging

---

## 📸 Failure Artifacts

On test failure, the framework automatically captures:
- Screenshots
- Videos
- Playwright traces

These help in debugging and root cause analysis.

---

## ⚡ Advanced Capabilities

- Parallel execution for faster test runs
- Retry mechanism for flaky tests
- Configurable environments
- Scalable structure for large test suites

---

## 🎯 Purpose of This Project

This project was built to:
- Demonstrate **automation testing skills**
- Showcase **framework design knowledge**
- Apply **industry-level QA best practices**

---

## 📌 Future Improvements

- CI/CD integration (GitHub Actions)
- API + UI combined testing
- Docker support
- Cross-browser cloud execution

---

## 🤝 Contributing

Feel free to fork this repo and improve it. Contributions are welcome!

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 👨‍💻 Author

**Afeef Ahmed**  
QA Automation Engineer
