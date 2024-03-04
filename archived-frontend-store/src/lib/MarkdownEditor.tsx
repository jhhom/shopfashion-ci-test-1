import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  BlockTypeSelect,
  CodeToggle,
  CreateLink,
  InsertCodeBlock,
  ListsToggle,
  InsertThematicBreak,
  UndoRedo,
  BoldItalicUnderlineToggles,
  MDXEditorMethods,
  MDXEditorProps,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

export function MarkdownEditor({
  onBlur,
  onChange,
  mRef,
  value = "",
}: {
  onBlur?: MDXEditorProps["onBlur"];
  onChange?: MDXEditorProps["onChange"];
  value?: MDXEditorProps["markdown"];
  mRef?: React.Ref<MDXEditorMethods>;
}) {
  return (
    <MDXEditor
      ref={mRef}
      onChange={onChange}
      onBlur={onBlur}
      markdown={value}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <div className="flex flex-wrap">
              {" "}
              <BlockTypeSelect />
              <CodeToggle />
              <CreateLink />
              <InsertCodeBlock />
              <ListsToggle />
              <InsertThematicBreak />
              <UndoRedo />
              <BoldItalicUnderlineToggles />
            </div>
          ),
        }),
      ]}
    />
  );
}
