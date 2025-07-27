import Footer from "@/components/organlism/footer/footer";
import Header from "@/components/organlism/header";
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
