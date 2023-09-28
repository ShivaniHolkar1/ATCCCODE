






import React, { useState} from "react";

import "./navbar.css";
import Anemoi from "../Assets/Anemoi.png";




const Navbar = () => {
  const [Mobile, setMobile] = useState(false);

  






  

 







  return (
    <>
    
      <nav className="navbar">
       
          

          <img
        style={{ height: "35px",borderRadius:"50%" ,marginLeft:"1%"}}
        src={Anemoi}
        alt=" Anemoi "
      />
          
      <div style={{color:"white",fontSize:"20px",marginTop:"3px"}}><b>Automatic Traffic Control Center</b></div>


        <ul
          className={Mobile ? "nav-links-mobile" : "nav-links"}
          onClick={() => setMobile(false)}
        
        >


                  
     
      
  
{/* 
           <Button
            style={{
              
              background: "#203570",
              height: "35px",
              width: "35px",
         
              
              
            }}
            aria-label="User"
            icon="pi pi-user"
            onClick={(e) => op.current.toggle(e)}
            aria-haspopup
            aria-controls="overlay_panel"
            className="p-button-rounded p-button-info"
          /> */}

             
          {/* <OverlayPanel ref={op}>
      
         <h4>{loginUser}({loginrole}) </h4> 
          <br/>
       

            <Button
              label="Logout"
              icon="pi pi-sign-out"
              onClick={Logout}
              style={{ color: "black ", padding: "0%", margin: "0%" }}
              className=" p-button-text p-button-plain"
            />
          </OverlayPanel> */}
        
        </ul>
       
      </nav>
    </>
  );
};
export default Navbar;







