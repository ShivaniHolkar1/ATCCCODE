




import React, { useState, useEffect } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";

import { Button } from "primereact/button";
import axios from "axios";
import "../App.css";
import { Calendar } from "primereact/calendar";


const Product = () => {
  const [posts, setPosts] = useState();
  const [loading, setLoading] = useState(true);
    const [selectedCustomers, setSelectedCustomers] = useState(null);




  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    cameratype: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    vehicletype: {
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
    
      'date': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
   
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
      .get(`${process.env.REACT_APP_API_KEY}/entervehicleclassForCurrentHour`)
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
        <div>Enter Vehicle Classification</div>
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



  const getCustomers = (data) => {
    return [...data || []].map(d => {
        d.date = new Date(d.date);
        return d;
    });
}

  const formatDate = (value) => {
    // return value.toLocaleDateString('en-US', {
    //     day: '2-digit',
    //     month: '2-digit',
    //     year: 'numeric',
    // });
}


  const countryBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <div>
          {/* <Tooltip style={{ width: "30%" }} target={`.custom-tooltip-btn-${rowData.id}`}>
            {rowData.vehicletype}
          </Tooltip> */}
          <div className={`custom-tooltip-btn-${rowData.id}`}>
            {rowData.vehicletype}
          </div>
        </div>
      </React.Fragment>
    );
  };


  const countryTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span>{rowData.count}</span>
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
    console.log(rowData.date,"rowdata for date")
    return formatDate(rowData.date);
}

const dateFilterTemplate = (options) => {
    return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm-dd-yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />
}


  
//   const dateBodyTemplate = (uploadedDate) => {
    
// console.log("uploadedDate: ",uploadedDate.timestamp[0]);
//     return (
    
//       <div>
//         {new Intl.DateTimeFormat("en-IN", {
//           year: "numeric",
//           month: "2-digit",
//           day: "2-digit" ,
//           hour: "2-digit",
//           minute: "2-digit",
//         }).format(uploadedDate.timestamp[0])}
//       </div>
//     );
//       }
  const header = renderHeader();

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-folder-open"
          className="nextBtn p-button-sm"
        //   onClick={() => editProduct(rowData)}
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


  return (
<div>

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
          selection={selectedCustomers}
          onSelectionChange={(e) => setSelectedCustomers(e.value)}
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={[
            "cameratype",
            "vehicletype",
            "location",
            "averageSpeed",
            " count",
          ]}
          emptyMessage="No documents found."
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        >


<Column
            field="vehicletype"
            header="VehicleType"
            sortable
            filterField="vehicletype"
           
            body={countryBodyTemplate}
            filter
            filterMenuStyle={{ width: "14rem" }}
          />


{/* <Column
            field="date"
            header="Date"
            sortable
            dataType="date"
            //  body={dateBodyTemplate}
            style={{ minWidth: "10rem" }}
           
          /> */}




<Column field="date" header="Date" 
sortable 
filterField="date" 
dataType="date" style={{ minWidth: '8rem' }}
//  body={dateBodyTemplate}
                        filter filterElement={dateFilterTemplate} />






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
            filterPlaceholder="cameratype"
            filterMenuStyle={{ width: "14rem" }}
          />

         


<Column
            field="location"
            header="Location"
            sortable
           
            style={{
              maxWidth: "200px",
              minWidth: "8rem",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
            filter
            filterPlaceholder="location"
            filterMenuStyle={{ width: "14rem" }}
          />



<Column
            field="averageSpeed"
            header="AverageSpeed"
            sortable
           
            filter
            filterPlaceholder="averageSpeed"
            filterMenuStyle={{ width: "14rem" }}
          /> 


<Column
            field="count"
            header="Count"
            sortable
           
           
            filter
            filterPlaceholder="count"
            filterMenuStyle={{ width: "14rem" }}
          />


        




          {/* <Column field="status" header="Status" body={statusBodyTemplate} /> */}

        
        </DataTable>
      </div>
    </div>
    </div>
  );
};

export default Product;





// import React, { useState, useEffect } from 'react';
// import { FilterMatchMode, FilterOperator } from 'primereact/api';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { InputText } from 'primereact/inputtext';
// import { Dropdown } from 'primereact/dropdown';
// import { InputNumber } from 'primereact/inputnumber';
// import { Button } from 'primereact/button';
// import { ProgressBar } from 'primereact/progressbar';
// import { Calendar } from 'primereact/calendar';
// import { MultiSelect } from 'primereact/multiselect';
// import { Slider } from 'primereact/slider';
// import { CustomerService } from '../service/CustomerService';
// import './DataTableDemo.css';

// const DataTableDemo = () => {
//     const [customers, setCustomers] = useState(null);
//     const [selectedCustomers, setSelectedCustomers] = useState(null);
//     const [filters, setFilters] = useState({
//         'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
//         'name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
//         'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
//         'representative': { value: null, matchMode: FilterMatchMode.IN },
//         'date': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
//         'balance': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
//         'status': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
//         'activity': { value: null, matchMode: FilterMatchMode.BETWEEN }
//     });
//     const [globalFilterValue, setGlobalFilterValue] = useState('');
//     const [loading, setLoading] = useState(true);
//     const representatives = [
//         {name: "Amy Elsner", image: 'amyelsner.png'},
//         {name: "Anna Fali", image: 'annafali.png'},
//         {name: "Asiya Javayant", image: 'asiyajavayant.png'},
//         {name: "Bernardo Dominic", image: 'bernardodominic.png'},
//         {name: "Elwin Sharvill", image: 'elwinsharvill.png'},
//         {name: "Ioni Bowcher", image: 'ionibowcher.png'},
//         {name: "Ivan Magalhaes",image: 'ivanmagalhaes.png'},
//         {name: "Onyama Limba", image: 'onyamalimba.png'},
//         {name: "Stephen Shaw", image: 'stephenshaw.png'},
//         {name: "XuXue Feng", image: 'xuxuefeng.png'}
//     ];

//     const statuses = [
//         'unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'
//     ];

//     const customerService = new CustomerService();

//     useEffect(() => {
//         customerService.getCustomersLarge().then(data => { setCustomers(getCustomers(data)); setLoading(false) });
//     }, []); // eslint-disable-line react-hooks/exhaustive-deps

//     const getCustomers = (data) => {
//         return [...data || []].map(d => {
//             d.date = new Date(d.date);
//             return d;
//         });
//     }

//     const formatDate = (value) => {
//         return value.toLocaleDateString('en-US', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric',
//         });
//     }

//     const formatCurrency = (value) => {
//         return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
//     }

//     const onGlobalFilterChange = (e) => {
//         const value = e.target.value;
//         let _filters = { ...filters };
//         _filters['global'].value = value;

//         setFilters(_filters);
//         setGlobalFilterValue(value);
//     }

//     const renderHeader = () => {
//         return (
//             <div className="flex justify-content-between align-items-center">
//                 <h5 className="m-0">Customers</h5>
//                 <span className="p-input-icon-left">
//                     <i className="pi pi-search" />
//                     <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
//                 </span>
//             </div>
//         )
//     }

//     const countryBodyTemplate = (rowData) => {
//         return (
//             <React.Fragment>
//                 <img alt="flag" src="images/flag/flag_placeholder.png" onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} className={`flag flag-${rowData.country.code}`} width={30} />
//                 <span className="image-text">{rowData.country.name}</span>
//             </React.Fragment>
//         );
//     }

//     const representativeBodyTemplate = (rowData) => {
//         const representative = rowData.representative;
//         return (
//             <React.Fragment>
//                 <img alt={representative.name} src={`images/avatar/${representative.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width={32} style={{ verticalAlign: 'middle' }} />
//                 <span className="image-text">{representative.name}</span>
//             </React.Fragment>
//         );
//     }

//     const representativeFilterTemplate = (options) => {
//         return (
//             <React.Fragment>
//                 <div className="mb-3 font-bold">Agent Picker</div>
//                 <MultiSelect value={options.value} options={representatives} itemTemplate={representativesItemTemplate} onChange={(e) => options.filterCallback(e.value)} optionLabel="name" placeholder="Any" className="p-column-filter" />
//             </React.Fragment>
//         );
//     }

//     const representativesItemTemplate = (option) => {
//         return (
//             <div className="p-multiselect-representative-option">
//                 <img alt={option.name} src={`images/avatar/${option.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width={32} style={{ verticalAlign: 'middle' }} />
//                 <span className="image-text">{option.name}</span>
//             </div>
//         );
//     }

//     const dateBodyTemplate = (rowData) => {
//         return formatDate(rowData.date);
//     }

//     const dateFilterTemplate = (options) => {
//         return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />
//     }

//     const balanceBodyTemplate = (rowData) => {
//         return formatCurrency(rowData.balance);
//     }

//     const balanceFilterTemplate = (options) => {
//         return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="USD" locale="en-US" />
//     }

//     const statusBodyTemplate = (rowData) => {
//         return <span className={`customer-badge status-${rowData.status}`}>{rowData.status}</span>;
//     }

//     const statusFilterTemplate = (options) => {
//         return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select a Status" className="p-column-filter" showClear />;
//     }

//     const statusItemTemplate = (option) => {
//         return <span className={`customer-badge status-${option}`}>{option}</span>;
//     }

//     const activityBodyTemplate = (rowData) => {
//         return <ProgressBar value={rowData.activity} showValue={false}></ProgressBar>;
//     }

//     const activityFilterTemplate = (options) => {
//         return (
//             <React.Fragment>
//                 <Slider value={options.value} onChange={(e) => options.filterCallback(e.value)} range className="m-3"></Slider>
//                 <div className="flex align-items-center justify-content-between px-2">
//                     <span>{options.value ? options.value[0] : 0}</span>
//                     <span>{options.value ? options.value[1] : 100}</span>
//                 </div>
//             </React.Fragment>
//         )
//     }

//     const representativeRowFilterTemplate = (options) => {
//         return <MultiSelect value={options.value} options={representatives} itemTemplate={representativesItemTemplate} onChange={(e) => options.filterApplyCallback(e.value)} optionLabel="name" placeholder="Any" className="p-column-filter" maxSelectedLabels={1} />;
//     }

//     const statusRowFilterTemplate = (options) => {
//         return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterApplyCallback(e.value)} itemTemplate={statusItemTemplate} placeholder="Select a Status" className="p-column-filter" showClear />;
//     }

//     const actionBodyTemplate = () => {
//         return <Button type="button" icon="pi pi-cog"></Button>;
//     }

//     const header = renderHeader();

//     return (
//         <div className="datatable-doc-demo">
//             <div className="card">
//                 <DataTable value={customers} paginator className="p-datatable-customers" header={header} rows={10}
//                     paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
//                     dataKey="id" rowHover selection={selectedCustomers} onSelectionChange={e => setSelectedCustomers(e.value)}
//                     filters={filters} filterDisplay="menu" loading={loading} responsiveLayout="scroll"
//                     globalFilterFields={['name', 'country.name', 'representative.name', 'balance', 'status']} emptyMessage="No customers found."
//                     currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
//                     <Column selectionMode="multiple" selectionAriaLabel="name" headerStyle={{ width: '3em' }}></Column>
//                     <Column field="name" header="Name" sortable filter filterPlaceholder="Search by name" style={{ minWidth: '14rem' }} />
//                     <Column field="country.name" header="Country" sortable filterField="country.name" style={{ minWidth: '14rem' }} body={countryBodyTemplate} filter filterPlaceholder="Search by country" />
//                     <Column header="Agent" sortable sortField="representative.name" filterField="representative" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }} body={representativeBodyTemplate}
//                         filter filterElement={representativeFilterTemplate} />
//                     <Column field="date" header="Date" sortable filterField="date" dataType="date" style={{ minWidth: '8rem' }} body={dateBodyTemplate}
//                         filter filterElement={dateFilterTemplate} />
//                     <Column field="balance" header="Balance" sortable dataType="numeric" style={{ minWidth: '8rem' }} body={balanceBodyTemplate} filter filterElement={balanceFilterTemplate} />
//                     <Column field="status" header="Status" sortable filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '10rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />
//                     <Column field="activity" header="Activity" sortable showFilterMatchModes={false} style={{ minWidth: '10rem' }} body={activityBodyTemplate} filter filterElement={activityFilterTemplate} />
//                     <Column headerStyle={{ width: '4rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
//                 </DataTable>
//             </div>
//         </div>
//     );
// }
                 