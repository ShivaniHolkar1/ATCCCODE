




import React, { useState, useEffect } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";

import { Button } from "primereact/button";

import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

import { Tooltip } from 'primereact/tooltip';

const Product = () => {
//   const [selectedCustomers, setSelectedCustomers] = useState(null);
  // const navigate = useNavigate();
  const [posts, setPosts] = useState();
  const [loading, setLoading] = useState(true);





  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    vehicletype: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    cameratype: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    speed: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    location: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },

    representative: { value: null, matchMode: FilterMatchMode.IN },
    time: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    balance: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

//   const customerService = new CustomerService();

const [startDate, setStartDate] = useState('');

const [endDate, setEndDate] = useState('');



const handleDownloadClick = async () => {

  try {

    const response = await fetch(`${process.env.REACT_APP_API_KEY}/downloadExitCounting?startDate=${startDate}&endDate=${endDate}`);

   

    if (response.ok) {

      // Convert the response to a blob

      const blob = await response.blob();

     

      // Create a URL for the blob

      const url = window.URL.createObjectURL(blob);

     

      // Create a link element to trigger the download

      const a = document.createElement('a');

      a.href = url;

      a.download = 'exit_counting_data.pdf';

      document.body.appendChild(a);

      a.click();

     

      // Clean up the URL and link element

      window.URL.revokeObjectURL(url);

      document.body.removeChild(a);

    } else {

      // Handle the error here

      console.error('Failed to download PDF');

    }

  } catch (error) {

    console.error(error);

  }
}








  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_KEY}/entercounting`)
      .then((res) => {
        setPosts(res.data.reverse());
        setLoading(false);


      });
  }, []);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between align-items-center">
        <div>Enter Vehicle Counting</div>
        <div>

          <span className="p-input-icon-right">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Search"
              className="p-inputtext-sm"
            />
          </span>
        </div>

       
      </div>
    );
  };




  const countryBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <div>
          <Tooltip style={{ width: "30%" }} target={`.custom-tooltip-btn-${rowData.id}`}>
            {rowData.description}
          </Tooltip>
          <div className={`custom-tooltip-btn-${rowData.id}`}>
            {rowData.description}
          </div>
        </div>
      </React.Fragment>
    );
  };


  const countryTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span>{rowData.reviewer}</span>
      </React.Fragment>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <span className={`customer-badge status-${rowData.Approved}`}>
        {rowData.Approved[0] ? "Approved" : "Review Pending"}
      </span>
    );
  };


  
 
  const dateBodyTemplate = (rowData) => {
  
    return (
      <React.Fragment>
        <span>{rowData.time}</span>
      </React.Fragment>
    );
  };
  const header = renderHeader();

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-folder-open"
          className="nextBtn p-button-sm"
          onClick={() => editProduct(rowData)}
          style={{
            backgroundColor: "#203570",
            width: "10%",
            height: "10%",
            borderRadius: "2px",
          }}
        />
      </React.Fragment>
    );
  };

  const editProduct = (product) => {
    // customerService.docDataById = product;
    // navigate("/Version/" + product.id);
  };

  return (


    <div className="datatable-doc-demo">

      
 
      <div className="card">
        <DataTable
          value={posts}
          paginator
          className="p-datatable-customers"
          header={header}
          rows={8}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          dataKey="id"
          rowHover
          size="small"

          loading={loading}
          stripedRows
        //   selection={selectedCustomers}
        //   onSelectionChange={(e) => setSelectedCustomers(e.value)}
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={[
            "vehicletype",
            "speed",
            "cameratype",
            " time",
            "location",
          ]}
          emptyMessage="No documents found."
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        >

<Column
            field="vehicletype"
            header="VehicleType"
            sortable
           
            filter
            filterPlaceholder="vehicletype"
            // filterMenuStyle={{ width: "14rem" }}
          /> 





          <Column
            field="speed"
            header="Speed"
            sortable
           
           
            filter
            filterPlaceholder="speed"
            filterMenuStyle={{ width: "14rem" }}
          />

          <Column
            field="cameratype"
            header="Camera"
            sortable
            filterField="cameratype"
            filter
            filterMenuStyle={{ width: "14rem" }}
          />

<Column
            field="date"
            header="Date"
            sortable
            dataType="date"
           style={{ minWidth: "10rem" }}
           
          />





<Column
  field="time" 
  header="Time"
  sortable
  body={dateBodyTemplate}
  style={{ minWidth: "8rem" }}
/>

          {/* <Column
            field="time"
            header="Time"
            sortable
            filterField="reviewer"
            body={dateBodyTemplate}
            filterMatchMode="equals"
            style={{ minWidth: "8rem" }}
            filter
            filterPlaceholder="time"
            
          /> */}


        

<Column
            field="location"
            header="Location"
            sortable
            filter
            filterPlaceholder="location"
            filterMenuStyle={{ width: "14rem" }}
          />



        
        </DataTable>
      </div>
    </div>
  );
};

export default Product;







