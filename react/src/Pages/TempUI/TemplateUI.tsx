// import React, { useState } from "react";
// import {
//   DesktopOutlined,
//   FolderOutlined,
//   LogoutOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
// import type { MenuProps } from "antd";
// import { Breadcrumb, Layout, Menu, theme } from "antd";
// import {
//   NavLink,
//   Outlet,
//   useLocation,
//   useNavigate,
//   useParams,
// } from "react-router-dom";
// import {
//   removeDataTextStorage,
//   TOKEN_AUTHOR,
//   USER_LOGIN,
// } from "../../Util/UtilFunction";
// import logo from "../../../public/assets/img/logo/logo.svg";

// const { Header, Content, Footer, Sider } = Layout;

// type MenuItem = Required<MenuProps>["items"][number];

// function getItem(
//   label: React.ReactNode,
//   key: React.Key,
//   icon?: React.ReactNode,
//   children?: MenuItem[]
// ): MenuItem {
//   return {
//     key,
//     icon,
//     children,
//     label,
//   } as MenuItem;
// }

// const items: MenuItem[] = [
//   getItem("User", "/home", <UserOutlined />),
//   getItem("Project", "sub1", <FolderOutlined />, [
//     getItem("Project Management", "/home/project", <DesktopOutlined />),
//     getItem("Create Project", "/home/create-project", <DesktopOutlined />),
//   ]),
//   getItem("Logout", "logout", <LogoutOutlined />),
// ];

// type Props = {};

// const TemplateUI = (props: Props) => {
//   const [collapsed, setCollapsed] = useState(false);
//   const {
//     token: { colorBgContainer, borderRadiusLG },
//   } = theme.useToken();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();

//   const getTitle = (pathname: string, id?: string) => {
//     switch (pathname) {
//       case "/home":
//         return "User Management";
//       case "/home/create-project":
//         return "Create Project";
//       case "/home/project":
//         return "Project Management";
//       case `/home/projectdetail/${id}`:
//         return "Task Management";

//       // thêm các case
//       default:
//         return "Dashboard";
//     }
//   };

//   const generateBreadcrumbItems = (path: string) => {
//     const pathNames = path.split("/").filter((i) => i);
//     return pathNames.map((name, index) => {
//       const routeTo = `/${pathNames.slice(0, index + 1).join("/")}`;
//       return (
//         <Breadcrumb.Item key={routeTo}>
//           <NavLink to={routeTo}>{name}</NavLink>
//         </Breadcrumb.Item>
//       );
//     });
//   };

//   const onMenuClick: MenuProps["onClick"] = (e) => {
//     if (e.key === "logout") {
//       removeDataTextStorage(USER_LOGIN);
//       removeDataTextStorage(TOKEN_AUTHOR);
//       navigate("/");
//     } else {
//       navigate(e.key);
//     }
//   };

//   return (
//     <Layout style={{ minHeight: "100vh" }}>
//       <Sider
//         collapsible
//         collapsed={collapsed}
//         onCollapse={(value) => setCollapsed(value)}
//         width={230}
//       >
//         <div
//           className="logo-container"
//           style={{ padding: "16px", textAlign: "center" }}
//         >
//           <img
//             src={logo}
//             alt="Logo"
//             style={{ width: "100%", maxWidth: "120px" }}
//           />
//         </div>
//         <Menu
//           theme="dark"
//           defaultSelectedKeys={[location.pathname]}
//           selectedKeys={[location.pathname]}
//           mode="inline"
//           items={items}
//           onClick={onMenuClick}
//         />
//       </Sider>
//       <Layout>
//         <Header className="bg-white d-flex align-items-center px-3">
//           <div className="container-fluid">
//             <h1 className="mb-0 fs-4 fw-bold">
//               {getTitle(location.pathname, id)}
//             </h1>
//           </div>
//         </Header>
//         <Content style={{ margin: "0 16px" }}>
//           <Breadcrumb style={{ margin: "16px 0" }}>
//             {generateBreadcrumbItems(location.pathname)}
//           </Breadcrumb>
//           <div
//             style={{
//               padding: 24,
//               minHeight: 500,
//               background: colorBgContainer,
//               borderRadius: borderRadiusLG,
//             }}
//           >
//             <Outlet></Outlet>
//           </div>
//         </Content>
//         <Footer style={{ textAlign: "center" }}>
//           Ant Design ©{new Date().getFullYear()} Created by Ant UED
//         </Footer>
//       </Layout>
//     </Layout>
//   );
// };

// export default TemplateUI;

import React, { useState } from "react";
import {
  DesktopOutlined,
  FolderOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme, Avatar, Dropdown, Breadcrumb } from "antd";
import {
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  Link,
  NavLink,
} from "react-router-dom";
import {
  removeDataTextStorage,
  TOKEN_AUTHOR,
  USER_LOGIN,
} from "../../Util/UtilFunction";
import logo from "../../../public/assets/img/logo/logo.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("User", "/home", <UserOutlined />),
  getItem("Project", "sub1", <FolderOutlined />, [
    getItem("Project Management", "/home/project", <DesktopOutlined />),
    getItem("Create Project", "/home/create-project", <DesktopOutlined />),
  ]),
];

const TemplateUI: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const userLogin = useSelector(
    (state: RootState) => state.UsersReducer.userLogin
  );
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const getTitle = (pathname: string, id?: string) => {
    switch (pathname) {
      case "/home":
        return "User Management";
      case "/home/create-project":
        return "Create Project";
      case "/home/project":
        return "Project Management";
      case `/home/projectdetail/${id}`:
        return "Task Management";
      case "/home/profile":
        return "User Profile";
      default:
        return "Dashboard";
    }
  };

    const generateBreadcrumbItems = (path: string) => {
    const pathNames = path.split("/").filter((i) => i);
    return pathNames.map((name, index) => {
      const routeTo = `/${pathNames.slice(0, index + 1).join("/")}`;
      return (
        <Breadcrumb.Item key={routeTo}>
          <NavLink to={routeTo}>{name}</NavLink>
        </Breadcrumb.Item>
      );
    });
  };

  const onMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "logout") {
      removeDataTextStorage(USER_LOGIN);
      removeDataTextStorage(TOKEN_AUTHOR);
      navigate("/");
    } else {
      navigate(e.key);
    }
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/home/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item
        key="logout"
        onClick={() => onMenuClick({ key: "logout" } as any)}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={230}
      >
        <div
          className="logo-container"
          style={{ padding: "16px", textAlign: "center" }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ width: "100%", maxWidth: "120px" }}
          />
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={[location.pathname]}
          selectedKeys={[location.pathname]}
          mode="inline"
          items={items}
          onClick={onMenuClick}
        />
      </Sider>
      <Layout>
        <Header className="bg-white d-flex justify-content-between align-items-center px-3">
          <div className="container-fluid">
            <h1 className="mb-0 fs-4 fw-bold">
              {getTitle(location.pathname, id)}
            </h1>
          </div>
          {userLogin && (
            <Dropdown overlay={userMenu} trigger={["click"]}>
              <div
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  maxWidth: "200px",
                  whiteSpace: "nowrap",
                }}
              >
                <Avatar
                  src={userLogin.avatar}
                  style={{ flexShrink: 0, marginRight: 8 }}
                />
                <span>Hello, {userLogin.name}</span>
              </div>
            </Dropdown>
          )}
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            {generateBreadcrumbItems(location.pathname)}
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              minHeight: 360,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default TemplateUI;
