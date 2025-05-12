import { Layout as AntdLayout, Avatar, Button, Flex, Menu, theme, Typography } from 'antd';
import { Outlet } from 'react-router-dom';
import { useGoogleApi } from '../GoogleLoginApiProvider';
import styled from 'styled-components';

const { Header, Content } = AntdLayout;

const AntdLayoutWrapper = styled(AntdLayout)`
    .header {
        display: flex;
        align-items: center;
        padding: 0 48px;

        @media screen and (max-width: 1199px) {
            padding: 0 24px;
        }

        .header-logo {
            padding: 4px 12px 4px 0;
        }

        .logo-letter {
            color: #fff;
            margin-bottom: 0;
        }

        .header-login {
            display: flex;
            align-items: center;
            gap: 12px;
            color: #fff;
            margin-left: auto;
        }

        .profile-text {
            color: #fff;
        }
    }

    .content {
        padding: 24px 48px;
        background-color: #fff;

        @media screen and (max-width: 1199px) {
            padding: 24px;
        }
    }
`;

function Layout() {
    const { authLoaded, isSignedIn, signIn, signOut, currentUser } = useGoogleApi();

    return (
        <AntdLayoutWrapper>
            <Header className='header'>
                <Flex className='header-logo'>
                    <Typography.Title level={3} className='logo-letter'>
                        Zoo Insect Hub
                    </Typography.Title>
                </Flex>
                <Menu
                    theme='dark'
                    mode='horizontal'
                    defaultSelectedKeys={['1']}
                    items={[{ key: '1', label: 'Home' }]}
                    style={{ flex: 1, minWidth: 0 }}
                />
                <div className='header-login'>
                    {authLoaded ? (
                        <>
                            {isSignedIn && currentUser ? (
                                <>
                                    <Avatar src={currentUser.image} alt={currentUser.name} />
                                    <Typography.Text className='profile-text'>{currentUser.name}</Typography.Text>
                                    <Button onClick={signOut}>Sign Out</Button>
                                </>
                            ) : (
                                <Button type='primary' onClick={signIn}>
                                    Sign In with Google
                                </Button>
                            )}
                        </>
                    ) : (
                        'Loading...'
                    )}
                </div>
            </Header>
            <Content className='content'>
                <Outlet />
            </Content>
        </AntdLayoutWrapper>
    );
}

export default Layout;
