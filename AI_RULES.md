## Core Principles

1. Never redesign existing features unless explicitly requested.
2. Preserve current structure, layout, and working logic.
3. Only modify files directly related to the requested task.
4. Do not touch unrelated components, pages, APIs, or configs.
5. Ask for clarification if the task is ambiguous.
6. Never assume requirements.

## Code Quality

7. Keep code clean, simple, and maintainable.
8. Avoid overengineering and unnecessary abstractions.
9. Reuse existing patterns in the project.
10. Follow current code style and naming conventions.
11. Prefer minimal surgical changes over large rewrites.

## Frontend Rules

12. Maintain responsive behavior.
13. Preserve UI consistency with existing design system.
14. Do not change spacing/colors/layout unless requested.
15. Keep accessibility and usability in mind.

## Backend Rules

16. Do not change APIs, database logic, or business rules unless requested.
17. Preserve backward compatibility when possible.
18. Validate edge cases and error handling.

## Safety Rules

19. Never delete working code without clear reason.
20. Never rename files/functions unless necessary.
21. If risky change is required, explain first.

## Output Rules

22. Return only the necessary changed code.
23. Clearly mention edited files.
24. Explain any important side effects briefly.
25. If unsure, ask first instead of guessing.