import React, { useState } from 'react';
import {
   
    FaRegChartBar,
    FaCommentAlt,
    FaShoppingBag,
    FaThList,
    FaCar,
    FaCarAlt,
    FaCarSide

}from "react-icons/fa";

import { NavLink } from 'react-router-dom';


const Sidebar = ({children}) => {
    const[isOpen ,setIsOpen] = useState(false);
    const toggle = () => setIsOpen (!isOpen);
    const menuItem=[
        {
            path:"/",
            name:"Enter Vehicle Classification",
            icon:<FaCarSide/>
        },
        {
            path:"/ExitVehicleClassification",
            name:"Exit Vehicle Classification",
            icon:<FaCarAlt/>
        },
        {
            path:"/EnterVehicleCounting",
            name:"Enter Vehicle Counting",
            icon:<FaRegChartBar/>
        },
        {
            path:"/ExitVehicleCounting",
            name:"Exit Vehicle Counting",
            icon:<FaCommentAlt/>
        },
        {
            path:"/IncidentReport",
            name:"IncidentReport",
            icon:<FaShoppingBag/>
        },
        {
            path:"/productList",
            name:"Product List",
            icon:<FaThList/>
        }
    ]
    return (
        <div className="container">
           <div style={{width: isOpen ? "230px" : "50px"}} className="sidebar">
               <div className="top_section">


               <i style={{marginLeft: isOpen ? "160px" : "0px",color:"white"}}
               onClick={toggle}
               id="bars"
               className="pi pi-sign-in"
               >

               </i>

{/* <div  className="bars">
                       <FaBars onClick={toggle}/>
                     
            
              
               </div> */}
               </div>
               {
                   menuItem.map((item, index)=>(
                       <NavLink to={item.path} key={index} className="link" activeclassName="active">
                           <div className="icon">{item.icon}</div>
                           <div style={{display: isOpen ? "block" : "none"}} className="link_text">{item.name}</div>
                       </NavLink>
                   ))
               }
                
           </div>
           
           <main>{children}</main>


           
        </div>
    );
};

export default Sidebar;