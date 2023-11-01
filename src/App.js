import {
  Route,
  Routes,
} from "react-router-dom";
import PostFeed from './components/Allposts/PostFeed';
import Sidebar from './components/SideBar/Sidebar'
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup'
import ProfilePage from '../src/components/Profile/ProfilePage'
// import Comments from "./components/Comments/Comments";
import EditProfile from "./components/Profile/EditProfile";
import CommentPage from "./components/Comments/CommentPage";
import FriendProfile from "./components/Profile/FriendProfile";
import EditPost from "./components/EditPost/EditPost";
import Searched from "./components/Search/Searched";

const userName = localStorage.getItem("Username");
// const userToken = localStorage.getItem("Token")

function App() {

  return (
    <>
      <Routes>
        <Route element={<Sidebar />}>
          <Route path="/feed" element={<PostFeed />} />
          <Route path="/editpost/:postId" element={<EditPost />} />
          <Route
            path="/profile"
            element={<ProfilePage username={userName} />}
          />
          <Route
            path="/edit-profile"
            element={<EditProfile username={userName} />}
          />
          <Route path="/comments/:postID" element={<CommentPage username = {userName} />} />
          <Route path="/profile-for/:username/:user_id" element={<FriendProfile userName = {userName} />} />
          <Route path="/searched/:searchedWord" element={<Searched/>}/>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  ); 
}

export default App;
