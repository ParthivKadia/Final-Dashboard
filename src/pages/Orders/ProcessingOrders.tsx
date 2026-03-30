import OrdersListPage from './OrdersListPage';

export default function ProcessingOrders() {
  return (
    <OrdersListPage
      title="Processing Orders"
      subtitle="Orders currently being packed and prepared"
      defaultStatus="Processing"
    />
  );
}
