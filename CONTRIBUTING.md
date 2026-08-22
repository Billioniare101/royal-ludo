# Contributing to Royal Ludo

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `pnpm install`
3. Create a feature branch: `git checkout -b feature/your-feature`
4. Make your changes
5. Add tests for new functionality
6. Run tests: `pnpm test`
7. Commit with descriptive message: `git commit -m 'feat: add feature'`
8. Push and open a Pull Request

## Code Style

- Use TypeScript for all code
- Follow the existing code structure
- Format with Prettier (auto-formatted on commit)
- Write descriptive variable/function names
- Add JSDoc comments for public APIs

## Testing

- All new features must have tests
- Write unit tests for game logic
- Write integration tests for API endpoints
- Use descriptive test names
- Aim for >80% coverage on critical paths

## Commit Messages

Use conventional commits:
- `feat: add new feature`
- `fix: fix bug`
- `refactor: refactor code`
- `test: add tests`
- `docs: update documentation`
- `chore: maintenance tasks`

## Architecture Guidelines

- Keep the game engine independent of React
- Keep game logic deterministic and testable
- Maintain server authority over game state
- Never trust client dice rolls
- Always validate moves on the server
- Use shared types for client-server communication

## Pull Request Process

1. Ensure all tests pass: `pnpm test`
2. Ensure no linting errors: `pnpm lint`
3. Ensure TypeScript compiles: `pnpm typecheck`
4. Update documentation if needed
5. Add description of changes
6. Reference related issues
7. Request review from maintainers

## Questions?

Open an issue or start a discussion in the repository.
