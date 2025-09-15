export const getPreOrder = async (order_id: string,token:string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/orders/preorder/${order_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = await res.json();
    return data;
}