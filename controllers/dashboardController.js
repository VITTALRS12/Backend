const User = require('../models/User');
const Order = require('../models/Order');

exports.getDashboardMetrics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const paidUsers = await User.countDocuments({ isPaidUser: true });

    const activeContests = 15; // Replace with real logic if needed

    // 🧠 Aggregate revenue from 'totalAmount' or fallback to 'total'
    const totalRevenueAgg = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: {
              $cond: [
                { $ifNull: ["$totalAmount", false] },
                "$totalAmount",
                "$total"
              ]
            }
          }
        }
      }
    ]);

    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    res.json({
      totalUsers: {
        value: totalUsers,
        growth: 12, // mock growth %
        description: "Active platform users",
      },
      paidUsers: {
        value: paidUsers,
        percentage: 8, // mock
        ratio: totalUsers
          ? `${((paidUsers / totalUsers) * 100).toFixed(1)}% of total users`
          : "0%",
      },
      activeContests: {
        value: activeContests,
        status: "Ongoing contests",
      },
      totalRevenue: {
        value: totalRevenue,
        currency: "₹",
        growth: 18, // mock %
        period: "Last 30 days",
      },
    });
  } catch (error) {
    console.error("Dashboard Metrics Error:", error);
    res.status(500).json({ message: "Failed to load dashboard metrics" });
  }
};


exports.getUserGrowth = async (req, res) => {
  const monthlyGrowth = await User.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        users: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } }
  ]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const chartData = months.map((month, index) => {
    const data = monthlyGrowth.find(d => d._id === index + 1);
    return { period: month, users: data ? data.users : 0 };
  });

  res.json(chartData);
};

exports.getOrderAnalytics = async (req, res) => {
  const monthlyOrders = await Order.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        orders: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } }
  ]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const chartData = months.map((month, index) => {
    const data = monthlyOrders.find(d => d._id === index + 1);
    return { month, orders: data ? data.orders : 0 };
  });

  res.json(chartData);
};
