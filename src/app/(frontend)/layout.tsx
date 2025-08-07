import Footer from "@/components/organism/footer/footer";
import Header from "@/components/organism/header";
import '../../assets/css/frontend.css'




export default function FrontendLayout({
    children,
}:{
    children: React.ReactNode;

}){
    return (
       <>
       <Header/>
       <main className="">
        {children}
       </main>
       <Footer />
       </>
    );
};
