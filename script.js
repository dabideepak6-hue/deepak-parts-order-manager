/* ==========================================================
   DEEPAK DABI SMART PARTS AI V10
   SCRIPT.JS — PART 1
========================================================== */

/* ===========================
   LOCAL DATABASE
=========================== */

let orders = JSON.parse(localStorage.getItem("deepakPartsOrders")) || [];

let editingIndex = -1;

/* ===========================
   ELEMENTS
=========================== */

const ordersBody = document.getElementById("ordersBody");

const totalOrders = document.getElementById("totalOrders");
const pendingOrders = document.getElementById("pendingOrders");
const orderedOrders = document.getElementById("orderedOrders");
const deliveredOrders = document.getElementById("deliveredOrders");
const todayOrders = document.getElementById("todayOrders");
const successRate = document.getElementById("successRate");

const toast = document.getElementById("toast");

/* ===========================
   TODAY DATE
=========================== */

const today = new Date().toISOString().split("T")[0];

const orderDate = document.getElementById("orderDate");
const expectedDate = document.getElementById("expectedDate");

if (orderDate) orderDate.value = today;
if (expectedDate) expectedDate.value = today;

/* ===========================
   SAVE LOCAL
=========================== */

function saveDatabase() {
    localStorage.setItem(
        "deepakPartsOrders",
        JSON.stringify(orders)
    );
}

/* ===========================
   TOAST
=========================== */

function showToast(message = "Success") {

    if (!toast) return;

    toast.innerText = message;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 2500);

}

/* ===========================
   LIVE CLOCK
=========================== */

function updateClock() {

    const clock = document.getElementById("liveClock");

    if (!clock) return;

    const now = new Date();

    clock.innerHTML =
        now.toLocaleDateString() +
        " | " +
        now.toLocaleTimeString();

}

setInterval(updateClock, 1000);

updateClock();

/* ===========================
   DASHBOARD
=========================== */

function updateDashboard() {

    totalOrders.textContent = orders.length;

    pendingOrders.textContent =
        orders.filter(o => o.status === "Pending").length;

    orderedOrders.textContent =
        orders.filter(o => o.status === "Ordered").length;

    deliveredOrders.textContent =
        orders.filter(o => o.status === "Delivered").length;

    todayOrders.textContent =
        orders.filter(o => o.orderDate === today).length;

    const delivered =
        orders.filter(o => o.status === "Delivered").length;

    let percent = 0;

    if (orders.length > 0) {

        percent =
            Math.round(
                (delivered / orders.length) * 100
            );

    }

    successRate.textContent = percent + "%";

}

/* ===========================
   SAVE ORDER
=========================== */

function saveOrder() {

    const order = {

        dms:
            document.getElementById("dmsOrder").value.trim(),

        customer:
            document.getElementById("customerName").value.trim(),

        mobile:
            document.getElementById("mobileNumber").value.trim(),

        vehicle:
            document.getElementById("vehicleModel").value.trim(),

        partNumber:
            document.getElementById("partNumber").value.trim(),

        partName:
            document.getElementById("partName").value.trim(),

        quantity:
            document.getElementById("quantity").value,

        orderDate:
            document.getElementById("orderDate").value,

        expectedDate:
            document.getElementById("expectedDate").value,

        status:
            document.getElementById("status").value,

        remarks:
            document.getElementById("remarks").value.trim()

    };

    if (
        order.dms === "" ||
        order.customer === "" ||
        order.mobile === ""
    ) {

        showToast("Fill required fields");
        return;

    }

    if (editingIndex >= 0) {

        orders[editingIndex] = order;

        editingIndex = -1;

        showToast("Order Updated");

    } else {

        orders.push(order);

        showToast("Order Saved");

    }

    saveDatabase();

    renderOrders();

    updateDashboard();

    resetForm();

}

/* ===========================
   RESET FORM
=========================== */

function resetForm() {

    document.getElementById("dmsOrder").value = "";
    document.getElementById("customerName").value = "";
    document.getElementById("mobileNumber").value = "";
    document.getElementById("vehicleModel").value = "";
    document.getElementById("partNumber").value = "";
    document.getElementById("partName").value = "";
    document.getElementById("quantity").value = 1;
    document.getElementById("remarks").value = "";

    orderDate.value = today;
    expectedDate.value = today;

    document.getElementById("status").value = "Pending";

}

/* ===========================
   EVENTS
=========================== */

document
.getElementById("saveOrderBtn")
.addEventListener(
    "click",
    saveOrder
);

document
.getElementById("resetFormBtn")
.addEventListener(
    "click",
    resetForm
);

/* ===========================
   INIT
=========================== */

updateDashboard();
/* ==========================================================
   DEEPAK DABI SMART PARTS AI V10
   SCRIPT.JS — PART 2
========================================================== */

/* ===========================
   RENDER ORDERS
=========================== */

function getStatusClass(status){

    switch(status){

        case "Pending":
            return "status-badge pending-status";

        case "Ordered":
            return "status-badge ordered-status";

        case "Delivered":
            return "status-badge delivered-status";

        case "Cancelled":
            return "status-badge cancelled-status";

        default:
            return "status-badge";

    }

}

function renderOrders(){

    if(!ordersBody) return;

    ordersBody.innerHTML="";

    let keyword=document
    .getElementById("searchInput")
    ?.value.toLowerCase() || "";

    let statusFilter=document
    .getElementById("statusFilter")
    ?.value || "";

    let dateFilter=document
    .getElementById("dateFilter")
    ?.value || "";

    let filtered=orders.filter(order=>{

        let text=JSON.stringify(order).toLowerCase();

        let searchOK=text.includes(keyword);

        let statusOK=
        statusFilter==="" ||
        order.status===statusFilter;

        let dateOK=
        dateFilter==="" ||
        order.orderDate===dateFilter;

        return searchOK && statusOK && dateOK;

    });

    filtered.forEach((order,index)=>{

        ordersBody.innerHTML +=`

<tr>

<td>${index+1}</td>

<td>${order.dms}</td>

<td>${order.customer}</td>

<td>${order.mobile}</td>

<td>${order.vehicle}</td>

<td>${order.partNumber}</td>

<td>${order.partName}</td>

<td>${order.quantity}</td>

<td>${order.orderDate}</td>

<td>${order.expectedDate}</td>

<td>

<span class="${getStatusClass(order.status)}">

${order.status}

</span>

</td>

<td>

<button
class="action-btn whatsapp-btn"
onclick="sendWhatsApp(${index})">

💬

</button>

<button
class="action-btn edit-btn"
onclick="editOrder(${index})">

✏️

</button>

<button
class="action-btn delete-btn"
onclick="deleteOrder(${index})">

🗑

</button>

</td>

</tr>

`;

    });

}

/* ===========================
   SEARCH EVENTS
=========================== */

document
.getElementById("searchInput")
.addEventListener("keyup",renderOrders);

document
.getElementById("statusFilter")
.addEventListener("change",renderOrders);

document
.getElementById("dateFilter")
.addEventListener("change",renderOrders);

document
.getElementById("clearFilterBtn")
.addEventListener("click",()=>{

document.getElementById("searchInput").value="";
document.getElementById("statusFilter").value="";
document.getElementById("dateFilter").value="";

renderOrders();

});

/* ===========================
   LOAD DATA
=========================== */

renderOrders();
updateDashboard();
/* ==========================================================
   DEEPAK DABI SMART PARTS AI V10
   SCRIPT.JS — PART 3
   Edit • Delete • WhatsApp • CSV • Print
========================================================== */

/* ===========================
   EDIT ORDER
=========================== */

function editOrder(index){

    const order = orders[index];
    if(!order) return;

    editingIndex = index;

    document.getElementById("dmsOrder").value = order.dms;
    document.getElementById("customerName").value = order.customer;
    document.getElementById("mobileNumber").value = order.mobile;
    document.getElementById("vehicleModel").value = order.vehicle;
    document.getElementById("partNumber").value = order.partNumber;
    document.getElementById("partName").value = order.partName;
    document.getElementById("quantity").value = order.quantity;
    document.getElementById("orderDate").value = order.orderDate;
    document.getElementById("expectedDate").value = order.expectedDate;
    document.getElementById("status").value = order.status;
    document.getElementById("remarks").value = order.remarks || "";

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

    showToast("Editing Order");
}

/* ===========================
   DELETE ORDER
=========================== */

function deleteOrder(index){

    if(!confirm("Delete this order?")) return;

    orders.splice(index,1);

    saveDatabase();

    renderOrders();

    updateDashboard();

    showToast("Order Deleted");

}

/* ===========================
   WHATSAPP
=========================== */

function sendWhatsApp(index){

    const o = orders[index];
    if(!o) return;

    let message =
`Namaste ${o.customer} Ji,

DMS Order : ${o.dms}

Part : ${o.partName}
Part No : ${o.partNumber}
Qty : ${o.quantity}

Status : ${o.status}

Expected Date : ${o.expectedDate}

Thank you.
Deepak Dabi Smart Parts AI`;

    window.open(
        "https://wa.me/91"+
        o.mobile+
        "?text="+
        encodeURIComponent(message),
        "_blank"
    );

}

/* ===========================
   CSV EXPORT
=========================== */

function exportCSV(){

    if(orders.length===0){

        showToast("No Data");

        return;

    }

    let csv =
"DMS,Customer,Mobile,Vehicle,PartNumber,PartName,Quantity,OrderDate,ExpectedDate,Status,Remarks\n";

    orders.forEach(o=>{

        csv +=
`${o.dms},"${o.customer}",${o.mobile},"${o.vehicle}","${o.partNumber}","${o.partName}",${o.quantity},${o.orderDate},${o.expectedDate},${o.status},"${o.remarks}"\n`;

    });

    const blob = new Blob(
        [csv],
        {type:"text/csv"}
    );

    const link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    link.download =
    "Deepak_Parts_Orders.csv";

    link.click();

    showToast("CSV Exported");

}

const exportBtn =
document.getElementById("exportCSVBtn");

if(exportBtn){

    exportBtn.addEventListener(
        "click",
        exportCSV
    );

}

/* ===========================
   PRINT
=========================== */

const printBtn =
document.getElementById("printBtn");

if(printBtn){

    printBtn.addEventListener(
        "click",
        ()=>{
            window.print();
        }
    );

}
/* ===========================
   HIDE LOADER
=========================== */

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    if(loader){

        loader.style.transition = "opacity 0.6s ease";

        loader.style.opacity = "0";

        setTimeout(() => {

            loader.style.display = "none";

        },600);

    }

});
