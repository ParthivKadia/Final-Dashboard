import OrdersListPage from './OrdersListPage';

export default function ReturnedOrders() {
  return (
    <OrdersListPage
      title="Returned Orders"
      subtitle="Orders sent back by customers"
      defaultStatus="Returned"
    />
  );
}
