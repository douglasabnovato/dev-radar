/* Fluxo principal na tela: cadastrar dev com a posição do navegador, achar pela busca por tecnologia (a que o app faz) e remover. Roda na mesa e a 320 px (playwright.config.js), com 3 medidas de corte antes de cada axe */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const API = "http://localhost:3363"; /* mesma porta do playwright.config.js */
/* Os 2 projetos dividem a mesma API em memória: o sufixo aleatório evita o mesmo usuário nos dois */
const run = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
/* 39 letras, o máximo do GitHub: o cartão tem de caber a 320 px com o nome mais longo possível (R19 do #92) */
const usuario = `demo-${run}`.padEnd(39, "x").slice(0, 39);
const tech = `elixir${run}`;

/* Sem rolagem lateral e sem conteúdo cortado (#88). Três medidas:
   1. a largura do documento não passa da área visível;
   2. nenhum elemento visível passa da borda direita nem da esquerda;
   3. nenhuma caixa com overflow-x hidden ou clip esconde conteúdo mais largo que ela.
   Não tirar a 2ª nem a 3ª: o corte por overflow: hidden e o corte à esquerda não mudam o scrollWidth,
   e o texto cortado dentro de uma caixa fica com a caixa na tela (R19 do huntweb-swapi#57 e do sushibar#38).
   Ficam de fora o invisível de propósito: visibility: hidden, opacity: 0 e o 1 x 1 px do leitor de tela */
async function semCorteLateral(page) {
  const { largura, janela, fora, cortados } = await page.evaluate(() => {
    const janela = document.documentElement.clientWidth;
    const nome = (e) => `${e.tagName}${e.id ? "#" + e.id : ""}${e.classList[0] ? "." + e.classList[0] : ""}`;
    const visivel = (e) => {
      const c = e.getBoundingClientRect();
      const s = getComputedStyle(e);
      return c.width > 1 && c.height > 1 && s.visibility !== "hidden" && s.opacity !== "0";
    };
    const fora = Array.from(document.querySelectorAll("body *"))
      .filter((e) => { const c = e.getBoundingClientRect(); return visivel(e) && (c.right > janela + 1 || c.left < -1); })
      .slice(0, 5)
      .map((e) => { const c = e.getBoundingClientRect(); return `${nome(e)} (${Math.round(c.left)} a ${Math.round(c.right)} px)`; });
    const cortados = Array.from(document.querySelectorAll("body, body *"))
      .filter((e) => { const o = getComputedStyle(e).overflowX; return visivel(e) && (o === "hidden" || o === "clip") && e.scrollWidth > e.clientWidth + 1; })
      .slice(0, 5)
      .map((e) => `${nome(e)} (${e.scrollWidth} px em ${e.clientWidth} px)`);
    return { largura: document.documentElement.scrollWidth, janela, fora, cortados };
  });
  expect(largura, "rolagem lateral").toBeLessThanOrEqual(janela);
  expect(fora, "elementos além das bordas").toEqual([]);
  expect(cortados, "conteúdo escondido dentro de uma caixa").toEqual([]);
}

/* axe sem violações nas regras WCAG A e AA; antes, a medida de corte (com a lista cheia, depois do cadastro) */
async function semViolacoes(page) {
  await semCorteLateral(page);
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
}

test("cadastra dev, encontra pela busca e remove", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.getByRole("status").filter({ hasText: "Carregando devs" })).toHaveCount(0);
  await expect(page.getByLabel("Latitude")).toHaveValue("-21.7642");
  await expect(page.getByLabel("Longitude")).toHaveValue("-43.3503");
  await semViolacoes(page);
  /* Até 480 px, margem lateral de 16 px (#94): o formulário usa a largura da tela menos 2 x 16 px; na mesa, nada muda */
  const largura = page.viewportSize().width;
  if (largura <= 480) {
    const f = await page.locator("#app aside").boundingBox();
    expect(f.x, "margem esquerda do formulário").toBeCloseTo(16, 0);
    expect(largura - (f.x + f.width), "margem direita do formulário").toBeCloseTo(16, 0);
  }

  await page.getByLabel("Usuário do GitHub").fill(usuario);
  await page.getByLabel("Tecnologias").fill(`${tech}, React`);
  await page.getByRole("button", { name: "Salvar" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Dev cadastrado!" })).toBeVisible();
  const cartao = page.locator(".dev-item").filter({ hasText: `Dev ${usuario}` });
  await expect(cartao).toContainText(`${tech}, react`);
  /* Alvos de toque do cartão (#93): o link e o "Remover" com pelo menos 44 x 44 px (regra da casa; WCAG 2.5.8 pede 24)
     e a pelo menos 8 px um do outro, porque o "Remover" é destrutivo (R19 do #96: sem a distância, o gap 0 passava) */
  const [a, b] = await Promise.all([
    cartao.getByRole("link", { name: /Acessar o perfil no GitHub/ }).boundingBox(),
    cartao.getByRole("button", { name: /Remover/ }).boundingBox(),
  ]);
  for (const [nome, c] of [["link", a], ["Remover", b]]) {
    expect(c.height, `altura do alvo "${nome}"`).toBeGreaterThanOrEqual(44);
    expect(c.width, `largura do alvo "${nome}"`).toBeGreaterThanOrEqual(44);
  }
  const distancia = Math.max(b.x - (a.x + a.width), a.x - (b.x + b.width), b.y - (a.y + a.height), a.y - (b.y + b.height));
  expect(distancia, "os 2 alvos a pelo menos 8 px").toBeGreaterThanOrEqual(8);
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
  await semCorteLateral(page);
  await page.reload();
  await expect(page.locator(".dev-item").filter({ hasText: `Dev ${usuario}` })).toHaveCount(0);
});
/* Fim de fluxo.e2e.js */
