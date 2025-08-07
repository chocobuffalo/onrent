import SocialIcon from "@/components/atoms/socialIcon/socialIcon";
import { FooterCol } from "@/components/molecule/footerCol/FooterCol";
import { contactLinks, interestLinks, legalLinks, socialLinks } from "@/constants/routes/frontend";
import Image from "next/image";

export default function Footer() {
    return(
        <footer className="bg-[#EAEAEA] text-[#939393] pt-[60px] pb-[60px] px-3.5">
            <div className="container mx-auto">
                <section className="top-footer grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-4">
                    <div className="col-span-1">
                        <div className="footer-logo">
                            <Image src="/footer-logo.svg" alt="OnRentX logo" width="143" height="27" />
                        </div>
                    </div>
                    <FooterCol title="CONTÁCTANOS" routes={contactLinks} />
                    <FooterCol title="AYUDA Y LEGAL" routes={legalLinks} />
                    <FooterCol title="ENLACES DE INTERÉS" routes={interestLinks} />
                </section>
                <section className="middle-footer border-t-[1px] border-[#939393] mt-5 pt-5">
                    <p className="copy-right text-center">
                        Copyright © {new Date().getFullYear()} OnRentX. Derechos Reservados.
                    </p>
                </section>
                <section className="lower-footer grid  gap-2.5 md:grid-cols-2 mt-5 pt-5">
                    <div className="col-span-1">
                        <p className="font-bold tex-left">
                            Descarga nuestra aplicación
                        </p>
                        <div className="flex justify-start gap-3.5 pt-2 items-center">
                            <Image src="/google-play.webp" alt="Google Play" width="135" height="40" />
                            <Image src="/apple-logo.webp" alt="Apple Store" width="135" height="40" />
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="col-span-1">
                        <p className="font-bold tex-left md:text-right">
                            Síguenos
                        </p>
                        <div className="flex justify-start md:justify-end gap-3.5 pt-2 items-center">
                           {
                            socialLinks.map(socialLink=><SocialIcon key={socialLink.id} socialLink={socialLink} />)
                           }
                        </div>
                    </div>
                    </div>

                </section>
            </div>
        </footer>
    )
}