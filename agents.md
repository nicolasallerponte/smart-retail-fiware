MANDATORY WORKFLOW for every issue:
1. Start in Plan mode — no code until the plan is approved
2. Create the GitHub issue with the plan content
3. Create a git branch for that issue
4. Implement, commit and push the branch
5. Merge to main and push to origin/main
6. Always update PRD.md, architecture.md and data_model.md after closing an issue

TECHNICAL RULES:
- Use CSS over JS whenever possible
- Never generate HTML from JS if it can be avoided
- Use host.docker.internal instead of localhost when registering 
  context providers and subscriptions in Orion, since Orion runs 
  in a Docker container
- Conversation logs go in a separate file added only at the end, 
  so the agent never uses them as context