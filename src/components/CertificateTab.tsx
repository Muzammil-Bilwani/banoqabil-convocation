import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Alert, Button, Flex, Input, Typography, type InputRef } from 'antd'
import { InboxOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import { updatePassStatus, type PassStatus } from '../api/convocation'
import ScanResult from './ScanResult'

const { Title, Text } = Typography

function CertificateTab() {
  const [passNumber, setPassNumber] = useState('')
  const inputRef = useRef<InputRef>(null)

  const mutation = useMutation({
    mutationFn: ({
      passNumber,
      status,
    }: {
      passNumber: string
      status: PassStatus
    }) => updatePassStatus(passNumber, status),
    onSuccess: () => {
      setPassNumber('')
      inputRef.current?.focus()
    },
  })

  const handleSubmit = (status: PassStatus) => {
    const value = passNumber.trim()
    if (!value || mutation.isPending) return
    mutation.mutate({ passNumber: value, status })
  }

  return (
    <Flex
      vertical
      align="center"
      gap={16}
      className="scan-panel"
      style={{ paddingTop: 48, paddingBottom: 32 }}
    >
      <div className="scan-icon">
        <SafetyCertificateOutlined />
      </div>
      <Flex vertical align="center" gap={4}>
        <Title level={4} style={{ margin: 0 }}>
          Convocation Hand Over &amp; Certificate
        </Title>
        <Text type="secondary">
          Enter the pass number, then choose the action
        </Text>
      </Flex>
      <Input
        ref={inputRef}
        className="scan-input"
        size="large"
        placeholder="Pass Number"
        value={passNumber}
        onChange={(e) => setPassNumber(e.target.value)}
        onPressEnter={() => handleSubmit('ConvocationKitReceived')}
        autoFocus
        style={{ maxWidth: 340, height: 52 }}
      />
      <Flex gap={12} style={{ width: 340 }}>
        <Button
          className="btn-gradient"
          type="primary"
          size="large"
          icon={<InboxOutlined />}
          onClick={() => handleSubmit('ConvocationKitReceived')}
          disabled={!passNumber.trim()}
          loading={
            mutation.isPending &&
            mutation.variables?.status === 'ConvocationKitReceived'
          }
          style={{ flex: 1, height: 46 }}
        >
          Kit Received
        </Button>
        <Button
          size="large"
          icon={<SafetyCertificateOutlined />}
          onClick={() => handleSubmit('CertificateHandover')}
          disabled={!passNumber.trim()}
          loading={
            mutation.isPending &&
            mutation.variables?.status === 'CertificateHandover'
          }
          style={{ flex: 1, height: 46 }}
        >
          Certificate
        </Button>
      </Flex>

      {mutation.isError && (
        <Alert
          type="error"
          showIcon
          message={mutation.error.message}
          style={{ maxWidth: 480, width: '100%' }}
        />
      )}
      {mutation.isSuccess && <ScanResult result={mutation.data} />}
    </Flex>
  )
}

export default CertificateTab
