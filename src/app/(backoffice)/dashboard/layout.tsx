import { cookies } from 'next/headers'
import { auth } from "@/auth"
import Sidebar from '@/components/organlism/sidebar/sidebar';
import TopDashboard from '@/components/organlism/TopDashboard/TopDashboard';
import '@/assets/scss/app.scss'
import '@/assets/css/backoffice.css'
import { redirect } from 'next/navigation';

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
        
        {children}
      </div>
      
       </>
    );
};
