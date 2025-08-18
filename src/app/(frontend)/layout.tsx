import Footer from "@/components/organism/footer/footer";
import Header from "@/components/organism/header";
import '../../assets/css/frontend.css'
import TrackingPixels from '../../components/molecule/tracking/TrackingPixels';




export default function FrontendLayout({
    children,
}:{
    children: React.ReactNode;

}){
    return (
       <>
       <Header/>
       <main className="">
         <TrackingPixels />
        {children}
       </main>
       <Footer />
       </>
    );
};
