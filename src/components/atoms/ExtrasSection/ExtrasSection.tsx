interface ExtrasSectionProps {
  extras: {
    operador: boolean;
    certificado: boolean;
    combustible: boolean;
  };
}

interface ExtraItemProps {
  label: string;
  isIncluded: boolean;
  includedText?: string;
  notIncludedText?: string;
}

function ExtraItem({
  label,
  isIncluded,
  includedText = "✓ Incluido",
  notIncludedText = "No incluido"
}: ExtraItemProps) {
  return (
    <div className="flex justify-between">
      <span>{label}:</span>
      <span className={isIncluded ? "text-green-600" : "text-gray-500"}>
        {isIncluded ? includedText : notIncludedText}
      </span>
    </div>
  );
}

export default function ExtrasSection({ extras }: ExtrasSectionProps) {
  return (
    <div className="py-5 flex flex-col gap-2 w-full border-b border-[#bbb]">
      <p className="text-black font-medium">Extras incluidos:</p>
      <div className="space-y-1 text-sm">
        <ExtraItem
          label="Operador"
          isIncluded={extras.operador}
        />
        <ExtraItem
          label="Combustible"
          isIncluded={extras.combustible}
        />
        <ExtraItem
          label="Certificación OnRentX"
          isIncluded={extras.certificado}
          includedText="✓ Incluido"
          notIncludedText="Estándar"
        />
      </div>
    </div>
  );
}
