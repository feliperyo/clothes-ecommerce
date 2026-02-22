import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { useEffect } from 'react';

const ToolbarButton = ({ onClick, active, title, children }) => (
  <button
    type="button"
    onMouseDown={e => { e.preventDefault(); onClick(); }}
    title={title}
    className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
      active
        ? 'bg-primary text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`}
  >
    {children}
  </button>
);

const RichTextEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sincronizar quando o value externo muda (ex: ao abrir modal com produto existente)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  if (!editor) return null;

  const isInTable = editor.isActive('table');

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/20">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 px-2 py-1.5 border-b border-gray-200 bg-gray-50">
        {/* Texto */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Negrito">
          <strong>N</strong>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Itálico">
          <em>I</em>
        </ToolbarButton>

        <div className="w-px bg-gray-300 mx-0.5" />

        {/* Cabeçalhos */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Título 1">
          H1
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Título 2">
          H2
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Título 3">
          H3
        </ToolbarButton>

        <div className="w-px bg-gray-300 mx-0.5" />

        {/* Listas */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Lista com marcadores">
          • Lista
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Lista numerada">
          1. Lista
        </ToolbarButton>

        <div className="w-px bg-gray-300 mx-0.5" />

        {/* Tabela */}
        <ToolbarButton
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          active={false}
          title="Inserir tabela"
        >
          + Tabela
        </ToolbarButton>

        {isInTable && (
          <>
            <ToolbarButton onClick={() => editor.chain().focus().addColumnAfter().run()} active={false} title="Adicionar coluna">
              +Col
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().addRowAfter().run()} active={false} title="Adicionar linha">
              +Lin
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().deleteTable().run()} active={false} title="Remover tabela">
              ×Tab
            </ToolbarButton>
          </>
        )}

        <div className="w-px bg-gray-300 mx-0.5" />

        {/* Limpar formatação */}
        <ToolbarButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} active={false} title="Limpar formatação">
          Limpar
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="rich-editor min-h-[120px] px-4 py-3 focus:outline-none"
      />
    </div>
  );
};

export default RichTextEditor;
