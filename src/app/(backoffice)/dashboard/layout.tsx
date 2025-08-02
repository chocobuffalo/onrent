import { unstable_ViewTransition as ViewTransition } from 'react'
import { auth } from "@/auth"
import Sidebar from '@/components/organlism/sidebar/sidebar';
import TopDashboard from '@/components/organlism/TopDashboard/TopDashboard';
import '@/assets/scss/app.scss'
import '@/assets/css/backoffice.css'
import { redirect } from 'next/navigation';
import ModalForm from '@/components/organlism/modalForm/modalForm';

export default  async function DashboardLayout({
    children,
}:{
    children: React.ReactNode;

}){
    const session = await auth();
    if (!session?.user) {
    // Redirige a login si no está autenticado
    redirect('/')
     }
    return (
       <>
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
      
       </>
    );
};
