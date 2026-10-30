import React, { useState, useEffect, useRef } from "react";
import "./Animations.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import EmojiPanel from "../emojis/EmojiPanel";
import { FaArrowRight } from "react-icons/fa";
import { gsap } from "gsap";
import Mainloading from "../Loaders/Mainloading";
import { getFirestore, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// -------- Images (VERIFY these match your actual filenames) --------
import samred from "../images/Samred.jpg";        // adjust if needed
import samred2 from "../images/samred2.png";      // adjust if needed
import meGreen from "../images/me green.jpg";     // adjust if needed
import sun from "../images/sun.jpg";              // adjust if needed
import headshot2 from "../images/headshot2.jpg";
import rejuveblack from "../images/black.png";

// -------- Videos --------
import keeperx from "../chars/Keeperx.mp4";
import coral from "../chars/Coralshow.mp4";
import babs from "../chars/Babzy2.mp4";
import silent from "../chars/silent.mp4";
import lizzie from "../chars/Lizzie2.mp4";

const firebaseConfig = {
  apiKey: "AIzaSyAuUZ0mJvFy177CFvTsmutS2bO0FsTJ_9M",
  authDomain: "rejuv-1d74f.firebaseapp.com",
  projectId: "rejuv-1d74f",
  storageBucket: "rejuv-1d74f.firebasestorage.app",
  messagingSenderId: "963584606168",
  appId: "1:963584606168:web:58ae46f67fb0294219fcad",
  measurementId: "G-EBNXBFTFYG",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const pictureSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: false,
  fade: true,
};

const Animations = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

const [motivationalBackground, setMotivationalBackground] = useState("#000000");
  const [fontColor, setFontColor] = useState("#000000");
  const [highlightColor, setHighlightColor] = useState("#000000");
  const [emojibg, setEmojibg] = useState("#000000");
  const [emojistroke, setEmojistroke] = useState("#000000");
  const [emojitxt, setEmojitxt] = useState("#FFFFFF");
  const [isLoading, setIsLoading] = useState(true);

  const shortsref = useRef(null);
  const butref = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Seed Firestore docs
  useEffect(() => {
    const seed = async () => {
      for (const id of [15, 16, 17, 18, 19]) {
        const q = query(collection(db, "Videos"), where("videoid", "==", id));
        const snap = await getDocs(q);
        if (snap.empty) {
          await addDoc(collection(db, "Videos"), {
            title: "",
            clown: 0,
            love: 0,
            laugh: 0,
            smile: 0,
            dislike: 0,
            bored: 0,
            cool: 0,
            videoid: id,
          });
        }
      }
    };
    seed();
  }, []);

  // 3s loader gate
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Entrance animations
  useEffect(() => {
    if (isLoading) return;
    if (shortsref.current) {
      gsap.set(shortsref.current, { opacity: 0, y: 40 });
      gsap.to(shortsref.current, { duration: 1, opacity: 1, y: 0, ease: "power3.out", delay: 0.6 });
    }
    if (butref.current) {
      gsap.set(butref.current, { opacity: 0, y: 40 });
      gsap.to(butref.current, { duration: 1, opacity: 1, y: 0, ease: "power3.out", delay: 1.4 });
    }
  }, [isLoading]);

  const videoRefs = {
    keeperx: useRef(null),
    coral: useRef(null),
    babs: useRef(null),
    silent: useRef(null),
    lizzie: useRef(null),
  };

  const handleVideoClick = (id, a) => {
    Object.keys(videoRefs).forEach((key) => {
      if (key !== id && videoRefs[key].current) {
        videoRefs[key].current.pause();
      }
    });
    setMotivationalBackground(a.bg);
    setFontColor(a.font);
    setHighlightColor(a.highlight);
    setEmojibg(a.bg);
    setEmojistroke(a.highlight);
    setEmojitxt(a.font);
  };

  const goToOtherProjects = () => {
    navigate("/");
  };

  // Slideshow images: samred, samred2, me green, sun (plus two existing for variety)
  const pictures = [rejuveblack,samred, samred2, meGreen, sun, headshot2 ];

  const anims = [
    {
      id: "keeperx",
      title: "1. Keep Moving Forward",
      video: keeperx,
      type: "video/mp4",
      desc: "This is an animation I did to motivate myself and everyone I work with. The character is based on me.",
      bg: "#FFFFFF",
      font: "#000000",
      highlight: "#000000",
      vidid: 15,
      date: "August 7 2025",
    },
    {
      id: "coral",
      title: "2. Coral from Guardians of Nature",
      video: coral,
      type: "video/mp4",
      desc: 'A comic book adaptation from "Guardians of Nature" by illustrator and comic book artist Cathy Nsibirwa.',
      bg: "#AAEBFE",
      font: "#000000",
      highlight: "#000000",
      vidid: 16,
      date: "May 2026",
    },
    {
      id: "babs",
      title: "3. Babs — StepQuiz",
      video: babs,
      type: "video/mp4",
      desc: "Babs is a character in StepQuiz, an app like Duolingo for STEM learning.",
      bg: "#EDC497",
      font: "#000000",
      highlight: "#000000",
      vidid: 17,
      date: "December 2024",
    },
    {
      id: "silent",
      title: "4. Silent — Lip Sync Test",
      video: silent,
      type: "video/mp4",
      desc: "A lipsync test and trial animation.",
      bg: "#C05E49",
      font: "#000000",
      highlight: "#000000",
      vidid: 18,
      date: "November 2023",
    },
    {
      id: "lizzie",
      title: "5. Lizzie — New Character in the Works",
      video: lizzie,
      type: "video/mp4",
      desc: "Lizzie is a new character currently in development.",
      bg: "#E6E6FA",
      font: "#000000",
      highlight: "#000000",
      vidid: 19,
      date: "September 2026",
    },
  ];

  return (
    <>
      {isLoading ? (
        <Mainloading />
      ) : (
        <div className="anim-container">
          {/* Pictures at the top */}
          <div className="top-section">
            <h2>Rejuv Character Animation</h2>
            <Slider {...pictureSettings} className="slider-container">
              {pictures.map((img, i) => (
                <div key={i} className="slide-wrapper">
                  <img src={img} alt={"Rejuv " + (i + 1)} className="top-pic" />
                </div>
              ))}
            </Slider>
          </div>

          {/* About Sam Nungi */}
      <div className="about-section">
    <h2>About Me</h2>
    <p className="about-text">
      Hi, I&apos;m <strong>Sam Nungi</strong>, a 2d animator working under the brand I
      started, <strong>Rejuv</strong>. These are some of the animation projects Ive worked on over the years. I create    <strong>2D animations in Moho, Adobe After Effects, and Blender Grease Pencil</strong>.
  . 
       I&apos;ve also trained other
      animators in 2D animation and collaborated with individuals and organisations on different creative projects.
      
      Whether it&apos;s subtle gestures, full-body movement, or any kind of action, I can
      create <strong>any character animation</strong> you need  bringing
      personalities to life, one frame at a time.
    </p>
  </div>

          {/* Character Animations */}
          <div
            ref={shortsref}
            className="motivational-shorts-section"
            style={{ backgroundColor: motivationalBackground }}
          >
            <div className="anim-list">
              <h2 style={{ color: fontColor }}>Character Animations</h2>
              <p className="section-note" style={{ color: fontColor }}>
                A selection of character animations I&apos;ve created.
              </p>
              {anims.map((a) => (
                <div
                  key={a.id}
                  className="video-container bordered"
                  style={{ color: fontColor }}
                >
                  <h2 style={{ color: fontColor }}>{a.title}</h2>
                  <p style={{ color: fontColor }}>{a.desc}</p>

                  <video
                    ref={videoRefs[a.id]}
                    preload="auto"
                    controls
                    width="100%"
                    className="motivational-video"
                    onPlay={() => handleVideoClick(a.id, a)}
                  >
                    <source src={a.video} type={a.type} />
                    Your browser does not support the video tag.
                  </video>

                  <EmojiPanel
                    backgroundColor={emojibg}
                    strokecolor={emojistroke}
                    textcolor={emojitxt}
                    vidid={a.vidid}
                  />

                  <h5 style={{ color: fontColor, marginTop: "10px", cursor: "cell" }}>
                    <span style={{ color: highlightColor }}>Animated by Nungi Sam</span>{" "}
                    <span>{a.date}</span>
                  </h5>
                </div>
              ))}
            </div>
          </div>

          {/* Other Projects */}
          <div ref={butref} className="other-section">
            <h2>Other Projects</h2>
            <p>Explore more of our work on the main page.</p>
            <button className="about-me-btn" onClick={goToOtherProjects}>
              View Other Projects{" "}
              <span style={{ marginLeft: "8px" }}>
                <FaArrowRight />
              </span>
            </button>
          </div>

          <div className="footer-contact">
            <p>email - rejuveanimation@gmail.com</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Animations;