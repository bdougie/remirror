`@remirror/core-constants`

- Add error constants
- Rename `Tags` to `ExtensionTag`.

`@remirror/core`

- Remove `helpers` from extension
- Change extension to be a real class.
- Change styles to wrapper components
- All constructors are now private - create instance with the `.of` static helper.
- Extension no longer exposes multiple methods. Just the important lifecyle methods.
- Removed the number of exports
- Rely on `export type` syntax to support babel transpilation

- Rename `ObjectNode` to `RemirrorJSON` and `ObjectDocNode` to `RemirrorJSONDoc` or something along
  those lines

Quick thoughts

New extension api for adding behaviour to the editor.

- Can update the extension manager data
- Can add new methods and options to the extensions creator params via global types
- Can easily update an extension (using the extension constructor) - updateOptions (settings)
- Event methods for tapping into the extension manager lifecycle.

Helpers API should be added back, but this time each node and mark automatically has an `isActive`
helper.

Commands are chainable when called with the `.chain` helper.

Advice when creating extensions

Keep them light and simple especially when public. Extensions can do many things but it's better to
have many extensions that to do one thing. The functionality can later be combined in a preset.

### Presets

Presets are a new way of managing functionality in the editor. Combine extensions together with a
new config api.

`@remirror/react`

Creates and extension which modifies the manager and adds an initialization parameter that allows
for the portal container to be passed through.

The flow is like

- Factories (Factorys) -> Constructor -> Instance
- Factories create Constructors which make Instances.

Rules of extensions

Each extension can only be used once for the editor. This means that for a list of extension and
presets the extension manager will go through the extensions and make sure the highest priority
duplicates are the only ones that are left. It will then call all presets to their extension
instances to this new extension.

- [ ] Still to do: define `reactNodeViews` option in the `react` code-base and test nodeViews in a
      non trivial example `footnotes`. Built in react extension which adds a new parameter to the
      extensionManager init params `portalContainer` which is then used in `reactNodeViews`.

Rename `ExtensionManager` to just `Manager` since it now also manages presets.

All extensions require a version string.

So many changes. And one I want to add

**TODO** - use the `ExtensionType` enum as a way of separating the plain, node and mark types.

```ts
interface A {
  [ExtensionType.Mark]: MarkType;
  [ExtensionType.Plain]: never;
  [ExtensionType.Node]: NodeType;
}

type B = A[ExtensionType.Plain];
```

The above solution let to a lot of problems. It seems it's just better to use the current settings.

Meta field in package.json of field

Extension metatadata

- Build extension for skeletons which everyone can just fork from.
- Testing, init command, yo generator (typescript support)

Writes out all the basic metadata after asking questions to the user. The metadata is there which
the playground can rely on. Define

Remirror metadata field.

Presets

useEnvPreset({chrome: 73}) // useBrowseSupport({chrome: 73})

useBrowseSupport({chrome: 72})

declare module "@remirror/core" { interface ModuleConfig { MyModule: MyModuleConfig } }

useConfigureExtension(extension, init)

useConfigureExtension(BoldExtension, {weight:'900'}) useConfigureExtension(MyModule, config)
useConfigureExtension(OtherExtension, config)

declare module "@remirror/react" { useBrowserSupport(mod: MyModule, confg: MyModuleConf) => void; }

https://github.com/graphile/worker/issues/57

> > > THIS ONE useExtensionSpec(extension, spec) <<<

> > > THIS ONE useExtensionConfig(extension, config) <<<

useExtensionEvent(EmbedExtension, 'load', () => { console.log('Hey!') })

useButtonPressCount() ... useExtensionState(ButtonExtension, 'pressCount')

BEHAVIOURS:

- UNIQUE - require that it's only set once, if set more than once fail
- PRIORITY - use value with highest priority
- ALL - collect all together (e.g. 'load' callback)

```ts
const { commands, helpers } = useRemirror();
```

### Switch back to classes

So much of this document has changed since last updated.

The project has moved back to using classes. They're just much better for type inference than
factory objects in typescript.

- With a class I can infer the type of all the fields without needing to capture the type in a
  generic. The initial factory pattern had reached 6 generics at a certain point all which need to
  be captured to create good inference.
- Classes are types and can be used without the `typeof` indicator.
- Classes are inherently stateful which allows creators of extensions and presets to manage the
  lifecycle and state directly on the class. With the factory pattern I was just about to create a
  new state field where extensions could store state. This would have required another generic type
  parameter.
- With the object parameter everything has to be passed into each method, since there's no access to
  `this`. Classes allow me to create a store object on the extension which has commonly used items
  like the `view` `prevState` `schema`.

There are a few pitfalls to the new solution.

- `defaultOptions` and `defaultProperties` were really nice with the factory pattern. The extension
  factory could infer whether you needed to add defaults based on the shape of the `Settings` /
  `Properties`. With the new class syntax this isn't possible. Now the extension requires a static
  property on the Extension class. The value should be the right shape. However this means a lot of
  mistakes can be made by extension creators. I will create an eslint plugin at
  `eslint-plugin-remirror` which produces an error when the wrong default settings / default
  properties are set. It also creates auto fixable suggestions which add the expected type etc...
