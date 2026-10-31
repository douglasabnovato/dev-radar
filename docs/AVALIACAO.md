# Avaliação — dev-radar

> Data: 30/10/2026 · Base: `e7d9ae1`. Teste automático em cópia limpa, no Windows com Node 24; links testados uma vez.

## Execução

| Parte | Instalação | Testes | Build |
|---|---|---|---|
| `backend` | passa | passa | não há |
| `mobile` | falha | não há | não há |
| `web` | passa | passa | passa |

Falhas de instalação de módulos nativos podem ser próprias do Node 24 no Windows. O CI do PR, com Node 22 no Linux, é a referência.

## Publicação

| Endereço citado no README | Situação |
|---|---|
| https://dev-radar-api.onrender.com/health | **404** |
| https://dev-radar.onrender.com | **404** |

## Limites

O código e as telas não foram revisados um a um. Um endereço que responde não prova que a aplicação funciona, e um servidor gratuito pode estar dormindo.
