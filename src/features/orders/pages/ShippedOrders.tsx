import OrdersListPage from './OrdersListPage';

export default function ShippedOrders() {
  return (
    <OrdersListPage
      title="Shipped Orders"
      subtitle="Orders already dispatched to customers"
      defaultStatus="Shipped"
    />
  );
}
