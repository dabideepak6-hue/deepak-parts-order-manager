// Deepak Parts Order Manager

let orders = JSON.parse(localStorage.getItem("orders")) || [];

function saveOrders() {
    localStorage.setItem("orders", JSON.stringify(orders));
    updateDashboard();
}

function updateDashboard() {

    const total = orders.length;

    const pending = orders.filter(o => o.status === "Pending").length;

    const delivered = orders.filter(o => o.status === "Delivered").length;

    document.getElementById("totalOrders").textContent = total;
    document.getElementById("pendingOrders").textContent = pending;
    document.getElementById("deliveredOrders").textContent = delivered;
}

// Example Order (sirf pehli baar test ke liye)
if (orders.length === 0) {
    orders.push({
        dmsOrderNo: "SO-1001",
        customerName: "Demo Customer",
        mobile: "9876543210",
        partNumber: "H12345",
        partName: "Brake Lever",
        quantity: 1,
        status: "Pending"
    });

    saveOrders();
} else {
    updateDashboard();
}
