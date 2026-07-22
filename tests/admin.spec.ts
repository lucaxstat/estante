import { test, expect } from '@playwright/test';

const adminPassword = process.env.ADMIN_PASSWORD ?? '';
const documentUrl = process.env.TEST_DOCUMENT_URL ?? '';

if (!adminPassword || !documentUrl) {
  console.warn('Playwright E2E tests require ADMIN_PASSWORD and TEST_DOCUMENT_URL env vars. Tests will be skipped.');
}

test.describe('Admin flow', () => {
  test.beforeEach(() => {
    if (!adminPassword || !documentUrl) {
      test.skip(true, 'Set ADMIN_PASSWORD and TEST_DOCUMENT_URL to run admin E2E tests');
    }
  });

  test('login, create, edit, and delete a document', async ({ page }) => {
    await page.request.post('/api/admin_login', { data: { password: adminPassword } });
    await page.goto('/admin');
    await expect(page.getByText('Estante — Painel de Administração')).toBeVisible();

    await page.getByPlaceholder('Link do Google Docs').fill(documentUrl);
    await page.getByRole('button', { name: /Processar/i }).click();
    await expect(page.getByText(/Documento criado com sucesso|Documento adicionado/)).toBeVisible({ timeout: 60000 });

    const card = page.locator('div.card').first();
    await expect(card).toBeVisible();

    await page.getByRole('button', { name: 'Editar' }).first().evaluate((el: HTMLElement) => el.click());
    const modal = page.locator('div:has(h3:has-text("Editar Documento"))').first();
    await expect(modal).toBeVisible();
    const titleInput = modal.locator('input').first();
    await titleInput.fill('E2E Test Document Updated');
    await modal.getByRole('button', { name: 'Salvar', exact: true }).click();
    await expect(page.getByText(/Documento atualizado/)).toBeVisible({ timeout: 10000 });

    await page.getByRole('button', { name: 'Excluir' }).first().evaluate((el: HTMLElement) => el.click());
    const confirmDialog = page.locator('div:has-text("Confirma exclusão?")').first();
    await expect(confirmDialog).toBeVisible();
    await confirmDialog.getByRole('button', { name: 'Excluir' , exact: true}).first().evaluate((el: HTMLElement) => el.click());
    await expect(page.getByText('E2E Test Document Updated')).toHaveCount(0, { timeout: 10000 });
  });
});
