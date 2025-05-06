import {
  Layout as AntdLayout,
  Avatar,
  Button,
  Flex,
  Menu,
  theme,
  Typography,
} from "antd";
import { Outlet } from "react-router-dom";
import { useGoogleApi } from "../GoogleLoginApiProvider";

const { Header, Content } = AntdLayout;

function Layout() {
  const { authLoaded, isSignedIn, signIn, signOut, currentUser } =
    useGoogleApi();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <AntdLayout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <Flex className="demo-logo" style={{ padding: "4px 12px" }}>
          <Typography.Title
            level={3}
            style={{ color: "#fff", marginBottom: 0 }}
          >
            Zoo Insect Hub
          </Typography.Title>
        </Flex>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={[{ key: "1", label: "Home" }]}
          style={{ flex: 1, minWidth: 0 }}
        />
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#fff",
          }}
        >
          {authLoaded ? (
            <>
              {isSignedIn && currentUser ? (
                <>
                  <Avatar src={currentUser.image} alt={currentUser.name} />
                  <Typography.Text style={{ color: "#fff" }}>
                    {currentUser.name}
                  </Typography.Text>
                  <Button onClick={signOut}>Sign Out</Button>
                </>
              ) : (
                <Button type="primary" onClick={signIn}>
                  Sign In with Google
                </Button>
              )}
            </>
          ) : (
            "Loading..."
          )}
        </div>
      </Header>
      <Content>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 48,
          }}
        >
          <Outlet />
        </div>
      </Content>
    </AntdLayout>
  );
}

export default Layout;
