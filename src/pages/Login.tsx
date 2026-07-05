import { useMutation } from '@tanstack/react-query'
import { Alert, Button, Card, Flex, Form, Input, Typography } from 'antd'
import { LockOutlined, MailOutlined } from '@ant-design/icons'

const LOGO_URL =
  'https://website-assests-v2.s3.us-east-1.amazonaws.com/logo.png'
import { login, saveSession, type LoginPayload, type User } from '../api/auth'

const { Title, Text } = Typography

interface LoginProps {
  onLogin: (user: User) => void
}

function Login({ onLogin }: LoginProps) {
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      saveSession(data)
      onLogin(data.user)
    },
  })

  return (
    <div className="login-bg">
      <div className="login-blob login-blob--one" />
      <div className="login-blob login-blob--two" />

      <Card className="login-card">
        <Flex vertical gap={4} style={{ marginBottom: 28 }}>
          <img
            src={LOGO_URL}
            alt="Bano Qabil"
            style={{ height: 56, width: 'fit-content', marginBottom: 12 }}
          />
          <Title level={3} style={{ margin: 0 }}>
            Welcome back
          </Title>
          <Text type="secondary">Sign in to manage the convocation</Text>
        </Flex>

        {mutation.isError && (
          <Alert
            type="error"
            message={mutation.error.message}
            style={{ marginBottom: 16 }}
            showIcon
          />
        )}

        <Form<LoginPayload>
          layout="vertical"
          onFinish={(values) => mutation.mutate(values)}
          requiredMark={false}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Enter a valid email' },
            ]}
          >
            <Input
              size="large"
              prefix={<MailOutlined style={{ color: '#9aa5a3' }} />}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Password is required' }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined style={{ color: '#9aa5a3' }} />}
              placeholder="Your password"
              autoComplete="current-password"
            />
          </Form.Item>

          <Button
            className="btn-gradient"
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={mutation.isPending}
          >
            Sign in
          </Button>
        </Form>
      </Card>
    </div>
  )
}

export default Login
