import OrdersListPage from './OrdersListPage';

export default function DeliveredOrders() {
  return (
    <OrdersListPage
      title="Delivered Orders"
      subtitle="Successfully delivered orders"
      defaultStatus="Delivered"
    />
  );
}
