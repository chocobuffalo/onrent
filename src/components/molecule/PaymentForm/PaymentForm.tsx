// components/molecules/PaymentForm/PaymentForm.tsx
import Image from 'next/image';
import Input from '@/components/atoms/Input/Input';
import { PaymentFormProps } from '@/types/checkout';

export default function PaymentForm({ register, errors }: PaymentFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-gray-900 text-lg font-semibold mb-4 lato-font">
          Métodos de pago
        </h4>
        
        <div>
          <Image
             src="/images/payment/payment-gateway.png"
            alt="Métodos de pago: Visa, Mastercard, American Express, PayPal"
            width={200}
            height={40}
            className="object-contain"
          />
        </div>
      </div>
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <h5 className="text-gray-700 text-[17px] font-semibold mb-6 lato-font">
          Pague de forma segura con su tarjeta de crédito
        </h5>    
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-base font-light text-gray-600 mb-2 lato-font">
              Número de tarjeta
            </label>
            <div className="relative">
              <Input
                label=""
                type="text"
                name="cardNumber"
                placeHolder=""
                required
                register={register}
                errors={errors}
                containerClass="w-full"
                inputClass="w-full pl-4 pr-12 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none lato-font text-sm"
                labelClass="hidden"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg 
                  className="w-6 h-6 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-light text-gray-600 mb-2 lato-font">
                Expiración (DD/MM/AA)
              </label>
              <Input
                label=""
                type="text"
                name="expiryDate"
                placeHolder=""
                required
                register={register}
                errors={errors}
                containerClass="w-full"
                inputClass="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none lato-font text-sm"
                labelClass="hidden"
              />
            </div>
            
            <div>
              <label className="block text-base font-light text-gray-600 mb-2 lato-font">
                Código de seguridad de la tarjeta
              </label>
              <Input
                label=""
                type="text"
                name="securityCode"
                placeHolder=""
                required
                register={register}
                errors={errors}
                containerClass="w-full"
                inputClass="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none lato-font text-sm"
                labelClass="hidden"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center gap-4">
        <button
          type="button"
          className="border border-gray-300 text-gray-600 font-medium py-2 px-4 rounded transition-colors duration-200 lato-font hover:bg-gray-50"
        >
          Pagar por transferencias bancarias
        </button>
        <button
          type="submit"
          className="border border-orange-500 text-orange-500 text-sm font-bold py-2 px-12 rounded transition-colors duration-200 lato-font hover:bg-orange-50"
        >
          Pagar
        </button>
      </div>
    </div>
  );
}