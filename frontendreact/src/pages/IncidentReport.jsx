





// import React, { useState } from 'react';

 

// function Users() {

//   const [startDate, setStartDate] = useState('');

//   const [endDate, setEndDate] = useState('');

 

//   const handleDownloadClick = async () => {

//     try {

//       const response = await fetch(`${process.env.REACT_APP_API_KEY}/downloadExitCounting?startDate=${startDate}&endDate=${endDate}`);

     

//       if (response.ok) {

//         // Convert the response to a blob

//         const blob = await response.blob();

       

//         // Create a URL for the blob

//         const url = window.URL.createObjectURL(blob);

       

//         // Create a link element to trigger the download

//         const a = document.createElement('a');

//         a.href = url;

//         a.download = 'exit_counting_data.pdf';

//         document.body.appendChild(a);

//         a.click();

       

//         // Clean up the URL and link element

//         window.URL.revokeObjectURL(url);

//         document.body.removeChild(a);

//       } else {

//         // Handle the error here

//         console.error('Failed to download PDF');

//       }

//     } catch (error) {

//       console.error(error);

//     }

//   };

 

//   return (

//     <div>

//       <label>Start Date:</label>

//       <input

//         type="text"

//         value={startDate}

//         onChange={(e) => setStartDate(e.target.value)}

//       />

//       <label>End Date:</label>

//       <input

//         type="text"

//         value={endDate}

//         onChange={(e) => setEndDate(e.target.value)}

//       />

//       <button onClick={handleDownloadClick}>Download PDF</button>

//     </div>

//   );

// }

 

 

 

// export default Users








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
    date: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    enterCount: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    exitCount: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },

    totalCount: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
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

  };




  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_KEY}/totalcount`)
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
        <div>Total Vehicle Count</div>
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
            "date",
            "enterCount",
            "exitCount",
            "totalCount"
           
          ]}
          emptyMessage="No documents found."
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        >


<Column
            field="date"
            header="Date"
            sortable
            filterField="date"
           
            // body={countryBodyTemplate}
            filter
            filterMenuStyle={{ width: "14rem" }}
          />


<Column
            field="enterCount"
            header="Right Hand Side Vehicle Count"
            sortable
            dataType="enterCount"
            //  body={dateBodyTemplate}
            style={{ minWidth: "10rem" }}
           
          />








          <Column
            field="exitCount"
            header="Left Hand Side Vehicle Count"
            sortable
           
            // style={{
            //   maxWidth: "200px",
            //   minWidth: "8rem",
            //   textOverflow: "ellipsis",
            //   overflow: "hidden",
            //   whiteSpace: "nowrap",
            // }}
            filter
            filterPlaceholder="Search by name"
            filterMenuStyle={{ width: "14rem" }}
          />

         


<Column
            field="totalCount"
            header="Total Count"
            sortable
           
           
            filter
            filterPlaceholder="totalCount"
            filterMenuStyle={{ width: "14rem" }}
          />







        


        




        
        </DataTable>
      </div>
    </div>
  );
};

export default Product;







