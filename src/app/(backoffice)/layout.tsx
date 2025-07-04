
import '@/assets/scss/app.scss'
import Sidebar from '@/components/organlism/sidebar/sidebar';
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
            
            </div>
            <div id="themesflat-content"></div>
            <div className="dashboard-toggle">Show DashBoard</div>
        
        {children}
      </div>
      
       </>
    );
};
