import OrdersListPage from './OrdersListPage';

export default function PendingOrders() {
  return (
    <OrdersListPage
      title="Pending Orders"
      subtitle="Orders waiting for confirmation or payment review"
      defaultStatus="Pending"
    />
  );
}
  