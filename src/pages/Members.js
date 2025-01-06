import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import './Members.css';
import me2 from '../images/samred2.png';
import me3 from '../images/Samred.jpg';
import syd1 from '../images/syd1.jpg';
import syd2 from '../images/syd2.jpg';
import syd3 from '../images/syd3.jpg';
import chill from '../images/avunie.jpg';
import shanetemp from '../images/shanetemp.jpg';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAuUZ0mJvFy177CFvTsmutS2bO0FsTJ_9M",
  authDomain: "rejuv-1d74f.firebaseapp.com",
  projectId: "rejuv-1d74f",
  storageBucket: "rejuv-1d74f.firebasestorage.app",
  messagingSenderId: "963584606168",
  appId: "1:963584606168:web:58ae46f67fb0294219fcad",
  measurementId: "G-EBNXBFTFYG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const MemberCard = ({ member, images }) => {
  const [showMore, setShowMore] = useState(false);

  const handleToggle = () => setShowMore(!showMore);

  return (
    <div className="member-card">
      <div className="card-content">
        <img
          src={images[0]}
          alt={`${member.name}`}
          className={`profile-images ${showMore ? 'expanded' : ''}`}
        />
        <div className="info-container">
          <h3>{member.name}</h3>
          <p>Alias: {member.alias}</p>
          <p>Role: {member.role}</p>
          {showMore && (
            <div className="more-info">
              <p>{member.info}</p>
            </div>
          )}
          <button onClick={handleToggle} className="view-more-btn">
            {showMore ? 'View Less' : 'View More'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Members = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const membersCollection = collection(db, 'Contributors');
      const membersSnapshot = await getDocs(membersCollection);
      const membersList = membersSnapshot.docs.map(doc => doc.data());
      setMembers(membersList);
    };
    fetchMembers();
  }, []);

  const getImagesForMember = (name) => {
    if (name === 'Sam Nkurunungi') {
      return [me3];
    } else if (name === 'Sydney ') {
      return [syd3];
    } else if (name === 'Avuni Elvis') {
      return [chill];
    } else if (name === 'Rukundo Shanewise') {
      return [shanetemp];
    }
    return [];
  };

  return (
    <div className="members-container">
      {members.map(member => (
        <MemberCard
          key={member.alias}
          member={member}
          images={getImagesForMember(member.name)}
        />
      ))}
    </div>
  );
};

export default Members;
