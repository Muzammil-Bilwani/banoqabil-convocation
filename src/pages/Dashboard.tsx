import { Avatar, Button, Card, Flex, Layout, Tabs, Typography } from 'antd'
import {
  CheckCircleOutlined,
  GiftOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'

const LOGO_URL =
  'https://website-assests-v2.s3.us-east-1.amazonaws.com/logo.png'
import type { User } from '../api/auth'
import AttendanceTab from '../components/AttendanceTab'
import KitHandoverTab from '../components/KitHandoverTab'
import CertificateTab from '../components/CertificateTab'

const { Header, Content } = Layout
const { Text } = Typography

interface DashboardProps {
  user: User
  onLogout: () => void
}

function Dashboard({ user, onLogout }: DashboardProps) {
  return (
    <Layout className="dash-layout">
      <Header
        className="dash-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingInline: 24,
        }}
      >
        <Flex align="center" gap={10}>
          <img src={LOGO_URL} alt="Bano Qabil" style={{ height: 36 }} />
          <Text strong style={{ fontSize: 16 }}>
            Convocation
          </Text>
        </Flex>
        <Flex align="center" gap={12}>
          <Avatar
            size="small"
            style={{ background: 'linear-gradient(135deg, #2d8e84, #45b3a6)' }}
          >
            {user.name.charAt(0)}
          </Avatar>
          <Text type="secondary">{user.name}</Text>
          <Button size="small" icon={<LogoutOutlined />} onClick={onLogout}>
            Logout
          </Button>
        </Flex>
      </Header>

      <Content style={{ padding: 24 }}>
        <Card className="dash-card" styles={{ body: { paddingTop: 8 } }}>
          <Tabs
            className="full-tabs"
            size="large"
            defaultActiveKey="attendance"
            destroyOnHidden
            items={[
              {
                key: 'attendance',
                label: (
                  <Flex align="center" gap={8}>
                    <CheckCircleOutlined /> Attendance
                  </Flex>
                ),
                children: <AttendanceTab />,
              },
              {
                key: 'kit-handover',
                label: (
                  <Flex align="center" gap={8}>
                    <GiftOutlined /> Convocation Kit Handover
                  </Flex>
                ),
                children: <KitHandoverTab />,
              },
              {
                key: 'certificate',
                label: (
                  <Flex align="center" gap={8}>
                    <SafetyCertificateOutlined /> Hand Over & Certificate
                  </Flex>
                ),
                children: <CertificateTab />,
              },
            ]}
          />
        </Card>
      </Content>
    </Layout>
  )
}

export default Dashboard
