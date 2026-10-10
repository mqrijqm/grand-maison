Restyled the B2B portal dashboard with a black rounded frame and a palette of sage, olive, lavender, coral, and near-black cards. Added outlined pill headings and controls, lighter KPI numerals, rounded progress bars and tables, colored calendar and project cards, and hover transitions across navigation, cards, and rows. Kept the existing labels, demo data, view structure, and interaction code intact.

Validation: `pnpm exec eslint src/components/portal` completed without reported issues. `pnpm exec tsc --noEmit` reports six existing errors in `src/app` for missing `LayoutProps` and `PageProps`; those files are outside the allowed edit scope.

## Round 2

Strengthened the bento direction across all nine portal screens: the sidebar is now a single orange-red menu card with larger icon rows and an outlined contact pill, the title bar uses an olive card, and content cards use deliberate sage, olive, lavender, and coral sequences. Increased the KPI scale, clarified pill titles and controls, and retained all existing content and interactions.

Validation: `pnpm exec eslint src/components/portal` completed without reported issues.
