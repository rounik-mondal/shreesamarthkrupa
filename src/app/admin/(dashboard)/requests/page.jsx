import prisma from '@/lib/db';
import Link from 'next/link';

export default async function AdminRequests() {
  const requests = await prisma.customRequest.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 className="text-3xl font-serif text-royal-900 mb-8">Custom Requests</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="p-4">Req ID</th>
              <th className="p-4">Details</th>
              <th className="p-4">Status</th>
              <th className="p-4">Offered Price</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.map(req => (
              <tr key={req.id} className="hover:bg-gray-50">
                <td className="p-4 text-sm font-medium text-gray-900">#{req.id.slice(-6)}</td>
                <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                  {req.details}
                </td>
                <td className="p-4">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    req.status === 'OFFER_MADE' ? 'bg-blue-100 text-blue-800' :
                    req.status === 'PAID' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {req.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 text-sm font-medium text-gray-900">
                  {req.offeredPrice ? `₹${Number(req.offeredPrice).toLocaleString('en-IN')}` : '-'}
                </td>
                <td className="p-4">
                  <Link 
                    href={`/admin/requests/${req.id}`}
                    className="text-royal-900 hover:text-gold-500 text-sm font-medium"
                  >
                    Review
                  </Link>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">No requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
