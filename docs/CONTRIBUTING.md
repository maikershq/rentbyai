# Contributing to RentBy

Thank you for your interest in contributing to RentBy! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, constructive, and collaborative. We're building something awesome together.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [GitHub Issues](https://github.com/maikershq/rentbyai/issues)
2. If not, create a new issue with:
   - Clear title describing the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, browser, wallet, etc.)
   - Screenshots if applicable

### Suggesting Features

1. Check existing issues and discussions
2. Create a new issue with:
   - Clear description of the feature
   - Use case and benefits
   - Potential implementation approach
   - Mockups if applicable

### Contributing Code

#### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone git@github.com:YOUR_USERNAME/rentbyai.git
cd rentbyai

# Add upstream remote
git remote add upstream git@github.com:maikershq/rentbyai.git
```

#### 2. Create a Branch

```bash
# Update main
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

#### 3. Make Changes

Follow our coding standards:

**Smart Contracts (Rust/Anchor):**
- Follow Rust style guide
- Add documentation comments
- Write tests for all functions
- Run `cargo fmt` before committing
- Run `cargo clippy` and fix warnings

**API (Node.js):**
- Use ES6+ features
- Add JSDoc comments
- Write unit tests for new endpoints
- Maintain RESTful conventions
- Validate all inputs

**Frontend (React/Next.js):**
- Use TypeScript
- Follow React best practices
- Add PropTypes/TypeScript types
- Write component tests
- Keep components small and focused

#### 4. Test Your Changes

```bash
# Smart contracts
anchor test

# API
cd api
npm test

# Frontend
cd frontend
npm test
npm run build  # Ensure it builds
```

#### 5. Commit

Write clear, concise commit messages:

```bash
# Good commit messages
git commit -m "feat: add rental cancellation endpoint"
git commit -m "fix: resolve wallet connection issue on mobile"
git commit -m "docs: update API documentation"
git commit -m "test: add integration tests for disputes"

# Format: <type>: <description>
# Types: feat, fix, docs, test, refactor, style, chore
```

#### 6. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub with:
- Clear title and description
- Link to related issues
- Screenshots/videos if UI changes
- Test results

### Pull Request Guidelines

**Before submitting:**
- [ ] Code follows project style
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] No console.log or debugging code
- [ ] No merge conflicts

**PR Description should include:**
- What changed and why
- How to test
- Any breaking changes
- Related issues

### Code Review Process

1. Maintainers will review your PR
2. Address feedback and update PR
3. Once approved, your PR will be merged
4. Your contribution will be in the next release!

## Development Setup

### Prerequisites

- Node.js 18+
- Rust + Cargo
- Solana CLI
- Anchor Framework

### Setup

```bash
# Install dependencies
cd api && npm install
cd ../frontend && npm install

# Set up environment variables
cp api/.env.example api/.env
cp frontend/.env.example frontend/.env

# Run locally
npm run dev
```

See [README.md](../README.md) for detailed setup instructions.

## Project Structure

```
rentby/
├── programs/           # Anchor smart contracts
│   └── rentby/
│       └── src/
│           └── lib.rs
├── api/               # REST API
│   ├── src/
│   │   ├── index.js
│   │   └── routes/
│   └── tests/
├── frontend/          # Next.js frontend
│   ├── app/
│   ├── components/
│   └── lib/
├── tests/             # Smart contract tests
├── scripts/           # Deployment scripts
└── docs/              # Documentation
```

## Testing

### Smart Contracts

```bash
anchor test
```

### API

```bash
cd api
npm test                    # All tests
npm test -- resources.test  # Specific test file
```

### Frontend

```bash
cd frontend
npm test
```

## Documentation

Update documentation when you:
- Add new features
- Change APIs
- Modify deployment process
- Add configuration options

Documentation files:
- `README.md` - Overview and setup
- `docs/ARCHITECTURE.md` - System design
- `api/API.md` - API endpoints
- `docs/DEPLOYMENT.md` - Deployment guide
- `docs/SECURITY.md` - Security practices

## Style Guide

### JavaScript/TypeScript

```javascript
// Use const/let, not var
const items = [];
let count = 0;

// Use arrow functions
const process = (item) => {
  return item.value;
};

// Use async/await over callbacks
async function fetchData() {
  const response = await fetch(url);
  return response.json();
}

// Destructure when appropriate
const { id, name } = resource;

// Use template literals
const message = `Resource ${id} created`;
```

### Rust

```rust
// Follow Rust naming conventions
struct ResourceAccount { ... }
pub fn create_rental(...) { ... }

// Add documentation
/// Creates a new rental agreement
/// 
/// # Arguments
/// * `rental_price` - Price in lamports
/// * `duration` - Rental duration in seconds
pub fn create_rental(...) { ... }

// Use Result for errors
pub fn process() -> Result<()> {
    // ...
}
```

### React/Next.js

```typescript
// Use TypeScript
interface ResourceProps {
  id: string;
  name: string;
}

// Functional components
const ResourceCard: React.FC<ResourceProps> = ({ id, name }) => {
  return <div>{name}</div>;
};

// Use hooks
const [resources, setResources] = useState<Resource[]>([]);

useEffect(() => {
  fetchResources();
}, []);
```

## Getting Help

- Join our Discord/Telegram (links in README)
- Ask questions in GitHub Discussions
- Email: dev@rentby.ai

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Thanked in our community channels

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).

---

Thank you for contributing to RentBy! 🚀
