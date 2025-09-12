import { ArrowLeft } from 'lucide-react';
import { BackButtonProps } from '@/types/checkout';

export default function BackButton({ onClick }: BackButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center text-gray-900 hover:text-gray-700 lato-font mb-6"
    >
      <ArrowLeft className="w-5 h-5 mr-3" />
      <span className="futura-font font-semibold text-2xl">Revisa tu renta</span>
    </button>
  );
}