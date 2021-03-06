# remirror

> One package to rule them all, one entry point to bind them.

[![Version][version]][npm] [![Weekly Downloads][downloads-badge]][npm]
[![Bundled size][size-badge]][size] [![Typed Codebase][typescript]](./src/index.ts)
![MIT License][license]

[version]: https://flat.badgen.net/npm/v/remirror
[npm]: https://npmjs.com/package/remirror
[license]: https://flat.badgen.net/badge/license/MIT/purple
[size]: https://bundlephobia.com/result?p=remirror
[size-badge]: https://flat.badgen.net/bundlephobia/minzip/remirror
[typescript]: https://flat.badgen.net/badge/icon/TypeScript?icon=typescript&label
[downloads-badge]: https://badgen.net/npm/dw/remirror/red?icon=npm

## Installation

```bash
# yarn
yarn add remirror @remirror/pm

# pnpm
pnpm add remirror @remirror/pm

# npm
npm install remirror @remirror/pm
```

## Usage

Rather than installing multiple scoped packages, the `remirror` package is a gateway to using all
the goodness that remirror provides while minimising your bundle size.

The following creates a dom based remirror editor.

```ts
import { SocialPreset } from 'remirror/preset/social';
import { RemirrorProvider, useRemirror, useCreateManager, useCreatePreset, usePreset } from 'remirror/react';

const EditorWrapper = () => {
  const socialPreset = useCreatePreset(SocialPreset, {})
  const manager = useCreateManager([socialPreset]);

  return (
    <RemirrorProvider manager={manager}>
      <Editor />
    </RemirrorProvider>
  )
}

const Editor = () => {
  const { getRootProps } = useRemirror();

  const usePreset(SocialPreset, ({addHandler}) => {
    const dispose = addHandler('mentionOnChange', () => {
      // Do something
    });
  });

  return <div {...getRootProps()}>
}
```

## Credits

This package was bootstrapped with [monots].

[monots]: https://github.com/monots/monots
