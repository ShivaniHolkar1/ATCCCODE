import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const YourComponent = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  
  const [data, setData] = useState([]);
  const [exitvehicle, setexitvehicle] = useState([]);
  const [entercounting,setEnterCounting] = useState([]);
  const [exitcounting,setExitCounting] = useState([]);


  const [startDate, setStartDate] = useState('');

  const [endDate, setEndDate] = useState('');

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [tableName, setTableName] = useState('');
  const [pdfData, setPdfData] = useState(null);

 

  const handleDownloadClick = async () => {





    try {

      const response = await fetch(`${process.env.REACT_APP_API_KEY}/downloadData`);
    if (response.ok) {
     const blob = await response.blob();
     const url = window.URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = 'exit_counting_data.pdf';
     document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

      } else {
        console.error('Failed to download PDF');

      }

    } catch (error) {
        console.error(error);

    }
  }


  // setTableName("EnterVehicleClass")
  
  const handleDownload = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_KEY}/downloadData?startDate=${startDate}&endDate=${endDate}&startTime=${startTime}&endTime=${endTime}&tableName=${"EnterCounting "}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setPdfData(url);
      } else {
        console.error('Error downloading PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  


  // const handleDownloadCSV = async () => {
  //   try {
  //     const response = await fetch(`${process.env.REACT_APP_API_KEY}/downloadExitCounting?startDate=${startDate}&endDate=${endDate}`, {
  //       headers: {
  //         'Content-Type': 'text/csv' // Set the appropriate Content-Type header for CSV
  //       }
  //     });
  
  //     if (response.ok) {
  //       const blob = await response.blob();
  //       const url = window.URL.createObjectURL(blob);
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = 'exit_counting_data.csv'; // Change the file extension to .csv
  //       document.body.appendChild(a);
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //       document.body.removeChild(a);
  //     } else {
  //       console.error('Failed to download CSV');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  

  const handleDropdownChange = (event) => {
    setSelectedValue(event.value);
   
    fetchData(event.value);
  };


  
 
  const fetchData = (api) => {
    // Use a switch statement to handle multiple APIs
    switch (api) {
      case "api1":
        // Call API 1 and set data

        axios
          .get(
            `${process.env.REACT_APP_API_KEY}/entervehicleclassForCurrentHour`
          )
          .then((res) => {
            setData(res.data.reverse());
          });
        break;
      case "api2":
        // Call API 2 and set data
        axios
          .get(
            `${process.env.REACT_APP_API_KEY}/exitvehicleclassForCurrentHour`
          )
          .then((res) => {
            setexitvehicle(res.data.reverse());
            // setLoading(false);
          });
        break;

      case "api3":
        axios
          .get(`${process.env.REACT_APP_API_KEY}/entercounting`)
          .then((res) => {
            setEnterCounting(res.data.reverse());
          });
        break;
      case "api4":
        axios
          .get(`${process.env.REACT_APP_API_KEY}/exitcounting`)
          .then((res) => {
            setExitCounting(res.data.reverse());
            // setLoading(false);
          });
        break;
      
      default:
        setData([]); 
    }
  };


 

 


  return (
    <div>
      <div >

{/* <label>Start Date:</label>

<InputText

  type="text"
  style={{height:"30px",borderRadius:"2px"}}
  value={startDate}

  onChange={(e) => setStartDate(e.target.value)}

/>

<label>End Date:</label>

<InputText


  type="text"
  style={{height:"30px",borderRadius:"2px"}}

  value={endDate}

  onChange={(e) => setEndDate(e.target.value)}

/> */}




<div>

<Dropdown
      style={{float:"right"}}
        value={selectedValue}
        options={[
          { label: "Enter Vehicle Classification", value: "api1" },
          { label: "Exit Vehicle Classification", value: "api2" },
          { label: "Enter Vehicle Counting", value: "api3" },
          { label: "Exit Vehicle Counting", value: "api4" },
          // {label: 'Exit Vehicle Counting', value: 'api5'},
        ]}
        onChange={handleDropdownChange}
        placeholder="Wrongway_Detection"
      />


<form>

<div class="grid">
    <div class="col-12 md:col-6 lg:col-3">
      
<label>Start Date:</label>
<input type="text" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
    </div>
    <div class="col-12 md:col-6 lg:col-3">
    <label>End Date:</label>
<input type="text" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
    </div>
    <div class="col-12 md:col-6 lg:col-3">
    <label>Start Time:</label>
<input type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)} />

    </div>
    <div class="col-12 md:col-6 lg:col-3">
    <label>End Time:</label>
<input type="text" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
 </div>

 
</div>
&nbsp;<Button type="button" className="p-button-sm"  style={{
            backgroundColor: "orange",
            width: "4%",
            color:"black",
            height: "30px",
            borderRadius: "2px",
          }} onClick={handleDownload}> PDF</Button>






</form>
      {pdfData && <embed src={pdfData} type="application/pdf" width="100%" height="500px" />}
</div>

{/* <Button className="p-button-sm"   style={{
           backgroundColor: "orange",
              height: "30px",
              width: "30px",
              color: "black",
              marginLeft:"4px",
              borderRadius:"2px"
            }} 
            icon="pi pi-file-pdf"
            onClick={handleDownloadClick}> </Button> */}


   
</div>
<br/>
<br/>
      <div className="datatable-container">
        {selectedValue === "api1" && (
          <DataTable value={data}
          rows={18}
          size="small"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          paginator responsiveLayout="scroll">
            <Column field="vehicletype" header="vehicletype"></Column>
            <Column field="date" header="Date"></Column>
            <Column field="cameratype" header="cameratype"></Column>
            <Column field="location" header="location"></Column>
            <Column field="averageSpeed" header="averageSpeed"></Column>
            <Column field="count" header="count"></Column>
          </DataTable>
        )}
        {selectedValue === "api2" && (
          <DataTable value={exitvehicle}
          rows={18}
          size="small"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          paginator responsiveLayout="scroll">
            <Column field="vehicletype" header="vehicletype"></Column>
            <Column field="date" header="Date"></Column>
            <Column field="cameratype" header="cameratype"></Column>
            <Column field="location" header="location"></Column>
            <Column field="averageSpeed" header="averageSpeed"></Column>
            <Column field="count" header="count"></Column>
          </DataTable>
        )}
        {selectedValue === "api3" && (
          <DataTable value={entercounting} 
          rows={18}
          size="small"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          paginator
          responsiveLayout="scroll">
            <Column field="vehicletype" header="vehicletype"></Column>
            <Column field="speed" header="Speed"></Column>
            <Column field="cameratype" header="cameratype"></Column>
            <Column field="date" header="Date"></Column>
            <Column field="time" header="Time"></Column>
            <Column field="location" header="Location"></Column>
          </DataTable>
        )}

        {selectedValue === "api4" && (
          <DataTable value={exitcounting} 
          rows={18}
          size="small"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          paginator
          responsiveLayout="scroll">
          <Column field="vehicletype" header="vehicletype"></Column>
            <Column field="speed" header="Speed"></Column>
            <Column field="cameratype" header="cameratype"></Column>
            <Column field="date" header="Date"></Column>
            <Column field="time" header="Time"></Column>
            <Column field="location" header="Location"></Column>
          </DataTable>
        )}
      </div>
    </div>
  );
};

export default YourComponent;
