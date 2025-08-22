interface NotesSectionProps {
  clientNotes: string;
  onNotesChange: (notes: string) => void;
}

export default function NotesSection({ clientNotes, onNotesChange }: NotesSectionProps) {
  return (
    <div className="py-5 border-b border-[#bbb]">
      <label htmlFor="clientNotes" className="block text-sm font-medium mb-2">
        Notas adicionales (opcional)
      </label>
      <textarea
        id="clientNotes"
        value={clientNotes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Añade cualquier información adicional sobre tu reserva..."
        className="w-full border rounded-lg p-3 text-sm resize-none"
        rows={3}
      />
    </div>
  );
}
