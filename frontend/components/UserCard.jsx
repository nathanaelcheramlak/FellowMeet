'use client';
import { useState, useEffect, useRef } from 'react';
import {
  FaGraduationCap,
  FaUserCircle,
  FaBirthdayCake,
  FaBible,
  FaChurch,
} from 'react-icons/fa';
import { IoIosMail } from 'react-icons/io';

import './userCard.css';

const placeholder =
  'https://png.pngtree.com/png-clipart/20220621/original/pngtree-default-placeholder-businessman-half-length-portr-png-image_8168517.png';

const UserCard = ({ user }) => {
  const formatDate = (date) => {
    const months = {
      '01': 'January',
      '02': 'February',
      '03': 'March',
      '04': 'April',
      '05': 'May',
      '06': 'June',
      '07': 'July',
      '08': 'August',
      '09': 'September',
      10: 'October',
      11: 'November',
      12: 'December',
    };
    date = date.slice(0, 10);
    const month = date.split('-')[1];
    const day = date.split('-')[2];
    return `${months[month]} ${day}`;
  };

  // Handle mail icon click
  const handleMailClick = () => {
    if (user.email) {
      window.location.href = `mailto:${user.email}`;
    }
  };

  return (
    <div className="card border-[white] border-[1px] relative">
      <div className="badge bg-red-600 text-white border-none font-thin">
        {user.team?.replace('-', ' ')}
      </div>
      <div className="icon-wrapper">
        <IoIosMail
          className="icon bg-blue-400 text-white hover:bg-blue-600 cursor-pointer"
          onClick={handleMailClick}
        />
      </div>

      <div className="image-wrapper">
        <img src={user.image || placeholder} alt="Profile Image" />
        <div className="gradient-overlay"></div>
        <div className="name">{user.fullName}</div>
      </div>

      <div className="info flex flex-col justify-between gap-1">
        {user.department && (
          <p>
            <FaGraduationCap /> {user.department.replace('-', ' ')} (
            {user.batch})
          </p>
        )}

        {user.churchName && (
          <p>
            <FaChurch /> {user.churchName}
          </p>
        )}

        {user.favVerse && (
          <p>
            <FaBible /> {user.favVerse}
          </p>
        )}

        {user.bio && (
          <p>
            <FaUserCircle /> &quot;{user.bio}&quot;
          </p>
        )}
        {user.dateOfBirth && (
          <p>
            <FaBirthdayCake /> {formatDate(user.dateOfBirth)}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserCard;
