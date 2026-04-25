import prisma from '@/lib/db';
import { Package, ShoppingCart, IndianRupee, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const [totalOrders, totalProducts, totalReqs, orderRevenue, reqRevenue, recentOrders, recentReqs] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.customRequest.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { paymentStatus: 'COMPLETED' }
    }),
    prisma.customRequest.aggregate({
      _sum: { offeredPrice: true },
      where: { paymentStatus: 'COMPLETED' }
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    }),
    prisma.customRequest.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  const combinedRevenue = (Number(orderRevenue._sum.totalAmount) || 0) + (Number(reqRevenue._sum.offeredPrice) || 0);

  const combinedRecent = [
    ...recentOrders.map(o => ({ ...o, type: 'ORDER' })),
    ...recentReqs.map(r => ({ ...r, type: 'CUSTOM_REQUEST' }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const stats = [
    { label: 'Total Revenue', value: `₹${combinedRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'bg-green-100 text-green-600' },
    { label: 'Total Orders', value: totalOrders, icon: ShoppingCart, color: 'bg-blue-100 text-blue-600' },
    { label: 'Custom Requests', value: totalReqs, icon: MessageSquare, color: 'bg-orange-100 text-orange-600' },
    { label: 'Products', value: totalProducts, icon: Package, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-serif text-royal-900 mb-8">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
            <div className={`p-4 rounded-full ${stat.color} mr-4`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-serif text-royal-900">Recent Activity</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="p-4">Type</th>
                <th className="p-4">ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {combinedRecent.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4 text-xs font-bold text-gray-500">
                    {item.type === 'ORDER' ? 'STANDARD' : 'BESPOKE'}
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-900">#{item.id.slice(-6)}</td>
                  <td className="p-4 text-sm text-gray-600">
                    {item.type === 'ORDER' ? (item.user?.name || item.user?.email || 'Guest') : item.userId}
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-900">
                    {item.type === 'ORDER' ? `₹${Number(item.totalAmount).toLocaleString('en-IN')}` : (item.offeredPrice ? `₹${Number(item.offeredPrice).toLocaleString('en-IN')}` : '-')}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      item.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link 
                      href={item.type === 'ORDER' ? `/admin/orders/${item.id}` : `/admin/requests/${item.id}`}
                      className="text-royal-900 hover:text-gold-500 text-sm font-medium"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
              {combinedRecent.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">No activity yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
