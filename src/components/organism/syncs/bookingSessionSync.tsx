// src/components/organism/syncs/bookingSessionSync.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useUIAppDispatch, useUIAppSelector } from '@/libs/redux/hooks';
import { initBookingSession, addItemToBooking } from '@/libs/redux/features/booking/bookingSessionSlice';

export default function BookingSessionSync() {
    const dispatch = useUIAppDispatch();
    const hasLoadedRef = useRef(false);
    const currentItems = useUIAppSelector(state => state.bookingSession.items);

    useEffect(() => {
    if (!hasLoadedRef.current && currentItems.length === 0) {
        if (typeof window !== 'undefined') {
        const sessionData = localStorage.getItem('booking_session');
        const itemsData = localStorage.getItem('booking_items');

        if (sessionData) {
            try {
            const session = JSON.parse(sessionData);
            dispatch(initBookingSession(session));
            } catch (error) {
            console.error('Error loading booking session:', error);
            }
        }

        if (itemsData) {
            try {
            const items = JSON.parse(itemsData);
            items.forEach((item: any) => dispatch(addItemToBooking(item)));
            } catch (error) {
            console.error('Error loading booking items:', error);
            }
        }
        }
        hasLoadedRef.current = true;
    }
    }, []);

    return null;
}