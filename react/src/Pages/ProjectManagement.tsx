import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Avatar,
  Tooltip,
  Dropdown,
  Select,
  Menu,
  Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined, CloseOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { DispatchType, RootState } from "../Redux/store";
import {
  AssignUsersToProjectActionAsync,
  DeleteProjectActionAsync,
  GetProjectAllActionAsync,
  RemoveUserFromProjectActionAsync,
} from "../Redux/Reducers/ProjectReducer";
import { Creator, Member, Project } from "../Models/ProjectModalType";
import EditProject from "./Modals/ProjectDrawer/EditProject";
import { GetProjectCategoryActionAsync } from "../Redux/Reducers/ProjectCategoryReducer";
import { getUserListApi } from "../Redux/Reducers/UsersReducer";
import { UserInfo } from "../Models/UserModalType";
import { NavLink } from "react-router-dom";
import { useLoading } from "../Contexts/LoadingContext";

const { Option } = Select;

const ProjectManagement = () => {
  const { setLoading } = useLoading();
  const { projectList } = useSelector(
    (state: RootState) => state.ProjectReducer
  );
  const { userList } = useSelector((state: RootState) => state.UsersReducer);
  const dispatch: DispatchType = useDispatch();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [visibleMemberDropdown, setVisibleMemberDropdown] = useState<{
    [key: number]: number | null;
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          dispatch(GetProjectAllActionAsync()),
          dispatch(GetProjectCategoryActionAsync()),
          dispatch(getUserListApi()),
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, setLoading]);

  const showDrawer = (project: Project) => {
    setSelectedProject(project);
    setIsDrawerVisible(true);
  };

  const onCloseDrawer = () => {
    setIsDrawerVisible(false);
    setSelectedProject(null);
  };

  const deleteProject = async (id: number) => {
    setLoading(true);
    try {
      await dispatch(DeleteProjectActionAsync(id));
    } finally {
      setLoading(false);
    }
  };

  const handleAddMembers = async (projectId: number) => {
    setLoading(true);
    try {
      if (selectedMembers.length > 0) {
        await dispatch(
          AssignUsersToProjectActionAsync(projectId, selectedMembers)
        );
        setSelectedMembers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (projectId: number, userId: number) => {
    setLoading(true);
    try {
      await dispatch(RemoveUserFromProjectActionAsync(projectId, userId));
    } finally {
      setLoading(false);
    }
  };

  const renderAddMemberDropdown = (project: Project) => (
    <Select
      mode="multiple"
      style={{ width: 250 }}
      placeholder="Add user"
      value={selectedMembers}
      onChange={(value) => setSelectedMembers(value)}
      onDropdownVisibleChange={(open) => {
        if (!open) {
          setSelectedMembers([]);
        }
      }}
      showSearch
      filterOption={(input, option) => {
        const label = option?.label;
        if (typeof label === "string") {
          return label.toLowerCase().includes(input.toLowerCase());
        }
        return false;
      }}
      dropdownRender={(menu) => (
        <>
          {menu}
          <Button
            type="primary"
            block
            onClick={() => handleAddMembers(project.id)}
            disabled={selectedMembers.length === 0}
          >
            Add Members
          </Button>
        </>
      )}
      className="custom-select"
    >
      {userList
        .filter(
          (user: UserInfo) =>
            user.userId !== project.creator.id &&
            !project.members
              .map((member) => member.userId)
              .includes(user.userId)
        )
        .map((user: UserInfo) => (
          <Option key={user.userId} value={user.userId} label={user.name}>
            <div className="demo-option-label-item">
              <Avatar src={user.avatar} /> {user.name}
            </div>
          </Option>
        ))}
    </Select>
  );

  const renderMemberDropdown = (project: Project) => (
    <Menu>
      {project.members.map((member: Member) => (
        <Menu.Item key={member.userId}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar src={member.avatar} size="small" />
            <span style={{ marginLeft: 8, flexGrow: 1 }}>{member.name}</span>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => handleRemoveMember(project.id, member.userId)}
            />
          </div>
        </Menu.Item>
      ))}
    </Menu>
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: Project, b: Project) => a.id - b.id,
    },
    {
      title: "Project Name",
      dataIndex: "projectName",
      key: "projectName",
      render: (text: string, record: Project) => (
        <NavLink to={`/home/projectdetail/${record.id}`}>{text}</NavLink>
      ),
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Creator",
      dataIndex: "creator",
      key: "creator",
      render: (creator: Creator) => <Tag color="green">{creator.name}</Tag>,
    },
    {
      title: "Members",
      dataIndex: "members",
      key: "members",
      render: (members: Member[], project: Project) => {
        const maxVisibleAvatars = 2;
        const visibleMembers = members.slice(0, maxVisibleAvatars);
        const hiddenMembersCount = members.length - maxVisibleAvatars;

        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {visibleMembers.map((member: Member, index: number) => (
              <Dropdown
                key={member.userId}
                overlay={() => renderMemberDropdown(project)}
                visible={visibleMemberDropdown[project.id] === member.userId}
                onVisibleChange={(visible) => {
                  setVisibleMemberDropdown((prev) => ({
                    ...prev,
                    [project.id]: visible ? member.userId : null,
                  }));
                }}
                arrow
              >
                <div
                  style={{
                    position: "relative",
                    marginLeft: index > 0 ? -12 : 0, // Overlap avatars
                    zIndex: visibleMembers.length - index, // Stack avatars
                    cursor: "pointer",
                  }}
                >
                  <Avatar src={member.avatar} size="large" />
                </div>
              </Dropdown>
            ))}
            {hiddenMembersCount > 0 && (
              <Tooltip
                title={
                  <div>
                    {members.slice(maxVisibleAvatars).map((member) => (
                      <div key={member.userId} style={{ marginBottom: 8 }}>
                        <Avatar src={member.avatar} size="small" />
                        <span style={{ marginLeft: 8 }}>{member.name}</span>
                      </div>
                    ))}
                  </div>
                }
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: -12,
                    zIndex: 0,
                  }}
                >
                  <Avatar style={{ backgroundColor: "#f56a00" }} size="large">
                    +{hiddenMembersCount}
                  </Avatar>
                </span>
              </Tooltip>
            )}
            <Dropdown
              overlay={() => renderAddMemberDropdown(project)}
              trigger={["click"]}
              arrow
            >
              <Button type="dashed" shape="circle" icon={"+"} />
            </Dropdown>
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (record: Project) => (
        <span>
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => showDrawer(record)}
            className="me-2"
          />
          <Popconfirm
            title="Are you sure you want to delete this project?"
            onConfirm={() => deleteProject(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button shape="circle" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={projectList} rowKey="id" />
      <EditProject
        visible={isDrawerVisible}
        onClose={onCloseDrawer}
        project={selectedProject}
      />
    </>
  );
};

export default ProjectManagement;
