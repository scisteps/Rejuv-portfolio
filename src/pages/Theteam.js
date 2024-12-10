import React, { useState, useEffect } from "react";
import Slider from "react-slick"; // Import react-slick
import "slick-carousel/slick/slick.css"; // Slick carousel styles
import "slick-carousel/slick/slick-theme.css"; // Slick carousel theme styles
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";

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

const Theteam = ({ alias, imagesa }) => { // Accept images as props
  const [contributor, setContributor] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const fetchContributor = async () => {
      try {
        const contributorsRef = collection(db, "Contributors");
        const q = query(contributorsRef, where("alias", "==", alias));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const contributorData = querySnapshot.docs[0].data();
          console.log("Fetched contributor data:", contributorData);
          setContributor(contributorData);
        } else {
          console.warn("No contributor found with the provided alias.");
        }
      } catch (error) {
        console.error("Error fetching contributor data: ", error);
      }
    };

    fetchContributor();
  }, [alias]);

  const handleToggle = () => {
    setShowMore((prevShowMore) => !prevShowMore);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Slider settings
  const sliderSettings = {
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    className: "slick-carousel-container",
  };

  return (
    <div className="team-container">
      <br />
      <br />
      <br />

      {contributor ? (
        <div style={{  display: isMobile ? 'block' : 'flex',padding:'10px'}} className={isMobile ? "team-content-section2" : "team-content-section"}>
          {/* Left Image Section */}
          <div style={{marginRight:'10px'}} className={"mobile-profile" }>
            <Slider {...sliderSettings}>
              {imagesa.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={`Team ${index}`}
                    className="profile-image"
                    style={{ width: "100%", height: "auto" }} // Easy customization for image size
                  />
                </div>
              ))}
            </Slider>
          </div>
<br/>
<br/>
          {/* Right Text Section */}
          <div  style={{marginLeft:'10px'}}className="text-container">
            <p className="left-aligned">
              Name: <span className="highlight">{contributor.name}</span>
            </p>
            <p className="left-aligned">
              Role: <span className="highlight">{contributor.role}</span>
            </p>

            {showMore && (
              <>
               <p className="left-aligned">
  More about me:{" "}
  {contributor.info && contributor.info.length > 200 ? (  // Change 200 to the desired character limit
    <>
      <span>{contributor.info.slice(0, 200)}...</span> {/* Display the first part */}
      <br /> {/* Add a line break */}
      <span>{contributor.info.slice(200)}</span> {/* Display the second part */}
    </>
  ) : (
    <span>{contributor.info || "No additional information available."}</span>
  )}
</p>

                
              </>
            )}

            <button onClick={handleToggle} className="read-more-btn">
              {showMore ? "Read Less" : "Read More"}
            </button>
          </div>
        </div>
      ) : (
        <p>Loading contributor data...</p>
      )}
    </div>
  );
};

export default Theteam;
