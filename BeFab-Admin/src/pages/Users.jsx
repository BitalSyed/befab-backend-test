import { API_URL, getCookie } from "@/components/cookieUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserTable } from "@/components/user-table";
import Dashboard from "@/components/users-activity";
import { Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: getCookie("skillrextech_auth"),
          }),
        });

        const data = await response.json();

        if (data.error) {
          toast.error(data.error);
        } else {
          setUsers(data);
          setData(data.otherUsers);
        }
      } catch (error) {
        console.error("Error during login:", error);
        toast.error("An error occurred. Please try again.");
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Apply filters and sorting whenever any filter/sort changes
    let filteredUsers = users.otherUsers || [];

    console.log(filteredUsers)

    // Apply search filter
    if (searchTerm) {
      filteredUsers = filteredUsers.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.role && user.role.includes(searchTerm.toLowerCase())))
    }

    // Apply role filter
    if (roleFilter !== "all") {
      filteredUsers = filteredUsers.filter(user => user.role.includes(roleFilter));
    }

    // Apply sorting
    filteredUsers = [...filteredUsers].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "name":
          comparison = a.firstName.localeCompare(b.firstName);
          break;
        case "email":
          comparison = a.email.localeCompare(b.email);
          break;
        case "role":
          comparison = (a.role[0] || "").localeCompare(b.role[0] || "");
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    setData(filteredUsers);
  }, [users, searchTerm, roleFilter, sortBy, sortDirection]);

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === "asc" ? "desc" : "asc");
  };

  const navigate = useNavigate();

  // Function to export all user data
  const exportUserData = () => {
    if (!users || Object.keys(users).length === 0) {
      toast.error("No data to export");
      return;
    }

    // Convert the JSON data to CSV format
    const convertToCSV = (data) => {
      const csvRows = [];
      
      // Handle currentUser
      if (data.currentUser) {
        const currentUser = data.currentUser;
        const currentUserRow = {
          "Type": "Current User",
          "ID": currentUser._id,
          "First Name": currentUser.firstName,
          "Last Name": currentUser.lastName,
          "Username": currentUser.userName,
          "Email": currentUser.email,
          "Roles": currentUser.role.join(", "),
          "Points": currentUser.points,
          "Created At": currentUser.createdAt,
          "Show Email": currentUser.privacySettings?.showEmail || false
        };
        csvRows.push(currentUserRow);
      }
      
      // Handle otherUsers
      if (data.otherUsers && data.otherUsers.length > 0) {
        data.otherUsers.forEach(user => {
          const userRow = {
            "Type": "Other User",
            "ID": user._id,
            "First Name": user.firstName,
            "Last Name": user.lastName,
            "Username": user.userName,
            "Email": user.email,
            "Roles": user.role.join(", "),
            "Points": user.points,
            "Created At": user.createdAt,
            "Show Email": user.privacySettings?.showEmail || false
          };
          csvRows.push(userRow);
        });
      }
      
      // Handle logs
      if (data.logs && data.logs.length > 0) {
        data.logs.forEach(log => {
          const logRow = {
            "Type": "Log",
            "Log ID": log._id,
            "User ID": log.user?._id || "",
            "Event Type": log.eventType,
            "Description": log.description,
            "Timestamp": log.timestamp,
            "Email": log.email
          };
          csvRows.push(logRow);
        });
      }
      
      // Handle counts
      if (data.counts) {
        const countsRow = {
          "Type": "Counts",
          "Total Users": data.counts.totalUsers,
          "Admin Count": data.counts.adminCount,
          "Member Count": data.counts.memberCount
        };
        csvRows.push(countsRow);
      }
      
      // Handle activity
      if (data.activity) {
        const activityRow = {
          "Type": "Activity",
          "Active Users": data.activity.activeUsers,
          "Inactive Users": data.activity.inactiveUsers
        };
        csvRows.push(activityRow);
      }
      
      // Convert to CSV string
      if (csvRows.length === 0) return "";
      
      const headers = Object.keys(csvRows[0]);
      const csvArray = [
        headers.join(","), // header row first
        ...csvRows.map(row => 
          headers.map(fieldName => 
            `"${String(row[fieldName] || '').replace(/"/g, '""')}"`
          ).join(',')
        )
      ];
      
      return csvArray.join('\n');
    };
    
    // Create CSV data
    const csvData = convertToCSV(users);
    
    if (!csvData) {
      toast.error("No data to export");
      return;
    }
    
    // Create a blob with the data
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    
    // Trigger the download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("User data exported successfully as CSV");
  };

  return (
    <div className="flex flex-col gap-4 py-4 px-4 lg:px-6 md:gap-6 md:py-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Users</h1>
            <p className="text-sm text-gray-600">
              Manage all user accounts and permissions
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={exportUserData} className="cursor-pointer">
              <svg
                width="109"
                height="44"
                viewBox="0 0 109 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.719727"
                  y="1.47998"
                  width="107.52"
                  height="41.46"
                  rx="7.5"
                  fill="white"
                />
                <rect
                  x="0.719727"
                  y="1.47998"
                  width="107.52"
                  height="41.46"
                  rx="7.5"
                  stroke="#D1D5DB"
                />
                <path
                  d="M26.46 14.71C26.46 14.1568 26.0131 13.71 25.46 13.71C24.9068 13.71 24.46 14.1568 24.46 14.71V22.2943L22.1662 20.0006C21.7756 19.61 21.1412 19.61 20.7506 20.0006C20.36 20.3912 20.36 21.0256 20.7506 21.4162L24.7506 25.4162C25.1412 25.8068 25.7756 25.8068 26.1662 25.4162L30.1662 21.4162C30.5568 21.0256 30.5568 20.3912 30.1662 20.0006C29.7756 19.61 29.1412 19.61 28.7506 20.0006L26.46 22.2943V14.71ZM19.46 24.71C18.3568 24.71 17.46 25.6068 17.46 26.71V27.71C17.46 28.8131 18.3568 29.71 19.46 29.71H31.46C32.5631 29.71 33.46 28.8131 33.46 27.71V26.71C33.46 25.6068 32.5631 24.71 31.46 24.71H28.2881L26.8725 26.1256C26.0912 26.9068 24.8256 26.9068 24.0443 26.1256L22.6318 24.71H19.46ZM30.96 26.46C31.1589 26.46 31.3496 26.539 31.4903 26.6796C31.6309 26.8203 31.71 27.011 31.71 27.21C31.71 27.4089 31.6309 27.5996 31.4903 27.7403C31.3496 27.8809 31.1589 27.96 30.96 27.96C30.761 27.96 30.5703 27.8809 30.4296 27.7403C30.289 27.5996 30.21 27.4089 30.21 27.21C30.21 27.011 30.289 26.8203 30.4296 26.6796C30.5703 26.539 30.761 26.46 30.96 26.46Z"
                  fill="#374151"
                />
                <path
                  d="M42.7889 27.7202V16.0839H50.0844V17.5952H44.5446V21.1407H49.7037V22.6464H44.5446V26.2089H50.1526V27.7202H42.7889ZM53.6341 18.9929L55.5602 22.3907L57.5034 18.9929H59.3614L56.6398 23.3566L59.3841 27.7202H57.5261L55.5602 24.4589L53.6 27.7202H51.7364L54.4523 23.3566L51.7705 18.9929H53.6341ZM61.1057 30.9929V18.9929H62.7648V20.4077H62.9068C63.0053 20.2259 63.1474 20.0157 63.333 19.777C63.5186 19.5384 63.7761 19.3301 64.1057 19.152C64.4352 18.9702 64.8708 18.8793 65.4125 18.8793C66.1171 18.8793 66.7458 19.0573 67.2989 19.4134C67.8519 19.7695 68.2856 20.2827 68.6 20.9532C68.9182 21.6236 69.0773 22.4304 69.0773 23.3736C69.0773 24.3168 68.9201 25.1255 68.6057 25.7998C68.2913 26.4702 67.8595 26.9873 67.3102 27.3509C66.761 27.7107 66.1341 27.8907 65.4296 27.8907C64.8993 27.8907 64.4655 27.8017 64.1284 27.6236C63.7951 27.4456 63.5337 27.2373 63.3443 26.9986C63.1549 26.76 63.0091 26.5479 62.9068 26.3623H62.8046V30.9929H61.1057ZM62.7705 23.3566C62.7705 23.9702 62.8595 24.5081 63.0375 24.9702C63.2155 25.4323 63.4731 25.7941 63.8102 26.0554C64.1474 26.313 64.5602 26.4418 65.0489 26.4418C65.5564 26.4418 65.9807 26.3073 66.3216 26.0384C66.6625 25.7657 66.9201 25.3964 67.0943 24.9304C67.2724 24.4645 67.3614 23.9399 67.3614 23.3566C67.3614 22.7808 67.2743 22.2638 67.1 21.8054C66.9296 21.3471 66.672 20.9854 66.3273 20.7202C65.9864 20.4551 65.5602 20.3225 65.0489 20.3225C64.5564 20.3225 64.1398 20.4494 63.7989 20.7032C63.4618 20.957 63.2061 21.3111 63.0318 21.7657C62.8576 22.2202 62.7705 22.7505 62.7705 23.3566ZM74.6568 27.8964C73.8386 27.8964 73.1246 27.7089 72.5148 27.3339C71.9049 26.9589 71.4314 26.4342 71.0943 25.76C70.7572 25.0857 70.5886 24.2979 70.5886 23.3964C70.5886 22.491 70.7572 21.6994 71.0943 21.0214C71.4314 20.3433 71.9049 19.8168 72.5148 19.4418C73.1246 19.0668 73.8386 18.8793 74.6568 18.8793C75.475 18.8793 76.189 19.0668 76.7989 19.4418C77.4087 19.8168 77.8822 20.3433 78.2193 21.0214C78.5564 21.6994 78.725 22.491 78.725 23.3964C78.725 24.2979 78.5564 25.0857 78.2193 25.76C77.8822 26.4342 77.4087 26.9589 76.7989 27.3339C76.189 27.7089 75.475 27.8964 74.6568 27.8964ZM74.6625 26.4702C75.1928 26.4702 75.6322 26.3301 75.9807 26.0498C76.3292 25.7695 76.5868 25.3964 76.7534 24.9304C76.9239 24.4645 77.0091 23.9513 77.0091 23.3907C77.0091 22.8339 76.9239 22.3225 76.7534 21.8566C76.5868 21.3869 76.3292 21.01 75.9807 20.7259C75.6322 20.4418 75.1928 20.2998 74.6625 20.2998C74.1284 20.2998 73.6852 20.4418 73.333 20.7259C72.9845 21.01 72.725 21.3869 72.5546 21.8566C72.3879 22.3225 72.3046 22.8339 72.3046 23.3907C72.3046 23.9513 72.3879 24.4645 72.5546 24.9304C72.725 25.3964 72.9845 25.7695 73.333 26.0498C73.6852 26.3301 74.1284 26.4702 74.6625 26.4702ZM80.6213 27.7202V18.9929H82.2634V20.3793H82.3543C82.5134 19.9096 82.7937 19.5403 83.1952 19.2714C83.6005 18.9986 84.0588 18.8623 84.5702 18.8623C84.6762 18.8623 84.8012 18.866 84.9452 18.8736C85.0929 18.8812 85.2084 18.8907 85.2918 18.902V20.527C85.2236 20.5081 85.1024 20.4873 84.9281 20.4645C84.7539 20.438 84.5796 20.4248 84.4054 20.4248C84.0039 20.4248 83.6459 20.51 83.3315 20.6804C83.0209 20.8471 82.7747 21.0801 82.5929 21.3793C82.4111 21.6748 82.3202 22.0119 82.3202 22.3907V27.7202H80.6213ZM91.3514 18.9929V20.3566H86.5844V18.9929H91.3514ZM87.8628 16.902H89.5617V25.1577C89.5617 25.4873 89.6109 25.7354 89.7094 25.902C89.8079 26.0649 89.9348 26.1767 90.0901 26.2373C90.2492 26.2941 90.4215 26.3225 90.6071 26.3225C90.7435 26.3225 90.8628 26.313 90.9651 26.2941C91.0673 26.2751 91.1469 26.26 91.2037 26.2486L91.5105 27.652C91.412 27.6899 91.2719 27.7278 91.0901 27.7657C90.9082 27.8073 90.681 27.8301 90.4082 27.8339C89.9613 27.8414 89.5446 27.7619 89.1582 27.5952C88.7719 27.4285 88.4594 27.171 88.2207 26.8225C87.9821 26.474 87.8628 26.0365 87.8628 25.51V16.902Z"
                  fill="#374151"
                />
              </svg>
            </button>

            <Button onClick={()=>navigate('/new-user')} className="bg-[#862633] text-white ml-auto py-5.25">
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center justify-between bg-white p-4 px-6 rounded-md shadow-sm">
          <div className="flex flex-wrap gap-2 items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search users by name, email or role..."
                className="pl-10 w-80 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px] text-sm">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                {/* Add more roles as needed */}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center text-sm text-gray-500 space-x-4">
            Sort By:&emsp;
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px] text-sm">
                <SelectValue placeholder="Name" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="role">Role</SelectItem>
              </SelectContent>
            </Select>
            <button onClick={toggleSortDirection}>
             <svg
                width="19"
                height="17"
                viewBox="0 0 19 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.77421 15.5898C5.58369 15.7959 5.31821 15.9146 5.03712 15.9146C4.75602 15.9146 4.49054 15.7959 4.30003 15.5898L1.55155 12.5914C1.17989 12.1854 1.20487 11.5514 1.61402 11.1797C2.02317 10.808 2.65407 10.833 3.02573 11.2422L4.03767 12.3447V2.92181C4.03767 2.36899 4.4843 1.92236 5.03712 1.92236C5.58993 1.92236 6.03656 2.36899 6.03656 2.92181V12.3447L7.0485 11.2391C7.42017 10.833 8.05419 10.8049 8.46021 11.1766C8.86624 11.5483 8.89435 12.1823 8.52268 12.5883L5.77421 15.5866V15.5898ZM10.0343 10.9174C10.0343 10.3645 10.481 9.91792 11.0338 9.91792H15.0316C15.4345 9.91792 15.7999 10.1615 15.956 10.5363C16.1122 10.9111 16.0248 11.339 15.7405 11.6263L13.4481 13.9157H15.0316C15.5844 13.9157 16.031 14.3623 16.031 14.9151C16.031 15.468 15.5844 15.9146 15.0316 15.9146H11.0338C10.6309 15.9146 10.2655 15.671 10.1093 15.2962C9.95313 14.9214 10.0406 14.4935 10.3248 14.2062L12.6173 11.9168H11.0338C10.481 11.9168 10.0343 11.4702 10.0343 10.9174ZM13.0327 1.92236C13.4106 1.92236 13.7573 2.13475 13.9259 2.47518L15.9248 6.47296L16.4245 7.4724C16.6713 7.96588 16.4714 8.56555 15.9779 8.81228C15.4844 9.05902 14.8848 8.85913 14.638 8.36566L14.4132 7.91903H11.6522L11.4273 8.36566C11.1806 8.85913 10.5809 9.05902 10.0874 8.81228C9.59396 8.56555 9.39407 7.96588 9.64081 7.4724L10.1405 6.47296L12.1394 2.47518C12.3081 2.13475 12.6548 1.92236 13.0327 1.92236ZM12.4018 6.41986H13.6636L13.0327 5.15806L12.4018 6.41986Z"
                  fill="#6B7280"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <UserTable data={data} />
      <Dashboard data={users} />
    </div>
  );
};

export default Users;