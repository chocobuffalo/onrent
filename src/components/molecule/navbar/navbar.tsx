import { useState, useRef, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Style from './styles.module.css'
import HeaderLinks from '../../atoms/headerLinks/headerLinks';
import { headerLinks } from '@/constants/routes/frontend';

const Navbar = ({isTop}:{isTop:boolean}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
    
    <nav className="top-0 left-0">
      
        <div className="flex justify-between items-center h-16">
          {/* Logo */}

          {/* Desktop Menu */}
          <div className="hidden lg:block">
            <ul className={`flex items-center list-none ${Style.desktopmenu}`}>
            <HeaderLinks links={headerLinks} isTopColor={isTop} isMobile={false} />
            </ul>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex justify-center items-center p-2 text-gray-600 rounded-md hover:text-gray-900 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <Menu color="#ffffff" />
              
            </button>
          </div>
        </div>
     

      {/* Mobile Menu */}
    </nav>
       
       <div ref={menuRef} className={`lg:none ${Style.slice} ${isOpen?Style.sliceOpen:''} w-[250px] min-h-[100vh] fixed top-0 z-50 right-0 bottom-0`}>

       <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg min-h-[100vh]">
         <button onClick={toggleMenu} >
         <X />
         </button>
         <ul className='list-none mobile-menu'>
            <HeaderLinks links={headerLinks} isTopColor={false} isMobile={true} onLinkClick={() => setIsOpen(false)}/>
         </ul>
       </div>
     </div>
  
     
    </>
  );
};

export default Navbar;
