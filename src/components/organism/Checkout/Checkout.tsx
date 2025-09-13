'use client';

import { CheckoutWithLogicProps } from '@/types/checkout';
import BackButton from '@/components/atoms/BackButton/BackButton';
import ProjectInfoTable from '@/components/molecule/ProjectInfoTable/ProjectInfoTable';
import PaymentForm from '@/components/molecule/PaymentForm/PaymentForm';
import CheckoutSummary from '@/components/molecule/CheckoutSummary/CheckoutSummary';

export default function Checkout({
  machine,
  router,
  register,
  errors,
  handleSubmit,
  isSubmitting,
  handleBack,
  onSubmit,
}: CheckoutWithLogicProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <BackButton onClick={handleBack} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <ProjectInfoTable />
            <CheckoutSummary machine={machine} />
            <PaymentForm register={register} errors={errors} />
          </div>
        </form>
      </div>
    </div>
  );
}