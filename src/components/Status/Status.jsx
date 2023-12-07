import React, {useEffect, useState} from 'react'
import girl from "./images/girl.jpg";
import "../Status/Status.css";
import pic from './images/32 Spooky Pics to Chill Your Bones and Creep Your Jeepers.jpg'
import pic2 from './images/1.jpg'
import pic3 from './images/myprofile.jpg'
import pic4 from './images/79fabdbfcf5d6295df58536fb5386f85.jpg'
import pic5 from './images/8.jpg'
import pic6 from './images/10.jpg'
import pic7 from './images/How to Dress Your Age As a Man.jpg'



function Status() {
  let currentActiveIndexOfStory = 0

  const storyFullView = document.querySelector(".stories-full-view");
  const storyImageFullView = document.querySelector('.stories-full-view .story img');
  const storyAuthorName = document.querySelector('.stories-full-view .story .author')
  const storiesContent = document.querySelector(".stories-container .content");
  const prevBtn = document.querySelector(".stories-container .previous-btn");
  const nextBtn = document.querySelector(".stories-container .next-btn");

  const updateFullView = ()=>{
    storyImageFullView.src = allStories[currentActiveIndexOfStory].imageUrl
    storyAuthorName.innerHTML = allStories[currentActiveIndexOfStory].author
  }

  const showFulView = (recievedIndex) => {
    currentActiveIndexOfStory = recievedIndex
    updateFullView()
    storyFullView.classList.add("active");
  };
  
  const [allStories, setAllStories] = useState([])

  useEffect(()=>{
    setAllStories([
      {
        id: 0,
        author: "Luna Belle",
        imageUrl: pic,
      },

      {
        id: 1,
        author: "Willow Grace",
        imageUrl: girl,
      },

      {
        id: 2,
        author: "Emma Smith",
        imageUrl: pic4,
      },

      {
        id: 3,
        author: "Ruby",
        imageUrl: pic3,
      },

      {
        id: 4,
        author: "Karen",
        imageUrl: pic2,
      },

      {
        id: 5,
        author: "Hazel Jade",
        imageUrl: pic5,
      },

      {
        id: 6,
        author: "Eden",
        imageUrl: pic7,
      },

      {
        id: 7,
        author: "Flora",
        imageUrl: pic,
      },

      {
        id: 8,
        author: "Nathaniel",
        imageUrl: pic6,
      },
    ]);
  }, [])

  return (
    <>
      <div className="stories-container">
        <div
          className="content"
          onScroll={() => {
            if (storiesContent.scrollLeft <= 24) {
              prevBtn.classList.remove("active");
            } else {
              prevBtn.classList.add("active");
            }

            let maxScrollValue =
              storiesContent.scrollWidth - storiesContent.clientWidth - 24;

            if (storiesContent.scrollLeft >= maxScrollValue) {
              nextBtn.classList.remove("active");
            } else {
              nextBtn.classList.add("active");
            }
          }}
        >
          <div
            className="previous-btn"
            onClick={() => (storiesContent.scrollLeft -= 300)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </div>

          <div className="stories">
            {allStories.map((story, index) => (
              <div
                key={story.id}
                className="story"
                onClick={() => showFulView(index)}
              >
                <img src={story.imageUrl} alt="" />
                <div className="author">{story.author}</div>
              </div>
            ))}
          </div>

          <div
            className="next-btn active"
            onClick={() => (storiesContent.scrollLeft += 300)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="stories-full-view">
        <div
          onClick={() => storyFullView.classList.remove("active")}
          className="close-btn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <div className="content">
          <div
            className="previous-btn"
            onClick={() => {
              if (currentActiveIndexOfStory <= 0) {
                return;
              }
              currentActiveIndexOfStory--;
              updateFullView();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </div>

          <div className="story">
            <img src="" alt="pic" />
            <div className="author">Author</div>
          </div>

          <div
            className="next-btn"
            onClick={() => {
              if (currentActiveIndexOfStory >= allStories.length - 1) {
                return;
              }
              currentActiveIndexOfStory++;
              updateFullView();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}

export default Status
