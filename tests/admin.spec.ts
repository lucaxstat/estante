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
    await page.goto('/admin');

    await page.getByPlaceholder('Senha do Admin').fill(adminPassword);
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByText('Acervo Acadêmico - Admin')).toBeVisible();

    await page.getByPlaceholder('Link do Google Docs').fill(documentUrl);
    await page.getByRole('button', { name: /Processar/i }).click();
    await expect(page.getByText(/Documento criado com sucesso|Documento adicionado/)).toBeVisible({ timeout: 60000 });

    const card = page.locator('div.card').first();
    await expect(card).toBeVisible();

    await card.getByRole('button', { name: 'Editar' }).click();
    const modal = page.locator('div:has-text("Editar Documento")');
    await expect(modal).toBeVisible();
    const titleInput = modal.locator('input').first();
    await titleInput.fill('E2E Test Document Updated');
    await modal.getByRole('button', { name: 'Salvar' }).click();
    await expect(page.getByText(/Documento atualizado/)).toBeVisible({ timeout: 10000 });

    await card.getByRole('button', { name: 'Excluir' }).click();
    const confirmDialog = page.locator('div:has-text("Confirma exclusão?")');
    await expect(confirmDialog).toBeVisible();
    await confirmDialog.getByRole('button', { name: 'Excluir' }).click();
    await expect(page.getByText(/Documento excluído/)).toBeVisible({ timeout: 10000 });
  });
});
