# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (HMR)
npm run build     # tsc -b && vite build
npm run lint      # eslint
npm run preview   # preview prod build
```

No test runner configured yet.

## Stack

React 19 + TypeScript 6 + Vite 8. Single-page app — no router, no state management library currently.

Entry: `src/main.tsx` → `src/App.tsx`. Styles split between `src/index.css` (global) and `src/App.css` (component-scoped).

## ESLint

Config is flat-file (`eslint.config.js`). Currently uses `tseslint.configs.recommended` (no type-aware rules). To enable type-aware rules, switch to `tseslint.configs.recommendedTypeChecked` and add `parserOptions.project` pointing at both tsconfig files — see README for the snippet.

## TypeScript

Two tsconfigs: `tsconfig.app.json` (src/) and `tsconfig.node.json` (vite config). `tsconfig.json` references both.
