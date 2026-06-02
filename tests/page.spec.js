import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  // Expect a title "to contain" a substring.
  await page.goto('/');
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

const TEST_USERNAME = `testuser_${Date.now()}`;
const TEST_PASSWORD = 'testpassword';

test.describe('Authentication', () => {
  test.afterEach(async ({ request }) => {
    console.log(process.env.API_URI);
    const response = await request.delete(`${process.env.API_URI}api/testing/cleanup-user`, {
      data: { username: TEST_USERNAME }
    });

    expect(response.status()).not.toBe(500);
  });
  test('can register a new account', async ({ page }) => {
    await page.goto('/');

    // testuser + timestamp to ensure unique username each test run
    // TODO: How to clean up test users, or seperate it into a new mongodb cluster

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
    await page.goto('/');
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
    await page.goto('/');

    // 1. Go to register page
    await GoToRegister(page);

    // 2. Attempt to register account with existing username
    await TryRegisterNewUser(page, TEST_USERNAME, 'short');

    // 3. Expect login to fail with error message
    await expect(page.getByTestId('register-container')).toBeVisible();
    await expect(page.getByTestId('register-error')).toHaveText('Password must be at least 6 characters');
  })
});