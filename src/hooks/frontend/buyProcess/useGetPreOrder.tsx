'use client';

import { getPreOrder } from "@/services/getPreOrder";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const useGetPreOrder = (order_id: string) => {
    const [order, setOrder] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>();
    const {data:session} = useSession();

    const token = session?.user?.access_token || '';
    const fetchOrder =  () => {
        setLoading(true);
        getPreOrder(order_id, token).then((data) => {
            console.log(data);
            const dataRes =  data
            setOrder(data);
        }).catch((error) => {
            setError(error);
        }).finally(() => {
            setLoading(false);
        })
    };

    useEffect(()=>{
        if(order_id && token){
            fetchOrder();
        }
    },[order_id,token]);

    return { order, loading, getOrderError:error, fetchOrder };
}