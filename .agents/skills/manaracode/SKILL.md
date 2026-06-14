```markdown
# manaracode Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `manaracode` JavaScript repository. It covers file naming, import/export styles, commit message conventions, and testing patterns to ensure consistency and maintainability across the codebase. While no frameworks or automated workflows were detected, this guide provides practical examples and suggested commands for common development tasks.

## Coding Conventions

### File Naming
- **Pattern:** PascalCase
- **Example:**  
  ```plaintext
  UserProfile.js
  AuthService.js
  ```

### Import Style
- **Pattern:** Relative imports
- **Example:**  
  ```javascript
  import { getUser } from './UserService';
  import { validateEmail } from '../utils/Validation';
  ```

### Export Style
- **Pattern:** Named exports
- **Example:**  
  ```javascript
  // In UserService.js
  export function getUser(id) { /* ... */ }
  export function createUser(data) { /* ... */ }

  // Importing
  import { getUser, createUser } from './UserService';
  ```

### Commit Message Convention
- **Pattern:** Conventional commits with `feat` prefix
- **Average Length:** 51 characters
- **Example:**  
  ```
  feat: add user authentication to login page
  ```

## Workflows

### Creating a New Feature
**Trigger:** When implementing a new feature  
**Command:** `/new-feature`

1. Create a new file using PascalCase (e.g., `NewFeature.js`).
2. Use relative imports to include dependencies.
3. Export functions or components using named exports.
4. Write or update corresponding test files (see Testing Patterns).
5. Commit your changes using the conventional commit format:
   ```
   feat: short description of the new feature
   ```
6. Push your branch and open a pull request.

### Refactoring Existing Code
**Trigger:** When improving or restructuring existing code  
**Command:** `/refactor`

1. Identify the files to refactor.
2. Maintain PascalCase naming for any new or renamed files.
3. Update imports/exports to use relative paths and named exports.
4. Ensure all affected tests are updated and passing.
5. Commit with a descriptive message:
   ```
   feat: refactor [component/service] for [reason]
   ```
6. Push your changes and create a pull request.

## Testing Patterns

- **Test File Pattern:** Files ending with `.test.*` (e.g., `UserService.test.js`)
- **Framework:** Unknown (ensure to follow existing test structure)
- **Example:**
  ```javascript
  // UserService.test.js
  import { getUser } from './UserService';

  test('should return user by id', () => {
    const user = getUser(1);
    expect(user.id).toBe(1);
  });
  ```
- Place test files alongside the modules they test or in a dedicated `tests` directory, following the `.test.js` pattern.

## Commands
| Command         | Purpose                                   |
|-----------------|-------------------------------------------|
| /new-feature    | Start a new feature with conventions      |
| /refactor       | Refactor code following repo patterns     |
```