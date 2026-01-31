import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Save, DollarSign, User, BookOpen, Search, ArrowUpDown, RefreshCcw } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../config/api';
import { userApiRoutes } from '../../config/apiRoutes';

function StudentFees() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('high-to-low');
  const [expandedId, setExpandedId] = useState(null);
  const queryClient = useQueryClient();

  // Fetch Students from API
  const { data: studentsData, isLoading } = useQuery({
    queryKey: ['students-fees'],
    queryFn: async () => {
      const res = await apiClient.get(userApiRoutes.GET_STUDENTS);
      return res.data?.students || [];
    }
  });

  // Filter and Sort Logic
  const filteredStudents = React.useMemo(() => {
    if (!studentsData) return [];
    
    let result = [...studentsData];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(s => 
        s.firstName?.toLowerCase().includes(term) ||
        s.lastName?.toLowerCase().includes(term) ||
        s.admissionNo?.toLowerCase().includes(term) ||
        s.course?.toLowerCase().includes(term)
      );
    }

    // Sort by Balance
    result.sort((a, b) => {
      const balanceA = (a.courseFeesOriginal - (a.discount || 0)) - (a.payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0);
      const balanceB = (b.courseFeesOriginal - (b.discount || 0)) - (b.payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0);
      return sortOrder === 'high-to-low' ? balanceB - balanceA : balanceA - balanceB;
    });

    return result;
  }, [studentsData, searchTerm, sortOrder]);


  const toggleAccordion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (isLoading) {
      return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
              <div className="text-xl text-indigo-600 font-semibold animate-pulse">Loading Fee Records...</div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <DollarSign className="text-indigo-600" size={32} />
            Student Fees Management
            </h1>
            <p className="text-gray-600">Track and manage monthly fee payments for all students</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, ID, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
            
            <div className="relative min-w-[200px]">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white appearance-none cursor-pointer"
              >
                <option value="high-to-low">Balance: High to Low</option>
                <option value="low-to-high">Balance: Low to High</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {filteredStudents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Students Found</h3>
              <p className="text-gray-500">Try adjusting your search filters</p>
            </div>
          ) : (
            filteredStudents.map(student => (
              <StudentFeeItem 
                key={student._id} 
                student={student} 
                isExpanded={expandedId === student._id} 
                toggleExpand={() => toggleAccordion(student._id)} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const StudentFeeItem = ({ student, isExpanded, toggleExpand }) => {
    const queryClient = useQueryClient();
    
    // Derived Calculations
    const totalFees = student.courseFeesOriginal || 0;
    const discount = student.discount || 0;
    const netPayable = totalFees - discount;
    const totalPaid = student.payments?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;
    const balance = netPayable - totalPaid;

    // Local state for editing payments
    const [payments, setPayments] = useState(student.payments || []);
    
    // Sync local state when prop updates (e.g. after refetch)
    useEffect(() => {
        setPayments(student.payments || []);
    }, [student.payments]);

    // Mutation for updating fees
    const { mutate: updateFees, isPending } = useMutation({
        mutationFn: async (updatedPayments) => {
            const res = await apiClient.put(
                `${userApiRoutes.UPDATE_FEES}/${student._id}`, 
                { payments: updatedPayments }
            );
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['students-fees']);
            alert("Fees updated successfully!");
        },
        onError: (err) => {
            console.error(err);
            alert("Failed to update fees.");
        }
    });

    const handlePaymentChange = (index, field, value) => {
        setPayments(prev => {
            const newArr = [...prev];
            newArr[index] = { ...newArr[index], [field]: value };
            return newArr; 
        });
    };

    const handleSave = () => {
        // Ensure amounts are numbers
        const cleanedPayments = payments.map(p => ({
            ...p,
            amount: parseFloat(p.amount) || 0
        }));
        updateFees(cleanedPayments);
    };

    const addMonth = () => {
        setPayments(prev => [
            ...prev,
            { 
                month: `Month ${prev.length + 1}`,
                amount: 0,
                paidOn: new Date().toISOString()
            }
        ]);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Header */}
            <div 
                onClick={toggleExpand}
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
                <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {student.firstName?.[0]}{student.lastName?.[0]}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">
                            {student.firstName} {student.lastName}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                             <span className="font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                {student.admissionNo}
                             </span>
                             <span>{student.course}</span>
                        </div>
                    </div>
                </div>

                <div className="text-right mr-6">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Balance</p>
                    <p className={`text-xl font-bold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ₹{balance.toLocaleString()}
                    </p>
                </div>

                {isExpanded ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50 p-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <p className="text-xs text-gray-500 mb-1">Total Course Fee</p>
                            <p className="text-lg font-bold text-gray-800">₹{totalFees.toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <p className="text-xs text-gray-500 mb-1">Discount</p>
                            <p className="text-lg font-bold text-green-600">-₹{discount.toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <p className="text-xs text-gray-500 mb-1">Total Paid</p>
                            <p className="text-lg font-bold text-indigo-600">₹{totalPaid.toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm bg-blue-50 border-blue-100">
                            <p className="text-xs text-blue-600 mb-1 font-bold">Net Payable</p>
                            <p className="text-lg font-bold text-blue-800">₹{netPayable.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Editor */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-gray-700 flex items-center gap-2">
                                <RefreshCcw size={18} />
                                Payment History
                            </h4>
                            <button onClick={addMonth} className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1">
                                <Plus size={16} /> Add Installment
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {payments.map((payment, idx) => (
                                <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex flex-col gap-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-gray-500 uppercase">{payment.month || `Inst. ${idx+1}`}</span>
                                        {payment.amount > 0 && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                                        <input 
                                            type="number" 
                                            value={payment.amount}
                                            onChange={(e) => handlePaymentChange(idx, 'amount', e.target.value)}
                                            className="w-full pl-8 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Amount"
                                        />
                                    </div>
                                    <input 
                                        type="date"
                                        value={payment.paidOn ? new Date(payment.paidOn).toISOString().split('T')[0] : ''}
                                        onChange={(e) => handlePaymentChange(idx, 'paidOn', e.target.value)}
                                        className="w-full py-1 text-xs text-gray-500 bg-transparent border-none focus:ring-0 px-0"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-end pt-4 border-t border-gray-100">
                            <button 
                                onClick={handleSave}
                                disabled={isPending}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
                            >
                                <Save size={18} />
                                {isPending ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentFees;