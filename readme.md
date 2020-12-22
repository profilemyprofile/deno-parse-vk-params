# Usage

```typescript
let params = parseVKParams('...', env.VK_APP_SECRET_KEY)

if (params.isCorrect) {
    let userId = params.vk_user_id
} else {
    // incorrect
}
```