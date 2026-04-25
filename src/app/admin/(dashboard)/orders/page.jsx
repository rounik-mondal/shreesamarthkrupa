import prisma from '@/lib/db';
import Link from 'next/link';

export default async function AdminOrders({ searchParams }) {
  const statusFilter = searchParams?.status || 'ALL';

  const where = statusFilter !== 'ALL' ? { status: statusFilter } : {};

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      items: true
    }
  });

  const statuses = ['ALL', 'PENDING', 'CONFIRMED', 'FABRIC_CUTTING', 'STITCHING', 'READY_TO_SHIP', 'DELIVERED', 'CANCELLED'];

  return (
    <div>
      <h1 className="text-3xl font-serif text-royal-900 mb-8">Orders Management</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {statuses.map(status => (
          <Link
            key={status}
            href={`/admin/orders?status=${status}`}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              statusFilter === status 
                ? 'bg-royal-900 text-white' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {status.replace('_', ' ')}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-4 text-sm font-medium text-gray-900">#{order.id.slice(-6)}</td>
                <td className="p-4 text-sm text-gray-600">
                  {order.user?.name || 'Guest'}<br/>
                  <span className="text-xs text-gray-400">{order.user?.email}</span>
                </td>
                <td className="p-4 text-sm text-gray-600">{order.items.length} items</td>
                <td className="p-4 text-sm font-medium text-gray-900">₹{Number(order.totalAmount).toLocaleString('en-IN')}</td>
                <td className="p-4">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    order.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="p-4">
                  <span className="inline-flex px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                    {order.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4">
                  <Link 
                    href={`/admin/orders/${order.id}`}
                    className="text-royal-900 hover:text-gold-500 text-sm font-medium"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">No orders found for this filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
