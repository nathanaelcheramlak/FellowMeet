'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import UserCard from '../components/UserCard';
import SelectInput from '@/components/SelectInput';
import './globals.css';

const placeholder =
  'https://png.pngtree.com/png-clipart/20220621/original/pngtree-default-placeholder-businessman-half-length-portr-png-image_8168517.png';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ department: '', team: '' });
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [toggleFilter, setToggleFilters] = useState(true);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Reference to the profile image container to detect click outside
  const profileMenuRef = useRef(null);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    console.log(filters);
  };

  // Fetch users when the component mounts
  useEffect(() => {
    const authUser = async () => {
      try {
        const response = await fetch(
          'https://fellowmeet.onrender.com//api/auth/verify',
          {
            credentials: 'include',
          },
        );
        if (response.ok) {
          const data = await response.json();
          console.log('Current User: ', data.user);
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.log('Error checking sign-in status', error);
        setCurrentUser(null);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          'https://fellowmeet.onrender.com//api/user',
          {
            credentials: 'include',
          },
        );
        if (response.ok) {
          const data = await response.json();
          setUsers(data.filter((user) => user.team != null));
          setFilteredUsers(data.filter((user) => user.team != null));
        }
      } catch (error) {
        console.log('Error Fetching Users Data.');
      } finally {
        setLoading(false);
      }
    };
    authUser();
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchQuery) {
      const regex = new RegExp(searchQuery, 'i');
      filtered = filtered.filter(
        (user) =>
          regex.test(user.fullName) ||
          regex.test(user.department) ||
          regex.test(user.team),
      );
    }

    // Toggle filter
    if (toggleFilter) {
      if (filters.department) {
        filtered = filtered.filter(
          (user) => user.department === filters.department,
        );
      }
      if (filters.team) {
        filtered = filtered.filter((user) => user.team === filters.team);
      }
    } else {
      setFilters({ department: '', team: '' });
    }

    setFilteredUsers(filtered);
  }, [users, filters.department, filters.team, toggleFilter, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(
        'https://fellowmeet.onrender.com//api/auth/logout',
        {
          method: 'DELETE',
          credentials: 'include',
        },
      );

      if (!response.ok) {
        console.log('Error Logging out.');
        return;
      }
      setUsers([]);
      router.push('/login');
    } catch (error) {
      console.log('Error Logging out:', error);
    }
  };

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  const handleClickOutside = (e) => {
    // Close the menu if the user clicks outside the profile menu
    if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
      setMenuOpen(false);
    }
  };

  // Event listener for clicks outside to close the menu
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 sm:px-6 lg:px-8 py-8">
      <header className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center py-4 sm:py-6 mb-6 sm:mb-8 bg-white shadow-md rounded-lg px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-500 mb-4 sm:mb-0">
          FellowMeet
        </h1>
        {currentUser ? (
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 relative">
            <h2 className="text-gray-800 font-semibold text-center sm:text-left">
              {currentUser.fullName}
            </h2>
            <div className="relative mt-2 sm:mt-0" ref={profileMenuRef}>
              <img
                src={currentUser.image || placeholder}
                alt="User Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
              />

              {menuOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-40 p-2 text-gray-700">
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={handleEditProfile}
                  >
                    Edit Profile
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <a
            href="/signup"
            className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
            Create Account
          </a>
        )}
      </header>

      <div className=" w-full max-w-4xl bg-white mt-4 rounded-[0.5rem_0.5rem_0_0] shadow-md p-4 sm:p-6">
        <div className="flex">
          <input
            className="mb-4 border-2 border-gray-500 px-4 py-2 rounded-[0.5rem] min-w-[40%] outline-none"
            placeholder="Search a member"
            value={searchQuery}
            onChange={handleSearch}
          />
          <button
            onClick={() => setToggleFilters(!toggleFilter)}
            className="flex gap-4 items-center bg-orange-500 text-white py-[0.6rem] px-6 rounded-md mx-8 mb-4 hover:bg-orange-400"
          >
            Filters {toggleFilter ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        {toggleFilter && (
          <div className="transition-[0.3s] duration-[ease]">
            <SelectInput
              name="department"
              value={filters.department}
              onChange={handleChange}
              options={[
                { value: 'Computer-Science', label: 'Computer Science' },
                { value: 'Statistics', label: 'Statistics' },
                { value: 'Physics', label: 'Physics' },
                { value: 'Mathematics', label: 'Mathematics' },
                { value: 'Biology', label: 'Biology' },
                { value: 'Chemistry', label: 'Chemistry' },
                { value: 'Geology', label: 'Geology' },
              ]}
            />

            <SelectInput
              name="team"
              value={filters.team}
              onChange={handleChange}
              options={[
                { value: 'Action-Team', label: 'Action Team' },
                { value: 'Bible-Study-Team', label: 'Bible Study Team' },
                { value: 'I4U-Team', label: 'I4U Team' },
                { value: 'Literature-Team', label: 'Literature Team' },
                { value: 'Prayer-Team', label: 'Prayer Team' },
                { value: 'Worship-Team', label: 'Worship Team' },
                { value: 'Just-Member', label: 'Just Member' },
              ]}
            />
          </div>
        )}
      </div>

      <hr></hr>

      <main className="w-full max-w-4xl bg-white rounded-[0_0_0.5rem_0.5rem] shadow-md p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
          Current Fellow Members ({filteredUsers ? filteredUsers.length : 0})
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="loader ease-linear rounded-full border-4 border-blue-500 border-t-white h-12 w-12 animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))
            ) : (
              <p className="text-gray-600 text-center col-span-full">
                No members found.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
