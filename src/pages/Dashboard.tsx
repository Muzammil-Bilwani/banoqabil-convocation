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
      <Header className="dash-header">
        <Flex align="center" gap={10}>
          <img src={LOGO_URL} alt="Bano Qabil" className="dash-logo" />
          <Text strong className="dash-title">
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
          <Text type="secondary" className="dash-username">
            {user.name}
          </Text>
          <Button size="small" icon={<LogoutOutlined />} onClick={onLogout}>
            <span className="dash-logout-label">Logout</span>
          </Button>
        </Flex>
      </Header>

      <Content className="dash-content">
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
                    <CheckCircleOutlined />
                    <span>Attendance</span>
                  </Flex>
                ),
                children: <AttendanceTab />,
              },
              {
                key: 'kit-handover',
                label: (
                  <Flex align="center" gap={8}>
                    <GiftOutlined />
                    <span className="tab-label-full">
                      Convocation Kit Handover
                    </span>
                    <span className="tab-label-short">Kit Handover</span>
                  </Flex>
                ),
                children: <KitHandoverTab />,
              },
              {
                key: 'certificate',
                label: (
                  <Flex align="center" gap={8}>
                    <SafetyCertificateOutlined />
                    <span className="tab-label-full">
                      Kit Receive & Certificate Issue
                    </span>
                    <span className="tab-label-short">Kit & Cert</span>
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
