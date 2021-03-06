/**
 * The modifier keys currently active
 */
export interface ModifierInformation {
  /**
   * Whether the `Shift` key is active
   */
  shiftKey: boolean;

  /**
   * Whether the `Meta` key is active
   */
  metaKey: boolean;

  /**
   * Whether the `Control` key is active
   */
  ctrlKey: boolean;

  /**
   * Whether the `Alt` key is active
   */
  altKey: boolean;
}

/**
 * The supported keyboard events
 */
export type KeyboardEventName = 'keydown' | 'keyup' | 'keypress';

export interface OptionsParameter {
  /**
   * Additional options that can be passed into the generated keyboard event.
   */
  options: KeyboardEventInit;
}

export interface TextInputParameter<Type extends string = string>
  extends Partial<OptionsParameter>,
    Partial<IsTypingParameter> {
  /**
   * The text or character being passed into the generated event
   */
  text: Type;
}

export type TypingInputParameter = Omit<TextInputParameter, 'typing'>;

export interface IsTypingParameter {
  /** Indicates whether the text input is part of a typing sequence (i.e. into an editor)
   * This can change a few semantics.
   *
   * e.g. Pressing enter by default fires: `keydown` , `keyup` however when pressed in a text editor
   * it fires:  `keydown` , `keypress`, `keyup`
   */
  typing: boolean;
}

export interface OptionsWithTypingParameter extends OptionsParameter, Partial<IsTypingParameter> {}

export interface KeyboardConstructorParameter {
  /**
   * The target of our events
   */
  target: Element;

  /**
   * The default properties to extend all events with
   */
  defaultOptions?: KeyboardEventInit;

  /**
   * Whether to simulate a mac
   */
  isMac?: boolean;

  /**
   * Whether to wait until end is called before running all accumulated actions
   */
  batch?: boolean;

  /**
   * Whenever an event is dispatched this is run
   */
  onEventDispatch?: (event: KeyboardEvent) => void;
}
