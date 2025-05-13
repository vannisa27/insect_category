import { Layout as AntdLayout, Avatar, Button, Drawer, Flex, Menu, theme, Typography } from 'antd';
import { Outlet } from 'react-router-dom';
import { useGoogleApi } from '../GoogleLoginApiProvider';
import styled from 'styled-components';
import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Header, Content } = AntdLayout;

const AntdLayoutWrapper = styled(AntdLayout)`
    .header {
        display: flex;
        align-items: center;
        padding: 0 48px;

        @media screen and (max-width: 1199px) {
            padding: 0 24px;
        }

        @media screen and (max-width: 768px) {
            justify-content: space-between;
            padding: 0 12px;
        }

        .header-logo {
            padding: 4px 12px 4px 0;
        }

        .logo-letter {
            color: #fff;
            margin-bottom: 0;
            white-space: nowrap;

            /* @media screen and (max-width: 576px) {
                font-size: 0;

                &::first-letter {
                    font-size: 24px;
                }
            } */
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

        .header-content {
            display: flex;
            width: 100%;

            @media screen and (max-width: 768px) {
                display: none;
            }
        }

        .header-content-mobile {
            display: none;

            @media screen and (max-width: 768px) {
                display: block;
            }
        }
    }

    .content {
        padding: 24px 48px;
        background-color: #fff;

        @media screen and (max-width: 1199px) {
            padding: 24px;
        }

        @media screen and (max-width: 576px) {
            padding: 24px 12px;
        }
        @media screen and (max-width: 320px) {
            padding: 24px 6px;
        }
    }
`;

function Layout() {
    const { authLoaded, isSignedIn, signIn, signOut, currentUser } = useGoogleApi();
    const [open, setOpen] = useState(false);

    return (
        <AntdLayoutWrapper>
            <Header className='header'>
                <Flex className='header-logo'>
                    <Typography.Title level={3} className='logo-letter'>
                        Zoo Insect Hub
                    </Typography.Title>
                </Flex>
                <div className='header-content'>
                    <Menu
                        theme='dark'
                        mode='horizontal'
                        defaultSelectedKeys={['1']}
                        items={[{ key: '1', label: 'Home' }]}
                        style={{ flex: 1, minWidth: 0 }}
                        className='header-menu'
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
                </div>
                <div className='header-content-mobile'>
                    <Button onClick={() => setOpen(true)}>
                        <MenuOutlined />
                    </Button>
                    <Drawer
                        title={
                            <Flex justify='space-between'>
                                <Typography.Title level={4}>Zoo Insect Hub</Typography.Title>
                                <Button size='small' variant='text' color='danger' onClick={() => setOpen(false)}>
                                    <CloseOutlined style={{ fontSize: 24 }} />
                                </Button>
                            </Flex>
                        }
                        styles={{
                            content: {
                                padding: 12,
                            },
                            body: {
                                paddingLeft: 0,
                                paddingRight: 0,
                            },
                            header: {
                                paddingLeft: 0,
                                paddingRight: 0,
                            },
                        }}
                        width={500}
                        open={open}
                        placement='left'
                        closable={false}
                        onClose={() => setOpen(false)}
                    >
                        <div className='header-login-mobile'>
                            {authLoaded ? (
                                <>
                                    {isSignedIn && currentUser ? (
                                        <Flex wrap justify='space-between' gap={12}>
                                            <Flex justify='space-between' align='center' gap={12}>
                                                <Avatar src={currentUser.image} alt={currentUser.name} />
                                                <Typography.Text className='profile-text'>{currentUser.name}</Typography.Text>
                                            </Flex>
                                            <Button color='danger' variant='solid' onClick={signOut}>
                                                Sign Out
                                            </Button>
                                        </Flex>
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
                        <hr />
                        <Menu
                            // theme='dark'
                            mode='vertical'
                            defaultSelectedKeys={['1']}
                            items={[{ key: '1', label: 'Home' }]}
                            style={{ flex: 1, minWidth: 0 }}
                            className='header-menu-mobile'
                        />
                    </Drawer>
                </div>
            </Header>
            <Content className='content'>
                <Outlet />
            </Content>
        </AntdLayoutWrapper>
    );
}

export default Layout;
