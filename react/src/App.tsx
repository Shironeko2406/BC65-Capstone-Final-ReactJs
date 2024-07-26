import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { store } from "./Redux/store";
import { Provider } from "react-redux";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import TemplateUI from "./Pages/TempUI/TemplateUI";
import ProjectManagement from "./Pages/ProjectManagement";
import CreateProject from "./Pages/CreateProject";
import UserManagement from "./Pages/UserManagement";

function App() {
  return (
    <>
      <BrowserRouter>
        <Provider store={store}>
          <Routes>
            <Route path="" element={<Login />}></Route>
            <Route path="home" element={<TemplateUI></TemplateUI>}>
              <Route path="" element={<ProjectManagement></ProjectManagement>}></Route>
              <Route path="createProject" element={<CreateProject></CreateProject>}></Route>
              <Route
                path=""
                element={<ProjectManagement></ProjectManagement>}
              ></Route>
              <Route
                path="user-list"
                element={<UserManagement></UserManagement>}
              ></Route>
            </Route>
            <Route path="register" element={<Register></Register>}></Route>
          </Routes>
        </Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
