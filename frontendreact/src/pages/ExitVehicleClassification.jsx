













import React, { useState, useEffect } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";

import axios from "axios";
import "../App.css";


const Product = () => {


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
    location: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },

    averageSpeed: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },


      count: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
  
    date: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
   
    
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

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
      .get(`${process.env.REACT_APP_API_KEY}/exitvehicleclassForCurrentHour`)
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
        <div>Exit Vehicle Classification</div>
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







  
  
  const header = renderHeader();

  

  return (
    <div className="datatable-doc-demo">
      
    {/* <div>

<label>Start Date:</label>

<input

  type="text"

  value={startDate}

  onChange={(e) => setStartDate(e.target.value)}

/>

<label>End Date:</label>

<input

  type="text"

  value={endDate}

  onChange={(e) => setEndDate(e.target.value)}

/>

<button onClick={handleDownloadClick}>Download PDF</button>

</div> */}
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
            "cameratype",
            "location",
            "averageSpeed",
            "count",
          ]}
          emptyMessage="No documents found."
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        >


<Column
            field="vehicletype"
            header="VehicleType"
            sortable
            filterField="vehicletype"
           
            // body={countryBodyTemplate}
            filter
            filterMenuStyle={{ width: "14rem" }}
          />


<Column
            field="date"
            header="Date"
            sortable
            dataType="date"
            //  body={dateBodyTemplate}
            style={{ minWidth: "10rem" }}
           
          />








          <Column
            field="cameratype"
            header="Camera"
            sortable
           
            style={{
              maxWidth: "200px",
              minWidth: "8rem",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
            filter
            filterPlaceholder="Search by name"
            filterMenuStyle={{ width: "14rem" }}
          />

         


<Column
            field="location"
            header="Location"
            sortable
           
           
            filter
            filterPlaceholder="location"
            filterMenuStyle={{ width: "14rem" }}
          />



<Column
            field="averageSpeed"
            header="AverageSpeed"
            sortable
           
            filter
            filterPlaceholder="Search by name"
            filterMenuStyle={{ width: "14rem" }}
          /> 


<Column
            field="count"
            header="Count"
            sortable
           
            filter
            filterPlaceholder="Count"
            filterMenuStyle={{ width: "14rem" }}
          /> 


        


        




        
        </DataTable>
      </div>
    </div>
  );
};

export default Product;







