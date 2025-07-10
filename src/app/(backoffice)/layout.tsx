
import { auth } from "@/auth"
import Sidebar from '@/components/organlism/sidebar/sidebar';
import TopDashboard from '@/components/organlism/TopDashboard/TopDashboard';
import '@/assets/scss/app.scss'
import '../../assets/css/backoffice.css'
import { authOptions } from "@/auth";
import { headers } from "next/headers";

export default  async function DashboardLayout({
    children,
}:{
    children: React.ReactNode;

}){
    const session = await auth();
    // console.log(session);
    // const headersList = headers();
    //  const userAgent = await headersList.get('user-agent')
    //  console.log(userAgent);
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
