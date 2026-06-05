import { test, expect } from '@playwright/test';

// sanity check
test('has title', async ({ page }) => {
  await page.goto('');
  // await expect(page).toHaveTitle(/HabitPet/);
});

// On non-fail state, guarantee's to go to the register page
async function GoToRegister(page) {
  await expect(page.getByTestId('login-container')).toBeVisible();
  const registerLink = page.getByTestId('register-link');

  await registerLink.click();
  await expect(page.getByTestId('register-container')).toBeVisible();
}

async function TryRegisterNewUser(page, username, password) {
  await expect(page.getByTestId('register-container')).toBeVisible();

  const registerInput = page.getByTestId('username-input');
  const passwordInput = page.getByTestId('password-input');
  const registerBtn = page.getByTestId('register-btn');

  await registerInput.fill(username);
  await passwordInput.fill(password);
  await registerBtn.click();
}

async function TryLoginUser(page, username, password) {
  await expect(page.getByTestId('login-container')).toBeVisible();

  const loginInput = page.getByTestId('username-input');
  const loginPasswordInput = page.getByTestId('password-input');
  const loginBtn = page.getByTestId('login-btn');
  await loginInput.fill(username);
  await loginPasswordInput.fill(password);
  await loginBtn.click();
}

async function LoginTestUser(page) {
  await GoToRegister(page);
  await TryRegisterNewUser(page, TEST_USERNAME, TEST_PASSWORD);
  await TryLoginUser(page, TEST_USERNAME, TEST_PASSWORD);
  await expect(page.getByTestId('app-container')).toBeVisible();
}

const TEST_USERNAME = `testuser_${Date.now()}`;
const TEST_PASSWORD = 'testpassword';

test.describe('Authentication', () => {
  test.afterEach(async ({ request }) => {
    const response = await request.delete(`${process.env.API_URI}api/testing/cleanup-user`, {
      data: { username: TEST_USERNAME }
    });

    expect(response.status()).not.toBe(500);
    expect(response.status()).not.toBe(501);
  });
  test('can register a new account', async ({ page }) => {
    await page.goto('');

    // 1. Go to home page, should see login
    await GoToRegister(page);

    // 2. Create a new account, should go back to login if valid
    await TryRegisterNewUser(page, TEST_USERNAME, TEST_PASSWORD);

    // 3. Try logging in with new account, should work
    await TryLoginUser(page, TEST_USERNAME, TEST_PASSWORD);

    // 3. Check if login was successful
    await expect(page.getByTestId('app-container')).toBeVisible();
  }
  );
  test('cannot register with existing username', async ({ page }) => {
    await page.goto('');
    const existingname = 'testuser';

    // 1. Go to register page
    await GoToRegister(page);

    // 2. Attempt to register account with existing username
    await TryRegisterNewUser(page, existingname, 'testpassword');

    // 3. Expect login to fail with error message
    await expect(page.getByTestId('register-container')).toBeVisible();
    await expect(page.getByTestId('register-error')).toHaveText('An account with this username already exists.');
  })
  test('cannot register with short password', async ({ page }) => {
    await page.goto('');

    // 1. Go to register page
    await GoToRegister(page);

    // 2. Attempt to register account with existing username
    await TryRegisterNewUser(page, TEST_USERNAME, 'short');

    // 3. Expect login to fail with error message
    await expect(page.getByTestId('register-container')).toBeVisible();
    await expect(page.getByTestId('register-error')).toHaveText('Password must be at least 6 characters');
  })
});

const FREQ_POINTS = {
  daily: 10,
  weekly: 70,
  monthly: 100
};

async function CreateTask(page, title, description, frequency) {
  await LoginTestUser(page);

  const habitsTab = page.getByTestId('habits-tab');
  await habitsTab.click();

  const addHabitBtn = page.getByTestId('add-habit-btn');
  await addHabitBtn.click();

  const titleInput = page.getByTestId('habit-modal-title-input');
  const descriptionInput = page.getByTestId('habit-modal-description-input');
  const frequencySelect = page.getByTestId('habit-modal-frequency-select');
  const saveBtn = page.getByTestId('habit-modal-save-btn');

  await titleInput.fill(title);
  await descriptionInput.fill(description);
  await frequencySelect.selectOption(frequency);
  await saveBtn.click();

  const habitTitle = page.getByTestId('habit-title-0');
  const habitDescription = page.getByTestId('habit-description-0');
  const habitReward = page.getByTestId('habit-reward-0');
  const descriptionToggleBtn = page.getByTestId('description-toggle-btn-0');

  await expect(habitTitle).toHaveText(title);
  await expect(habitReward).toHaveText(FREQ_POINTS[frequency].toString());

  return {
    habitTitle,
    habitDescription,
    habitReward,
    descriptionToggleBtn
  }
}


test.describe("Habits", () => {
  test.afterEach(async ({ request }) => {
    const response = await request.delete(`${process.env.API_URI}api/testing/cleanup-user`, {
      data: { username: TEST_USERNAME }
    });

    expect(response.status()).not.toBe(500);
    expect(response.status()).not.toBe(501);
  });
  test('can add and delete a new habit', async ({ page }) => {
    await page.goto('');
    const { habitTitle, habitDescription, descriptionToggleBtn } = await CreateTask(page, 'Test Habit', 'This is a test habit', 'weekly');
    await descriptionToggleBtn.click();
    await expect(habitDescription).toHaveText('This is a test habit');

    const deleteBtn = page.getByTestId('delete-btn-0');
    await deleteBtn.click();
    await expect(habitTitle).not.toBeVisible();
  })
  test('can mark habit as done', async ({ page }) => {
    await page.goto('');
    const { habitTitle, habitDescription, descriptionToggleBtn } = await CreateTask(page, 'Test Habit', 'This is a test habit', 'weekly');
    await descriptionToggleBtn.click();
    await expect(habitDescription).toHaveText('This is a test habit');

    const toggleBtn = page.getByTestId('toggle-btn-0');
    await toggleBtn.click();
    await expect(habitTitle).toHaveClass(/completed/);

    const deleteBtn = page.getByTestId('delete-btn-0');
    await deleteBtn.click();
    await expect(habitTitle).not.toBeVisible();
  });
});