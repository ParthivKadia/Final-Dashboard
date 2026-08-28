import OrdersListPage from './OrdersListPage';

export default function CancelledOrders() {
  return (
    <OrdersListPage
      title="Cancelled Orders"
      subtitle="Orders cancelled before completion"
      defaultStatus="Cancelled"
    />
  );
}
