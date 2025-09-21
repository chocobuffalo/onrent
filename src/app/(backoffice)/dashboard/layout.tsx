// src/app/(backoffice)/dashboard/layout.tsx
"use client";

import { unstable_ViewTransition as ViewTransition } from 'react'
import { auth } from "@/auth"
import Sidebar from '@/components/organism/sidebar/sidebar';
import TopDashboard from '@/components/organism/TopDashboard/TopDashboard';
import '@/assets/scss/app.scss'
import '@/assets/css/backoffice.css'
import { redirect } from 'next/navigation';
import ModalForm from '@/components/organism/modalForm/modalForm';
import AutoLogoutProvider from '@/components/providers/AutoLogoutProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query'; // Asegúrate de que esta ruta sea correcta
import '../../globals.css'

export default function DashboardLayout({
    children,
}:{
    children: React.ReactNode;
}) {
    // La autenticación se maneja mejor en el middleware para los componentes de cliente.
    // Aquí puedes dejarlo si tu logic lo requiere, pero considera moverlo.
    // const session = await auth();
    // if (!session?.user) {
    // redirect('/')
    // }

    return (
        <QueryClientProvider client={queryClient}>
            <AutoLogoutProvider />
            <Sidebar/>
            <div id="wrapper-dashboard">
                <div id="pagee" className="clearfix">
                    <TopDashboard/>
                </div>
                <div id="themesflat-content"></div>
                <ViewTransition>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="content-area">
                                    <main id="main" className="main-content">
                                        <div className="tfcl-dashboard">
                                            {children}
                                        </div>
                                    </main>
                                </div>
                            </div>
                        </div>
                    </div>
                </ViewTransition>
                <ModalForm/>
            </div>
        </QueryClientProvider>
    );
};