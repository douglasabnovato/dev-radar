/* Fluxo principal na tela: cadastrar dev com a posição do navegador, achar pela busca por tecnologia (a que o app faz) e remover */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const API = "http://localhost:3363"; /* mesma porta do playwright.config.js */
const run = Date.now().toString(36);
const usuario = `demo-${run}`;
const tech = `elixir${run}`;

/* axe sem violações nas regras WCAG A e AA */
async function semViolacoes(page) {
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
}

test("cadastra dev, encontra pela busca e remove", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.getByRole("status").filter({ hasText: "Carregando devs" })).toHaveCount(0);
  await expect(page.getByLabel("Latitude")).toHaveValue("-21.7642");
  await expect(page.getByLabel("Longitude")).toHaveValue("-43.3503");
  await semViolacoes(page);

  await page.getByLabel("Usuário do GitHub").fill(usuario);
  await page.getByLabel("Tecnologias").fill(`${tech}, React`);
  await page.getByRole("button", { name: "Salvar" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Dev cadastrado!" })).toBeVisible();
  const cartao = page.locator(".dev-item").filter({ hasText: `Dev ${usuario}` });
  await expect(cartao).toContainText(`${tech}, react`);
  await semViolacoes(page);

  /* Busca do app: perto de Juiz de Fora acha; no Rio (a ~130 km) não acha */
  const perto = await (await request.get(`${API}/search`, { params: { latitude: -21.76, longitude: -43.35, techs: tech } })).json();
  expect(perto.devs.map((d) => d.github_username)).toContain(usuario);
  const longe = await (await request.get(`${API}/search`, { params: { latitude: -22.9068, longitude: -43.1729, techs: tech } })).json();
  expect(longe.devs).toHaveLength(0);

  await page.getByLabel("Usuário do GitHub").fill("nao-existe");
  await page.getByLabel("Tecnologias").fill("Go");
  await page.getByRole("button", { name: "Salvar" }).click();
  await expect(page.getByRole("alert")).toHaveText("Usuário do GitHub não encontrado.");
  await semViolacoes(page);

  page.once("dialog", (d) => d.accept());
  await cartao.getByRole("button", { name: `Remover Dev ${usuario}` }).click();
  await expect(cartao).toHaveCount(0);
  await page.reload();
  await expect(page.locator(".dev-item").filter({ hasText: `Dev ${usuario}` })).toHaveCount(0);
});
/* Fim de fluxo.e2e.js */
