
import {useCheckout, PaymentElement} from '@stripe/react-stripe-js/checkout';

const StripeForm = ({getCheckSummary}:{getCheckSummary:{amount:number,currency:string,user_id:number | null,method:string}}) => {
    console.log('getCheckSummary in StripeForm:', getCheckSummary);

    const checkoutState = useCheckout();
    console.log(checkoutState)
    
  const handleSubmit = async (event:any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (checkoutState.type === 'loading') {
      return (
        <div>Loading...</div>
      );
    } else if (checkoutState.type === 'error') {
      return (
        <div>Error: {checkoutState.error.message}</div>
      );
    }

    // checkoutState.type === 'success'
    const {checkout} = checkoutState;
    const result = await checkout.confirm();

    if (result.type === 'error') {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };
  return (
    <form className='border flex flex-col items-center justify-center border-gray-300 rounded-lg p-6 bg-white' onSubmit={handleSubmit}>
      <PaymentElement />
      <button className='cursor-pointer hover:bg-transparent hover:text-secondary w-full max-w-[250px] mx-auto bg-secondary text-white py-2 rounded-lg border-1 border-secondary'>Submit</button>
    </form>
  );
};

export default StripeForm;