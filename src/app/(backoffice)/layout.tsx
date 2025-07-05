
import '@/assets/scss/app.scss'
import Sidebar from '@/components/organlism/sidebar/sidebar';
import TopDashboard from '@/components/organlism/TopDashboard/TopDashboard';
import '../../assets/css/backoffice.css'

export default function DashboardLayout({
    children,
}:{
    children: React.ReactNode;

}){
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
