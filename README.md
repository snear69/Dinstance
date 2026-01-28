# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Payments (Paystack)

This project uses Paystack Inline via `react-paystack`.

### Environment variables

- **Frontend (Vite)**: set your Paystack **public** key only:
  - `VITE_PAYSTACK_PUBLIC_KEY`

Create a local `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

### Important security note

- **Never put your Paystack secret key (`sk_*`) in the frontend**. Anything in the browser bundle is public.
- Keep secret keys on a backend (or serverless function) if you need to verify transactions server-side.
