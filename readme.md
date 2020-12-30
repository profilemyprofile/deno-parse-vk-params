# Usage

```typescript
import { parseVKParams } from "https://deno.land/x/parse_vk_params@1.0.0";

const params = parseVKParams('?any=any', env.VK_APP_SECRET_KEY);

if (params.isCorrect) {
    const userId = params.vk_user_id;
} else {
    // incorrect
}
```