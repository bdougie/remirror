import React, { FunctionComponent, MouseEventHandler, useState } from 'react';

import { storiesOf } from '@storybook/react';
import { isEqual, memoize } from 'lodash';
import { Remirror, RemirrorEventListener, RenderTree } from '../';
import { Mention } from '../config/nodes';

const EditorLayout: FunctionComponent = () => {
  const [json, setJson] = useState(JSON.stringify(initialJson, null, 2));

  const onChange: RemirrorEventListener = ({ getDocJSON, view, state }) => {
    const newJson = JSON.stringify(getDocJSON(), null, 2);
    console.log(
      'onChange has been called',
      isEqual(json, newJson),
      isEqual(view.state.doc.toJSON(), getDocJSON()),
    );
    setJson(newJson);
  };

  const runAction = memoize(
    (method: () => void): MouseEventHandler<HTMLElement> => e => {
      e.preventDefault();
      method();
    },
  );

  return (
    <div
      style={{
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto 1fr',
        gridTemplateAreas: '"editor" "json"',
      }}
    >
      <style>
        {`
      .ProseMirror {
        padding: 10px;
        background: #fffeee;
        min-height: 200px;
      }

      .ProseMirror:focus {
        outline: none;
      }`}
      </style>
      <div style={{ gridArea: 'editor' }}>
        <Remirror
          onChange={onChange}
          placeholder='This is a placeholder'
          autoFocus={true}
          initialContent={initialJson}
          extensions={[
            new Mention({
              onKeyDown: arg => {
                console.log('Mention is being called', arg);
                return false;
              },
            }),
          ]}
        >
          {({ getMenuProps, actions }) => {
            const menuProps = getMenuProps({
              name: 'floating-menu',
            });
            return (
              <div>
                <div
                  style={{
                    position: 'absolute',
                    top: menuProps.position.top,
                    left: menuProps.position.left,
                  }}
                  ref={menuProps.ref}
                >
                  <button
                    style={{
                      backgroundColor: actions.bold.isActive() ? 'white' : 'pink',
                      fontWeight: actions.bold.isActive() ? 600 : 300,
                    }}
                    disabled={!actions.bold.isEnabled()}
                    onClick={runAction(actions.bold.run)}
                  >
                    B
                  </button>
                  <button
                    style={{
                      backgroundColor: actions.paragraph.isActive() ? 'white' : 'pink',
                      fontWeight: actions.paragraph.isActive() ? 600 : 300,
                    }}
                    disabled={!actions.paragraph.isEnabled()}
                    onClick={runAction(actions.paragraph.run)}
                  >
                    #
                  </button>
                </div>
              </div>
            );
          }}
        </Remirror>
      </div>
      <div>
        <pre
          style={{
            width: '100%',
            height: '50%',
            overflowY: 'auto',
            padding: '1em',
            background: 'black',
            color: 'lawngreen',
          }}
        >
          {json}
        </pre>
      </div>
    </div>
  );
};

storiesOf('Editor', module)
  .add('Basic', () => <EditorLayout />)
  .add('With Provider', () => <EditorLayout />)
  .add('Rendered', () => <RenderTree json={initialJson} />);

// const initialJson = {
//   type: 'doc',
//   content: [
//     {
//       type: 'paragraph',
//       content: [],
//     },
//   ],
// };

const initialJson = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This a lot of text that can later be deleted.',
        },
      ],
    },
    {
      type: 'paragraph',
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'However for now it is important. ',
        },
      ],
    },
  ],
};