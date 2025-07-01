import Footer from "@/components/organlism/footer/footer";
import Header from "@/components/organlism/header";

export default function FrontendLayout({
    children,
}:{
    children: React.ReactNode;

}){
    return (
       <>
       <Header/>
       {children}
       <Footer />
       </>
    );
};
