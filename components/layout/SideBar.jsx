'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link'
import { usePathname } from "next/navigation";
import { 
  ClipboardClock,
  Receipt,
  ClipboardList,
  ChevronDown,
  Dot,
  House,
  UserRound,
  HeartPulse
} from 'lucide-react';
import { themeColors } from '@/theme';

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const [openNestedMenus, setOpenNestedMenus] = useState({});
  const location = usePathname();

  const toggleMenu = (menuName) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const toggleNestedMenu = (menuName, subMenuName) => {
    setOpenNestedMenus(prev => ({
      ...prev,
      [`${menuName}-${subMenuName}`]: !prev[`${menuName}-${subMenuName}`]
    }));
  };

  const isActiveLink = (path) => {
    return location === path || location.startsWith(path + '/');
  };

  const isMenuActive = (item) => {
    if (item.type === 'link') {
      return isActiveLink(item.path);
    }
    if (item.type === 'menu' && item.subItems) {
      return item.subItems.some(subItem => {
        if (subItem.type === 'nested') {
          return subItem.nestedItems?.some(nestedItem => isActiveLink(nestedItem.path));
        }
        return isActiveLink(subItem.path);
      });
    }
    return false;
  };

  useEffect(() => {
    const newOpenMenus = {};
    const newOpenNestedMenus = {};
    
    menuItems.forEach(item => {
      if (item.type === 'menu' && item.subItems) {
        // Check if any sub-item is active
        const hasActiveSubItem = item.subItems.some(subItem => {
          if (subItem.type === 'nested') {
            const hasActiveNested = subItem.nestedItems?.some(nestedItem => 
              isActiveLink(nestedItem.path)
            );
            if (hasActiveNested) {
              newOpenNestedMenus[`${item.name}-${subItem.name}`] = true;
            }
            return hasActiveNested;
          }
          return isActiveLink(subItem.path);
        });
        
        if (hasActiveSubItem) {
          newOpenMenus[item.name] = true;
        }
      }
    });
    
    setOpenMenus(prev => ({ ...prev, ...newOpenMenus }));
    setOpenNestedMenus(prev => ({ ...prev, ...newOpenNestedMenus }));
  }, [location]);

  const menuItems = [
    {
      name: 'Patient Dashboard',
      icon: House,
      path: '/patient-dashboard',
      type: 'link'
    },
    {
      name: 'Appointments',
      icon: UserRound,
      path: '/appointments/create',
      type: 'link'
    },
    {
      name: 'Patients',
      icon: ClipboardList,
      type: 'link',
      path: '/appointments/create',
      // type: 'menu',
      // subItems: [
      //   { name: 'List', path: '/patients' },
      //   { name: 'Add New', path: '/patients/add-patients' }
      // ]
    },
    {
      name: 'Super Bill',
      icon: Receipt,
      type: 'link',
      path: '/appointments/create',
      // type: 'menu',
      // subItems: [
      //   { name: 'List', path: '/super-bill' },
      //   { name: 'Add New', path: '/patients?from=super-bill' }
      // ]
    },
    {
      name: 'Claim',
      icon: ClipboardClock,
      type: 'link',
      path: '/appointments/create',
      // type: 'menu',
      // subItems: [
      //   { name: 'Claim List', path: '/claim' },
      //   { name: 'Add Claim', path: '/patients?from=claim-list' }
      // ]
    },
    {
      name: 'Accounts',
      icon: HeartPulse,
      path: '/account/patients',
      type: 'link'
    }
  ];

  return (
    <>
      <div 
        style={{ backgroundColor: themeColors.custom.sidebarBg }}
        className={`fixed left-0 overflow-y-auto overflow-x-hidden top-0 h-full text-white z-40
          transition-all duration-500 ease-in-out
          ${isHovered ? 'w-72' : 'w-20'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        <nav className="mt-15">
          <div className="space-y-1 px-5">
            {menuItems.map((item, index) => (
              <div key={item.name || `subheading-${index}`}>
                {item.type === 'subheading' ? (
                  <div className={`px-3 py-2 transition-all duration-500 ease-in-out ${(isHovered) ? 'opacity-100' : 'opacity-0 h-0 py-0 overflow-hidden'}`}>
                    <h6 className="text-sm font-semibold uppercase tracking-wider text-gray-400 transition-all duration-500">
                      {(isHovered) ? item.name : ''}
                    </h6>
                  </div>
                ) : item.type === 'link' ? (
                  <Link
                    href={item.path}
                     style={{ backgroundColor: isActiveLink(item.path) ? themeColors.custom.headerBlue : "" }}
                    className={`
                      flex items-center py-3 px-2 rounded-lg 
                      transition-all duration-300 ease-in-out
                      group
                    `}
                  >
                    <item.icon 
                      style={{ color: isMenuActive(item) ? themeColors.white : themeColors.black}} 
                      className="w-5 h-5 font-bold flex-shrink-0 transition-all duration-300" 
                    />
                    <span 
                      style={{ color: themeColors.white}} 
                      className={`
                        ml-3 font-bold whitespace-nowrap 
                        transition-all duration-500 ease-in-out
                        ${(isHovered) ? 'opacity-100 w-auto' : 'opacity-0 w-0'}
                      `}
                    >
                      {item.name}
                    </span>
                  </Link>
                ) : (
                  <div className="transition-all duration-300">
                    <button
                      onClick={() => toggleMenu(item.name)}
                      style={{ backgroundColor: isMenuActive(item) ? themeColors.custom.menuActive : "", cursor: "pointer" }}
                      className={`
                        flex items-center justify-between w-full py-3 px-2 rounded-lg 
                        transition-all duration-300 ease-in-out
                        group
                        
                        ${openMenus[item.name] ? 'bg-opacity-90' : 'bg-opacity-0'}
                      `}
                    >
                      <div className="flex items-center transition-all duration-300">
                        <item.icon 
                          style={{ color: themeColors.white}} 
                          className="w-5 h-5 font-bold flex-shrink-0 transition-all duration-300" 
                        />
                        <span 
                          style={{ color: themeColors.white }} 
                          className={`
                            ml-3 whitespace-nowrap font-bold 
                            transition-all duration-500 ease-in-out
                            ${(isHovered) ? 'opacity-100 w-auto' : 'opacity-0 w-0'}
                          `}
                        >
                          {item.name}
                        </span>
                      </div>
                      {(isHovered) && (
                        <ChevronDown 
                          className={`
                            w-4 h-4 
                            transition-all duration-500 ease-in-out
                            ${openMenus[item.name] ? 'rotate-180 transform' : ''}
                          `}
                        />
                      )}
                    </button>
                    
                    {/* Submenu with smooth animation */}
                    <div className={`
                      transition-all duration-500 ease-in-out
                      overflow-hidden
                      ${openMenus[item.name] && (isHovered) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                    `}>
                      <div className="ml-4 mt-1 space-y-1 border-l border-gray-600 transition-all duration-500">
                        {item.subItems.map((subItem) => (
                          <div key={subItem.name} className="transition-all duration-300">
                            {subItem.type === 'nested' ? (
                              <div>
                                <button
                                  onClick={() => toggleNestedMenu(item.name, subItem.name)}
                                  className={`
                                    flex items-center justify-between w-full py-2 px-3 rounded-lg 
                                    transition-all duration-300 ease-in-out
                                    group text-sm
                                    ${subItem.nestedItems?.some(nestedItem => isActiveLink(nestedItem.path))
                                      ? 'bg-blue-600 text-white'
                                      : 'text-gray-300 hover:bg-gray-700'
                                    }
                                  `}
                                  style={{ cursor: "pointer" }}
                                >
                                  <div className="flex items-center transition-all duration-300">
                                    <Dot className="transition-all duration-300 w-4 h-4" />
                                    <span className="whitespace-nowrap ml-2">
                                      {subItem.name}
                                    </span>
                                  </div>
                                  <ChevronDown 
                                    className={`
                                      w-3 h-3 
                                      transition-all duration-500 ease-in-out
                                      ${openNestedMenus[`${item.name}-${subItem.name}`] ? 'rotate-180 transform' : ''}
                                    `}
                                  />
                                </button>
                                
                                {/* Nested Submenu with smooth animation */}
                                <div className={`
                                  transition-all duration-500 ease-in-out
                                  overflow-hidden
                                  ${openNestedMenus[`${item.name}-${subItem.name}`] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                                `}>
                                  <div className="ml-4 mt-1 space-y-1 border-l border-gray-500 transition-all duration-500">
                                    {subItem.nestedItems.map((nestedItem) => (
                                      <Link
                                        key={nestedItem.name}
                                        href={nestedItem.path}
                                        style={{ backgroundColor: isActiveLink(nestedItem.path) ? themeColors.custom.menuActive : "" }}
                                        className={`
                                          flex items-center py-2 px-3 rounded-lg 
                                          transition-all duration-300 ease-in-out
                                          group text-sm text-white
                                        `}
                                      >
                                        <Dot className="transition-all duration-300 w-4 h-4" />
                                        <span className="whitespace-nowrap ml-2">
                                          {nestedItem.name}
                                        </span>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <Link
                                href={subItem.path}
                                style={{ backgroundColor: isActiveLink(subItem.path) ? themeColors.custom.menuActive : "" }}
                                className={`
                                  flex items-center py-2 px-3 rounded-lg 
                                  transition-all duration-300 ease-in-out
                                  group text-sm text-white
                                `}
                              >
                                <Dot className="transition-all duration-300 w-4 h-4" />
                                <span className="whitespace-nowrap ml-2">
                                  {subItem.name}
                                </span>
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      </div>

      {/* Invisible hover area to make it easier to trigger sidebar */}
      <div 
        className="fixed left-0 top-0 h-full w-2 z-30 hover:w-4 transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
      />
    </>
  );
};

export default Sidebar;