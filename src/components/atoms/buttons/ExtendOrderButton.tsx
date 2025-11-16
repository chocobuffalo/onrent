// components/atoms/buttons/ExtendOrderButton.tsx
"use client";
export default function ExtendOrderButton({ onOpen }: { onOpen: ()=>void }) {
  return <button className="btn btn-sm" onClick={onOpen}>Extender renta</button>;
}
